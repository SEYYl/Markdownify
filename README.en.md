# Markdownify

[简体中文](./README.md) | [English](./README.en.md)

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.x-black.svg)](https://flask.palletsprojects.com/)
[![Render](https://img.shields.io/badge/deploy-Render-%2346E3B7.svg)](https://html-to-md-qfrj.onrender.com)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg?logo=docker)](Dockerfile)

> **HTML / URLs / plain text → Markdown** — paste, convert, done. Batch processing, 3 themes, PWA-ready.

🌐 **Live demo:** [html-to-md-qfrj.onrender.com](https://html-to-md-qfrj.onrender.com)
📦 **Source:** [github.com/SEYYl/Markdownify](https://github.com/SEYYl/Markdownify)

> ⚡ Render free instances may cold-start; first visit can take a few seconds.

---

## 📸 Preview

![Markdownify screenshot](screenshots/20260516_024924.png)

---

## ✨ Features

### 📥 Input

| Method | Description |
|--------|-------------|
| Paste HTML | Direct code snippet input |
| Paste URL | Auto-fetch & extract article body |
| Plain text | Auto-detect headings, lists, paragraphs |
| Batch URLs | Multiple links, merged output |
| Drag & drop | Supports `.html` and `.txt` files |
| Smart detection | Auto-switches mode on paste |

### 🔄 Conversion

- ⚡ **Real-time** — converts as you type with 500ms debounce
- 🎯 **Article extraction** — strips nav & ads from URLs (readability-lxml)
- 📝 **Plain text → HTML/MD** — auto-detects `# headings`, `- lists`, paragraphs
- ✨ **HTML formatter** — one-click beautification
- ⚙️ **Options** — toggle links / images / tables

### 🎨 UI

- 🌓 **3 themes** — Light / Dark / Cyber
- ↔️ **Layout toggle** — stacked or side-by-side
- 🔍 **Zoom preview** — full-screen rendered view
- 🔢 **Char count** — live input/output stats
- 📱 **Responsive** — desktop & mobile

### 📜 History

- Auto-saves last 20 records
- Source labels: 🔗 URL / 📄 HTML / 📝 Text
- Relative timestamps ("3 minutes ago")
- Single delete or clear all

### 🔧 Technical

- 📦 **PWA** — installable, works offline
- 🧩 **Service Worker** — smart caching
- 🔗 **RESTful API** — integrate with your tools
- 🐳 **Docker** — one-command containerization
- 🔒 **SSRF protection** — URL whitelist filtering

---

## 🚀 Quick Start

### Local

```bash
git clone https://github.com/SEYYl/Markdownify.git
cd Markdownify
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000)

### Docker

```bash
docker build -t markdownify .
docker run -d -p 5000:5000 markdownify
```

### Docker Compose

```bash
docker compose up -d
```

Comes with health check, auto-restart, and network isolation.

---

## 🔌 API

All endpoints return JSON via `POST`.

| Endpoint | Function |
|----------|----------|
| `POST /convert` | HTML → Markdown |
| `POST /convert-url` | URL → Markdown |
| `POST /convert-urls` | Batch URLs → Markdown |
| `POST /convert-text` | Plain text → HTML + Markdown |

### Examples

```bash
curl -X POST https://html-to-md-qfrj.onrender.com/convert \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1>Hello</h1><p>World</p>"}'

curl -X POST https://html-to-md-qfrj.onrender.com/convert-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "options": {"use_readability": true}}'
```

### Options

Every endpoint accepts an `options` object:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `use_readability` | bool | `true` | URL mode only: extract article body |
| `skip_links` | bool | `false` | Remove links |
| `skip_images` | bool | `false` | Remove images |
| `skip_tables` | bool | `false` | Remove tables |

---

## 📦 Deployment

6 deployment options — see [DEPLOYMENT.md](DEPLOYMENT.md) for details:

| Platform | Difficulty | Cost |
|----------|-----------|------|
| ⭐ **Render** (recommended) | Easy | Free |
| Railway | Easy | Free tier |
| PythonAnywhere | Easy | Limited free |
| Fly.io | Medium | Free tier |
| Docker / VPS | Medium | Varies |
| Self-hosted | Advanced | Varies |

---

## 📁 Project Structure

```
Markdownify/
├── app.py               # Flask backend
├── requirements.txt     # Python dependencies
├── Dockerfile           # Docker build
├── docker-compose.yml   # Docker Compose
├── DEPLOYMENT.md        # Deployment guide
├── screenshots/         # Screenshots
├── static/
│   ├── css/style.css
│   ├── js/main.js
│   ├── sw.js            # Service Worker (PWA)
│   └── icon.svg         # App icon
├── templates/
│   └── index.html       # Frontend
└── README.md
```

---

## 📄 License

MIT © [Whale Fall](https://github.com/SEYYl)
