# Markdownify

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.x-black.svg)](https://flask.palletsprojects.com/)
[![Render](https://img.shields.io/badge/deploy-Render-%2346E3B7.svg)](https://html-to-md-qfrj.onrender.com)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg?logo=docker)](Dockerfile)

> **HTML / 网址 / 纯文本 → Markdown** — 粘贴即转，批量处理，三主题，离线可用。

🌐 **在线体验：** [html-to-md-qfrj.onrender.com](https://html-to-md-qfrj.onrender.com)
📦 **源码：** [github.com/SEYYl/Markdownify](https://github.com/SEYYl/Markdownify)

> ⚡ Render 免费实例可能休眠，首次访问需等几秒唤醒。

---

## 📸 预览

![Markdownify 截图](screenshots/20260516_024924.png)

---

## ✨ 功能一览

### 📥 输入

| 方式 | 说明 |
|------|------|
| 粘贴 HTML | 直接粘贴代码片段 |
| 粘贴 URL | 自动抓取并提取正文 |
| 纯文本输入 | 自动识别标题、列表、段落 |
| 批量 URL | 一次贴多个链接，合并输出 |
| 拖拽上传 | 支持 `.html` 和 `.txt` 文件 |
| 智能检测 | 粘贴时自动切换对应模式 |

### 🔄 转换

- ⚡ **实时转换** — 输入即转，500ms 防抖
- 🎯 **正文提取** — URL 抓取时自动去导航、去广告（readability-lxml）
- 📝 **纯文本 → HTML/MD** — 自动识别 `# 标题`、`- 列表`、段落
- ✨ **HTML 格式化** — 一键美化缩进
- ⚙️ **转换选项** — 开关：保留链接 / 图片 / 表格

### 🎨 界面

- 🌓 **三主题** — 浅色 / 深色 / 赛博科技
- ↔️ **布局切换** — 堆叠 / 并排
- 🔍 **放大预览** — 全屏渲染视图
- 🔢 **字数统计** — 实时输入/输出字符数
- 📱 **响应式** — 桌面端 + 移动端

### 📜 历史记录

- 自动保存最近 20 条记录
- 来源标注：🔗 URL / 📄 HTML / 📝 文本
- 相对时间显示（"3分钟前"）
- 支持单条删除或清空全部

### 🔧 技术特性

- 📦 **PWA** — 可安装到桌面，离线可用
- 🧩 **Service Worker** — 智能缓存策略
- 🔗 **API** — 完整的 RESTful API，可集成到其他工具
- 🐳 **Docker** — 一键容器化部署
- 🔒 **SSRF 防护** — URL 请求白名单过滤

---

## 🚀 快速开始

### 本地运行

```bash
# 克隆
git clone https://github.com/SEYYl/Markdownify.git
cd Markdownify

# 创建虚拟环境
python -m venv venv
source venv/bin/activate   # Linux/macOS
# venv\Scripts\activate    # Windows

# 安装依赖
pip install -r requirements.txt

# 启动
python app.py
```

访问 [http://127.0.0.1:5000](http://127.0.0.1:5000)

### Docker

```bash
# 构建 & 运行
docker build -t markdownify .
docker run -d -p 5000:5000 markdownify
```

### Docker Compose

```bash
docker compose up -d
```

自带健康检查、自动重启、网络隔离。

---

## 🔌 API

所有接口返回 JSON，支持 `POST` 请求。

| 接口 | 功能 |
|------|------|
| `POST /convert` | HTML → Markdown |
| `POST /convert-url` | URL → Markdown |
| `POST /convert-urls` | 批量 URL → Markdown |
| `POST /convert-text` | 纯文本 → HTML + Markdown |

### 请求示例

```bash
curl -X POST https://html-to-md-qfrj.onrender.com/convert \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1>你好</h1><p>世界</p>"}'

curl -X POST https://html-to-md-qfrj.onrender.com/convert-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "options": {"use_readability": true}}'
```

> 更多 API 详情和参数说明见下方详细接口文档。

### 参数说明

每个接口的 `options` 支持：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `use_readability` | bool | `true` | 仅 URL 模式：是否用 readability 提取正文 |
| `skip_links` | bool | `false` | 是否移除链接 |
| `skip_images` | bool | `false` | 是否移除图片 |
| `skip_tables` | bool | `false` | 是否移除表格 |

---

## 📦 部署

支持 6 种部署方式，详见 [DEPLOYMENT.md](DEPLOYMENT.md)：

| 平台 | 难度 | 成本 |
|------|------|------|
| ⭐ **Render**（推荐） | 低 | 免费 |
| Railway | 低 | 免费额度 |
| PythonAnywhere | 低 | 免费有限 |
| Fly.io | 中 | 免费额度 |
| Docker / VPS | 中 | 按服务器计费 |
| 自建服务器 | 高 | 按需 |

---

## 📁 项目结构

```
Markdownify/
├── app.py               # Flask 后端
├── requirements.txt     # Python 依赖
├── Dockerfile           # Docker 构建
├── docker-compose.yml   # Docker Compose
├── DEPLOYMENT.md        # 部署指南
├── screenshots/         # 截图
├── static/
│   ├── css/style.css
│   ├── js/main.js
│   ├── sw.js            # Service Worker（PWA）
│   └── icon.svg         # 应用图标
├── templates/
│   └── index.html       # 前端界面
└── README.md
```

---

## 📄 许可证

MIT © [鲸落](https://github.com/SEYYl)
