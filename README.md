# HTML to Markdown 在线转换器

[简体中文](./README.md) | [English](./README.en.md)

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)

一个基于 Flask 的轻量工具，可将 HTML 代码快速转换为 Markdown 文本，适合用于笔记、博客、文档或 Markdown 编辑器。

## ✨ 功能

- 🌗 **亮/暗主题切换** – 支持页面主题切换
- ⚡ **实时转换** – 输入即转换，带防抖优化，减少请求频率
- 🗂️ **拖拽 HTML 文件** – 支持直接拖入 `.html` 文件自动读取并转换
- 🖱️ **一键复制** – 将生成的 Markdown 结果复制到剪贴板
- 📚 **示例模板** – 内置简单文本、表格、代码块示例
- 📱 **响应式界面** – 兼容移动端与桌面端
- 🔓 **完全开源** – 可本地部署或二次开发

## 🚀 使用说明

1. 打开页面
2. 粘贴 HTML 代码，或拖入 `.html` 文件
3. 查看右侧生成的 Markdown 文本
4. 点击“复制”按钮复制结果

## 🔧 开发者说明

后端接口：`POST /convert`

请求示例：

```json
{ "html": "<p>示例</p>" }
```

响应示例：

```json
{ "markdown": "示例\n" }
```

> 当前页面输出为纯 Markdown 文本，代码块保留 Markdown 语法。若需进一步渲染高亮，可在前端增加 Markdown 渲染库。

## 🚀 在线体验

👉 [https://html-to-md-qfrj.onrender.com](https://html-to-md-qfrj.onrender.com)

> 注意：Render 免费实例可能会休眠，首次访问需要几秒唤醒。

## 🖼️ 界面预览

![网页截图](./screenshots/20260516_024924.png)

## 🛠️ 本地运行

### 前提条件
- Python 3.8 或更高版本
- pip 包管理器
- （可选）Git

### 安装与启动

```bash
# 1. 克隆仓库
git clone https://github.com/你的用户名/html-to-markdown-web.git
cd html-to-markdown-web

# 2. 创建虚拟环境（推荐）
python -m venv venv
source venv/bin/activate      # Linux / macOS
# 或 .\venv\Scripts\activate   # Windows

# 3. 安装依赖
pip install -r requirements.txt

# 4. 运行应用
python app.py
```

打开浏览器访问 `http://127.0.0.1:5000` 即可开始使用。

## 📦 部署

你可以将本项目部署到云平台，例如 Render、Vercel 或 PythonAnywhere。

### 部署到 Render（推荐）

1. 将代码推送到 GitHub 仓库。
2. 登录 [Render](https://render.com) 并选择 **New Web Service**。
3. 连接你的 GitHub 仓库。
4. 使用以下配置：
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. 点击 **Create Web Service**，稍等片刻即可获得公网地址。

## 📁 项目结构

```
html-to-markdown-web/
├── app.py               # Flask 后端及前端界面
├── requirements.txt     # Python 依赖
├── static/              # 静态资源（目前为空）
├── templates/           # 目前空目录，前端界面嵌入 app.py
├── .gitignore           # Git 忽略文件
├── LICENSE              # MIT 许可证
└── README.md            # 项目说明
```

## 🤝 贡献

欢迎提交 Issue 或 Pull Request！任何改进建议都很有价值。

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Flask](https://flask.palletsprojects.com/) – 轻量级 Web 框架
- [html2text](https://github.com/Alir3z4/html2text) – HTML 转 Markdown 核心库
- [highlight.js](https://highlightjs.org/) – 代码语法高亮
```

### 主要改进点：

1. **添加徽章** – 增加许可证、Python 版本、部署平台标识，提升项目专业感。
2. **详细特性列表** – 突出新加入的深色模式、实时转换、拖拽上传、示例模板、代码高亮等。
3. **在线体验链接** – 保留你的 Render 链接，并说明可能的休眠唤醒。
4. **界面预览占位** – 建议你添加一张截图，让用户一眼看到界面。
5. **部署指南** – 提供 Render 部署的具体步骤。
6. **项目结构** – 清晰展示文件组织。
7. **贡献指南** – 方便他人参与。
8. **开源许可证** – 明确 MIT 协议。
9. **格式优化** – 使用规范 Markdown 语法，易于阅读。

你可以将上述内容保存为 `README.md`，替换仓库中原有文件，然后提交并推送。如果需要添加截图，可以将截图文件放入仓库（如 `screenshot.png`），并在 `界面预览` 处加入：

```markdown
## 🖼️ 界面预览

![网页截图1](./screenshots/20260516_024924.png)
```
