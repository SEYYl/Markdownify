# Markdownify

[简体中文](./README.md) | [English](./README.en.md)

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.x-black.svg)

HTML / 网址 / 纯文本 → Markdown。支持批量、正文提取、实时预览，带三主题和转换历史。

## ✨ 功能一览

### 📥 输入
- **HTML 粘贴** / **纯文本输入** / **URL 抓取**
- **批量 URL** — 一次贴多个链接，合并输出
- **智能粘贴检测** — 贴 URL、HTML 或纯文本时自动切换模式
- **拖拽上传** — 支持 `.html` 和 `.txt` 文件

### 🔄 转换
- **实时转换** — 输入即转，500ms 防抖
- **正文提取** — URL 抓取时自动去导航、去广告（readability）
- **纯文本 → HTML/MD** — 自动识别标题 `#`、列表 `-`、段落
- **HTML 格式化** — 一键美化 HTML 缩进
- **转换选项** — 开关：保留链接、图片、表格

### 🎨 界面
- **三主题** — 浅色 / 深色 / 赛博科技
- **布局切换** — 堆叠 / 并排
- **放大预览** — 全屏渲染视图
- **字数统计** — 实时显示输入和输出字符数
- **响应式** — 桌面端和移动端

### 📜 历史
- 自动保存最近 20 条记录
- 来源标注：🔗 URL / 📄 HTML / 📝 文本
- 相对时间显示（"3分钟前"）
- 单条删除或清空全部

### 🔧 技术
- PWA，可安装到桌面，离线可用
- Service Worker 智能缓存
- 全开源，可本地部署

## 🚀 在线体验

👉 [https://html-to-md-qfrj.onrender.com](https://html-to-md-qfrj.onrender.com)

> Render 免费实例可能休眠，首次访问需几秒唤醒。

## 🔧 API

### HTML → Markdown

```bash
POST /convert
{ "html": "<p>示例</p>", "options": {} }
```

### URL → Markdown

```bash
POST /convert-url
{ "url": "https://example.com", "options": { "use_readability": true } }
```

### 批量 URL

```bash
POST /convert-urls
{ "urls": ["https://a.com", "https://b.org"] }
```

### 纯文本 → HTML + Markdown

```bash
POST /convert-text
{ "text": "# 标题\n\n一段文字", "options": {} }
```

## 🛠️ 本地运行

```bash
git clone https://github.com/SEYYl/html-to-markdown-web.git
cd html-to-markdown-web
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

访问 `http://127.0.0.1:5000`

### Docker

```bash
docker build -t markdownify .
docker run -d -p 5000:5000 markdownify
```

## 📦 部署

6 种部署选项详见 [DEPLOYMENT.md](DEPLOYMENT.md)。推荐 Render。

## 📁 结构

```
├── app.py              # Flask 后端
├── requirements.txt    # 依赖
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

## 📄 许可证

MIT
