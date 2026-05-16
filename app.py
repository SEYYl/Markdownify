from flask import Flask, request, jsonify, render_template
import html2text
import requests
from urllib.parse import urlparse

app = Flask(__name__)


@app.route('/static/manifest.json')
def manifest():
    from flask import send_from_directory
    import os
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'manifest.json',
        mimetype='application/manifest+json'
    )


@app.route('/')
def index():
    return render_template('index.html')

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


def is_valid_url(url):
    try:
        parsed = urlparse(url)
        return parsed.scheme in ('http', 'https') and bool(parsed.netloc)
    except Exception:
        return False


@app.route('/convert-url', methods=['POST'])
def convert_url():
    data = request.get_json()
    url = (data.get('url') or '').strip()
    if not url or not is_valid_url(url):
        return jsonify({'markdown': '', 'error': '请输入有效的 http:// 或 https:// 地址'}), 400

    try:
        response = requests.get(url, timeout=10, headers={
            'User-Agent': 'Mozilla/5.0 (compatible; HTML-to-Markdown/1.0)'
        })
        response.raise_for_status()
        html = response.text
    except Exception as e:
        return jsonify({'markdown': '', 'error': f'抓取网页失败：{e}'}), 400

    converter = html2text.HTML2Text()
    converter.body_width = 0
    converter.ignore_links = False
    converter.ignore_images = False
    converter.ignore_tables = False

    markdown = converter.handle(html)
    return jsonify({'markdown': markdown})


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
