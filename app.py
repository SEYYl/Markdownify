from flask import Flask, request, jsonify, render_template
import html2text
import requests
import re
from urllib.parse import urlparse
import os

app = Flask(__name__)

# Optional: readability for article extraction on URL conversion
try:
    from readability import Document
    HAS_READABILITY = True
except ImportError:
    HAS_READABILITY = False


@app.route('/static/manifest.json')
def manifest():
    from flask import send_from_directory
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'manifest.json',
        mimetype='application/manifest+json'
    )


@app.route('/')
def index():
    return render_template('index.html')


def get_converter(options=None):
    """Create an html2text converter with optional settings."""
    converter = html2text.HTML2Text()
    converter.body_width = 0
    converter.ignore_links = False
    converter.ignore_images = False
    converter.ignore_tables = False
    converter.ignore_emphasis = False
    converter.mark_code = True
    converter.single_line_break = False
    converter.protect_links = True

    if options:
        if options.get('ignore_links') is True:
            converter.ignore_links = True
        if options.get('ignore_images') is True:
            converter.ignore_images = True
        if options.get('ignore_tables') is True:
            converter.ignore_tables = True
        if options.get('body_width') is not None:
            converter.body_width = int(options['body_width'])

    return converter


@app.route('/convert', methods=['POST'])
def convert():
    data = request.get_json()
    html = data.get('html', '')
    options = data.get('options', {})

    if not html:
        return jsonify({'markdown': ''})

    converter = get_converter(options)
    markdown = converter.handle(html)
    return jsonify({'markdown': markdown})


@app.route('/convert-url', methods=['POST'])
def convert_url():
    data = request.get_json()
    url = (data.get('url') or '').strip()
    options = data.get('options', {})
    use_readability = options.get('use_readability', True)

    if not url or not is_valid_url(url):
        return jsonify({'markdown': '', 'error': '请输入有效的 http:// 或 https:// 地址'}), 400

    try:
        response = requests.get(url, timeout=10, headers={
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/120.0.0.0 Safari/537.36'
            )
        })
        response.raise_for_status()
        html = response.text

        # Extract page title
        title = extract_title(html)

        # Extract main article content using readability
        if HAS_READABILITY and use_readability:
            try:
                doc = Document(html)
                summary_html = doc.summary()
                if summary_html and len(summary_html) > 100:
                    html = summary_html
                rt = doc.short_title()
                if rt:
                    title = rt
            except Exception:
                pass  # Fall back to raw HTML

    except Exception as e:
        return jsonify({'markdown': '', 'error': f'抓取网页失败：{e}'}), 400

    converter = get_converter(options)
    markdown = converter.handle(html)
    return jsonify({'markdown': markdown, 'title': title})


def text_to_html(text):
    """Convert plain text to formatted HTML."""
    import html as html_module
    lines = text.split('\n')
    result = []
    i = 0
    in_list = False
    list_tag = ''

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            if in_list:
                result.append(f'</{list_tag}>')
                in_list = False
            i += 1
            continue

        # Headings
        if stripped.startswith('### '):
            if in_list:
                result.append(f'</{list_tag}>')
                in_list = False
            result.append(f'<h3>{html_module.escape(stripped[4:])}</h3>')
        elif stripped.startswith('## '):
            if in_list:
                result.append(f'</{list_tag}>')
                in_list = False
            result.append(f'<h2>{html_module.escape(stripped[3:])}</h2>')
        elif stripped.startswith('# '):
            if in_list:
                result.append(f'</{list_tag}>')
                in_list = False
            result.append(f'<h1>{html_module.escape(stripped[2:])}</h1>')
        # Unordered list
        elif stripped.startswith('- ') or stripped.startswith('* '):
            if not in_list or list_tag != 'ul':
                if in_list:
                    result.append(f'</{list_tag}>')
                result.append('<ul>')
                in_list = True
                list_tag = 'ul'
            result.append(f'  <li>{html_module.escape(stripped[2:])}</li>')
        # Ordered list
        elif re.match(r'^\d+[\.\)] ', stripped):
            content = re.sub(r'^\d+[\.\)] ', '', stripped)
            if not in_list or list_tag != 'ol':
                if in_list:
                    result.append(f'</{list_tag}>')
                result.append('<ol>')
                in_list = True
                list_tag = 'ol'
            result.append(f'  <li>{html_module.escape(content)}</li>')
        else:
            if in_list:
                result.append(f'</{list_tag}>')
                in_list = False
            escaped = html_module.escape(stripped)
            # Auto-link URLs
            escaped = re.sub(
                r'(https?://[^\s<>"\'()]+)',
                r'<a href="\1">\1</a>',
                escaped
            )
            result.append(f'<p>{escaped}</p>')
        i += 1

    if in_list:
        result.append(f'</{list_tag}>')

    return '\n'.join(result)


@app.route('/convert-text', methods=['POST'])
def convert_text():
    """Convert plain text to HTML and Markdown."""
    data = request.get_json()
    text = data.get('text', '')
    options = data.get('options', {})

    if not text.strip():
        return jsonify({'html': '', 'markdown': ''})

    html = text_to_html(text)
    converter = get_converter(options)
    markdown = converter.handle(html)

    return jsonify({'html': html, 'markdown': markdown})


def extract_title(html):
    """Extract page title from HTML.""",
    match = re.search(r'<title[^>]*>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
    if match:
        return match.group(1).strip()
    return ''


def is_valid_url(url):
    try:
        parsed = urlparse(url)
        return parsed.scheme in ('http', 'https') and bool(parsed.netloc)
    except Exception:
        return False


@app.route('/convert-urls', methods=['POST'])
def convert_urls():
    data = request.get_json()
    urls = data.get('urls', [])
    options = data.get('options', {})

    if not urls or not isinstance(urls, list):
        return jsonify({'markdown': '', 'results': [], 'error': '请提供 URL 列表'}), 400

    results = []
    markdown_parts = []
    converter = get_converter(options)
    use_readability = options.get('use_readability', True)

    for url in urls:
        url = url.strip()
        if not url:
            continue
        if not is_valid_url(url):
            results.append({'url': url, 'success': False, 'error': '无效的 URL 格式'})
            continue

        try:
            response = requests.get(url, timeout=10, headers={
                'User-Agent': (
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                    'AppleWebKit/537.36 (KHTML, like Gecko) '
                    'Chrome/120.0.0.0 Safari/537.36'
                )
            })
            response.raise_for_status()
            html = response.text

            # Extract title
            title = extract_title(html)

            # Apply readability
            if HAS_READABILITY and use_readability:
                try:
                    doc = Document(html)
                    summary_html = doc.summary()
                    if summary_html and len(summary_html) > 100:
                        html = summary_html
                    rt = doc.short_title()
                    if rt:
                        title = rt
                except Exception:
                    pass

            markdown = converter.handle(html)
            header = f"## [{title}]({url})" if title else f"## from: {url}"
            markdown_parts.append(f"{header}\n\n{markdown}\n\n---\n")
            results.append({'url': url, 'title': title, 'success': True})

        except Exception as e:
            error_msg = str(e)
            markdown_parts.append(f"## ❌ {url}\n\n> 抓取失败：{error_msg}\n\n---\n")
            results.append({'url': url, 'success': False, 'error': error_msg})

    combined = '\n'.join(markdown_parts)
    return jsonify({'markdown': combined, 'results': results})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
