from flask import Flask, request, render_template_string, jsonify
import html2text

app = Flask(__name__)

# 前端 HTML 模板（内嵌 CSS，只有一个文件，方便部署）
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML to Markdown 在线转换器</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #f9fafb;
            margin: 0;
            padding: 20px;
            color: #1f2937;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        .sub {
            text-align: center;
            color: #6b7280;
            margin-bottom: 2rem;
        }
        .converter-box {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
        .panel {
            flex: 1;
            min-width: 300px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .panel-header {
            background: #f3f4f6;
            padding: 12px 16px;
            font-weight: 600;
            border-bottom: 1px solid #e5e7eb;
        }
        textarea, .markdown-output {
            width: 100%;
            padding: 16px;
            font-family: 'SF Mono', Monaco, Consolas, monospace;
            font-size: 14px;
            line-height: 1.5;
            border: none;
            resize: vertical;
            background: white;
            flex: 1;
        }
        textarea {
            border-bottom: 1px solid #e5e7eb;
        }
        .markdown-output {
            background: #fefce8;
            overflow: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        button {
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: 8px 20px;
            margin: 16px;
            border-radius: 40px;
            font-size: 1rem;
            cursor: pointer;
            transition: 0.2s;
            align-self: flex-start;
        }
        button:hover {
            background-color: #2563eb;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 0.85rem;
            color: #6b7280;
        }
        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }
        @media (max-width: 700px) {
            .converter-box {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <h1>📝 HTML → Markdown 转换器</h1>
    <div class="sub">粘贴 HTML 代码，立即得到 Markdown 格式</div>

    <div class="converter-box">
        <div class="panel">
            <div class="panel-header">📄 HTML 输入</div>
            <textarea id="htmlInput" rows="15" placeholder="在此粘贴或输入 HTML 代码..."></textarea>
            <button id="convertBtn">✨ 转换为 Markdown</button>
        </div>
        <div class="panel">
            <div class="panel-header">📝 Markdown 输出</div>
            <div id="markdownOutput" class="markdown-output"></div>
        </div>
    </div>
    <div class="footer">
        ⚡ 开源项目 · <a href="https://github.com/你的用户名/html-to-markdown-web" target="_blank">GitHub 仓库</a>
    </div>
</div>

<script>
    const convertBtn = document.getElementById('convertBtn');
    const htmlInput = document.getElementById('htmlInput');
    const markdownOutput = document.getElementById('markdownOutput');

    convertBtn.addEventListener('click', async () => {
        const html = htmlInput.value.trim();
        if (!html) {
            markdownOutput.innerText = '请先在左侧输入 HTML 内容';
            return;
        }

        markdownOutput.innerText = '⏳ 转换中...';

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ html: html })
            });
            const data = await response.json();
            if (data.markdown) {
                markdownOutput.innerText = data.markdown;
            } else {
                markdownOutput.innerText = '转换失败，请检查 HTML 格式';
            }
        } catch (err) {
            markdownOutput.innerText = '网络错误：' + err.message;
        }
    });
</script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/convert', methods=['POST'])
def convert():
    data = request.get_json()
    html = data.get('html', '')
    if not html:
        return jsonify({'markdown': ''})
    
    # 配置 html2text
    converter = html2text.HTML2Text()
    converter.body_width = 0          # 不自动换行
    converter.ignore_links = False    # 保留链接
    converter.ignore_images = False   # 保留图片
    converter.ignore_tables = False   # 保留表格
    
    markdown = converter.handle(html)
    return jsonify({'markdown': markdown})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
