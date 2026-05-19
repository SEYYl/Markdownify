# Markdownify

[简体中文](./README.md) | [English](./README.en.md)

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.x-black.svg)

HTML / URLs / plain text → Markdown. Batch processing, article extraction, live preview, 3 themes, and conversion history.

## ✨ Features

### 📥 Input
- **Paste HTML** / **Plain text** / **URL fetch**
- **Batch URLs** — paste multiple links, get merged output
- **Smart paste detection** — auto-detects URLs, HTML, or text on paste
- **Drag & drop** — `.html` and `.txt` files

### 🔄 Conversion
- **Real-time** — converts as you type with debounce
- **Article extraction** — strips navigation & ads from URLs (readability)
- **Plain text → HTML/MD** — auto-detects headings `#`, lists `-`, paragraphs
- **HTML formatter** — one-click beautification
- **Options** — toggle links, images, tables

### 🎨 UI
- **3 themes** — Light / Dark / Cyber
- **Layout** — stacked or side-by-side
- **Zoom preview** — full-screen rendered view
- **Char count** — live input/output stats
- **Responsive** — desktop & mobile

### 📜 History
- Auto-saves last 20 conversions
- Source badges: 🔗 URL / 📄 HTML / 📝 Text
- Relative time ("3m ago")
- Delete single entries or clear all

### 🔧 Technical
- PWA — installable, offline-capable
- Service Worker smart caching
- Fully open-source, self-hostable

## 🚀 Try Online

👉 [https://html-to-md-qfrj.onrender.com](https://html-to-md-qfrj.onrender.com)

> Free Render instances may hibernate; first visit may take a few seconds.

## 🔧 API

### HTML → Markdown

```bash
POST /convert
{ "html": "<p>Example</p>", "options": {} }
```

### URL → Markdown

```bash
POST /convert-url
{ "url": "https://example.com", "options": { "use_readability": true } }
```

### Batch URLs

```bash
POST /convert-urls
{ "urls": ["https://a.com", "https://b.org"] }
```

### Plain Text → HTML + Markdown

```bash
POST /convert-text
{ "text": "# Title\n\nSome text", "options": {} }
```

## 🛠️ Local Dev

```bash
git clone https://github.com/SEYYl/html-to-markdown-web.git
cd html-to-markdown-web
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000`

### Docker

```bash
docker build -t markdownify .
docker run -d -p 5000:5000 markdownify
```

## 📦 Deploy

6 options — see [DEPLOYMENT.md](DEPLOYMENT.md). Render recommended.

## 📁 Structure

```
├── app.py              # Flask backend
├── requirements.txt    # Dependencies
├── static/
│   ├── css/style.css
│   ├── js/main.js
│   ├── sw.js
│   ├── favicon.ico
│   └── icon.svg
├── templates/
│   └── index.html
└── README.md
```

## 📄 License

MIT
