from flask import Flask, request, jsonify, render_template_string
import html2text

app = Flask(__name__)

# 前端 HTML 模板（包含所有新功能）
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>HTML to Markdown 在线转换器</title>
    <!-- highlight.js 样式 (深色模式友好) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
    <style>
        /* CSS 变量 - 支持深色/浅色模式 */
        :root {
            --bg-body: #f9fafb;
            --bg-panel: #ffffff;
            --border-color: #e5e7eb;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
            --header-bg: #f3f4f6;
            --output-bg: #fefce8;
            --btn-bg: #3b82f6;
            --btn-hover: #2563eb;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        body.dark {
            --bg-body: #111827;
            --bg-panel: #1f2937;
            --border-color: #374151;
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            --header-bg: #374151;
            --output-bg: #1e293b;
            --btn-bg: #2563eb;
            --btn-hover: #3b82f6;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }
        * {
            box-sizing: border-box;
            transition: background-color 0.2s, color 0.2s;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: var(--bg-body);
            margin: 0;
            padding: 20px;
            color: var(--text-primary);
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
        }
        .sub {
            text-align: center;
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }
        /* 工具栏 */
        .toolbar {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }
        .toolbar button, .example-btn {
            background: var(--btn-bg);
            color: white;
            border: none;
            padding: 6px 14px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: 0.2s;
        }
        .toolbar button:hover, .example-btn:hover {
            background: var(--btn-hover);
        }
        .theme-btn {
            background: var(--text-secondary);
        }
        .converter-box {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
        .panel {
            flex: 1;
            min-width: 280px;
            background: var(--bg-panel);
            border-radius: 16px;
            box-shadow: var(--shadow);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .panel-header {
            background: var(--header-bg);
            padding: 12px 16px;
            font-weight: 600;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .copy-btn {
            background: var(--btn-bg);
            border: none;
            color: white;
            padding: 4px 10px;
            border-radius: 16px;
            cursor: pointer;
            font-size: 0.75rem;
        }
        textarea {
            width: 100%;
            padding: 16px;
            font-family: 'SF Mono', Monaco, Consolas, monospace;
            font-size: 14px;
            line-height: 1.5;
            border: none;
            background: var(--bg-panel);
            color: var(--text-primary);
            resize: vertical;
            flex: 1;
        }
        textarea:focus {
            outline: none;
        }
        .markdown-output {
            padding: 16px;
            background: var(--output-bg);
            overflow: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'SF Mono', Monaco, Consolas, monospace;
            font-size: 14px;
            line-height: 1.5;
            flex: 1;
            min-height: 300px;
        }
        /* 拖拽高亮 */
        .drag-over {
            border: 2px dashed var(--btn-bg);
            background: var(--bg-body);
        }
        .example-group {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 12px;
        }
        footer {
            text-align: center;
            margin-top: 40px;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        footer a {
            color: var(--btn-bg);
            text-decoration: none;
        }
        @media (max-width: 700px) {
            body { padding: 12px; }
            h1 { font-size: 1.5rem; }
            .converter-box { flex-direction: column; }
            .panel { min-width: auto; }
        }
    </style>
</head>
<body>
<div class="container">
    <h1>📝 HTML → Markdown 转换器</h1>
    <div class="sub">粘贴 HTML、拖拽文件或选择示例，实时转换</div>

    <div class="toolbar">
        <div class="example-group">
            <button class="example-btn" data-example="simple">📄 简单示例</button>
            <button class="example-btn" data-example="table">📊 表格示例</button>
            <button class="example-btn" data-example="code">💻 代码块示例</button>
        </div>
        <button id="themeToggle" class="theme-btn">🌙 深色模式</button>
    </div>

    <div class="converter-box">
        <div class="panel" id="inputPanel">
            <div class="panel-header">
                📄 HTML 输入
                <span style="font-size:12px; font-weight:normal;">💡 支持拖拽 .html 文件</span>
            </div>
            <textarea id="htmlInput" rows="15" placeholder="在此粘贴 HTML 代码，或拖拽 HTML 文件到此处..."></textarea>
        </div>
        <div class="panel">
            <div class="panel-header">
                📝 Markdown 输出
                <button id="copyBtn" class="copy-btn">📋 复制</button>
            </div>
            <div id="markdownOutput" class="markdown-output"></div>
        </div>
    </div>
    <footer>
        ⚡ 开源项目 · <a href="https://github.com/SEYYl/html-to-markdown-web" target="_blank">GitHub 仓库</a>
    </footer>
</div>

<script>
    // DOM 元素
    const htmlInput = document.getElementById('htmlInput');
    const markdownOutput = document.getElementById('markdownOutput');
    const copyBtn = document.getElementById('copyBtn');
    const themeToggle = document.getElementById('themeToggle');

    // 转换函数（调用后端）
    async function convertToMarkdown(html) {
        if (!html.trim()) {
            markdownOutput.innerText = '';
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
            if (data.markdown !== undefined) {
                markdownOutput.innerText = data.markdown;
                // 触发代码高亮（因为内容可能包含代码块）
                if (typeof hljs !== 'undefined') {
                    document.querySelectorAll('.markdown-output pre code').forEach((block) => {
                        hljs.highlightElement(block);
                    });
                }
            } else {
                markdownOutput.innerText = '转换失败，请检查 HTML 格式';
            }
        } catch (err) {
            markdownOutput.innerText = '网络错误：' + err.message;
        }
    }

    // 防抖函数
    let debounceTimer;
    function debounce(func, delay) {
        return function(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // 实时转换（带500ms防抖）
    const handleInput = debounce((e) => {
        convertToMarkdown(e.target.value);
    }, 500);
    htmlInput.addEventListener('input', handleInput);

    // 一键复制
    copyBtn.addEventListener('click', async () => {
        const text = markdownOutput.innerText;
        if (!text || text === '⏳ 转换中...') {
            alert('没有可复制的内容');
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            const originalText = copyBtn.innerText;
            copyBtn.innerText = '✅ 已复制';
            setTimeout(() => { copyBtn.innerText = originalText; }, 1500);
        } catch (err) {
            alert('复制失败，可手动选择');
        }
    });

    // 深色模式切换
    let isDark = false;
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        isDark = document.body.classList.contains('dark');
        themeToggle.innerText = isDark ? '☀️ 浅色模式' : '🌙 深色模式';
        // 重新高亮一下（因为背景变化不影响高亮，但为了让代码块样式适配）
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('.markdown-output pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    });
    // 初始检测系统主题（可选）
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
        themeToggle.innerText = '☀️ 浅色模式';
        isDark = true;
    }

    // 拖拽上传
    const inputPanel = document.getElementById('inputPanel');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        inputPanel.addEventListener(eventName, preventDefaults, false);
    });
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    ['dragenter', 'dragover'].forEach(eventName => {
        inputPanel.addEventListener(eventName, () => {
            inputPanel.classList.add('drag-over');
        }, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        inputPanel.addEventListener(eventName, () => {
            inputPanel.classList.remove('drag-over');
        }, false);
    });
    inputPanel.addEventListener('drop', handleDrop, false);
    async function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.html') || file.type === 'text/html') {
                const text = await file.text();
                htmlInput.value = text;
                convertToMarkdown(text);
            } else {
                alert('请拖拽 HTML 文件（.html）');
            }
        }
    }

    // 示例模板
    const examples = {
        simple: `<h1>欢迎使用转换器</h1>
<p>这是一个<strong>简单示例</strong>，包含<em>斜体</em>和<a href="https://example.com">链接</a>。</p>
<ul>
<li>列表项1</li>
<li>列表项2</li>
</ul>`,
        table: `<h2>产品价格表</h2>
<table border="1">
<thead>
<tr><th>产品</th><th>价格</th></tr>
</thead>
<tbody>
<tr><td>笔记本</td><td>¥29.9</td></tr>
<tr><td>鼠标</td><td>¥9.9</td></tr>
</tbody>
</table>`,
        code: `<h2>Python 代码示例</h2>
<pre><code class="language-python">def hello():
    print("Hello, World!")
</code></pre>`
    };
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-example');
            if (examples[type]) {
                htmlInput.value = examples[type];
                convertToMarkdown(examples[type]);
            }
        });
    });

    // 页面加载时自动转换初始内容（如果你希望一开始就有示例，可以取消注释下一行）
    // 默认textarea为空，不转换；也可以放一个默认示例
    // 但是建议留空，让用户主动输入。
    // 如果想让页面打开时有一个欢迎示例，可以取消注释下面这行：
    // setTimeout(() => { htmlInput.value = examples.simple; convertToMarkdown(examples.simple); }, 100);
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
    
    converter = html2text.HTML2Text()
    converter.body_width = 0
    converter.ignore_links = False
    converter.ignore_images = False
    converter.ignore_tables = False
    
    markdown = converter.handle(html)
    return jsonify({'markdown': markdown})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)