## 🌏 语言
[简体中文](./README.md) | [English](./README.en.md)

一个功能丰富、界面现代的在线工具，可将任意 HTML 代码快速转换为 Markdown 格式。基于 Python Flask 和 `html2text` 库，支持表格、链接、图片、代码块等丰富元素。

## ✨ 特性

- 🌗 **深色模式** – 支持明暗主题切换，自动跟随系统偏好
- ⚡ **实时转换** – 输入即转换，无需点击按钮（带有防抖优化）
- 🖱️ **一键复制** – 点击按钮即可复制 Markdown 结果到剪贴板
- 🗂️ **拖拽上传** – 直接将 `.html` 文件拖入编辑器，自动读取并转换
- 📚 **示例模板** – 提供简单文本、表格、代码块示例，一键填充
- 📱 **响应式设计** – 完美适配桌面端与移动端
- 🎨 **代码高亮** – 输出中的代码块自动高亮显示
- 🌐 **免费在线使用** – 无需注册，打开浏览器即可使用
- 🔓 **完全开源** – 可自行部署或二次开发

## 🚀 在线体验

👉 [https://html-to-md-qfrj.onrender.com](https://html-to-md-qfrj.onrender.com)

> 注意：Render 免费实例若长时间无访问会休眠，首次打开可能需要几秒唤醒。

## 🖼️ 界面预览

![网页截图](./screenshots/20260516_024924.png )

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

你可以轻松将本项目部署到云平台（如 Render、Vercel、PythonAnywhere）。

### 部署到 Render（推荐）

1. 将代码推送到 GitHub 仓库。
2. 登录 [Render](https://render.com) 并选择 **New Web Service**。
3. 连接你的 GitHub 仓库。
4. 使用以下配置：
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. 点击 **Create Web Service**，稍等片刻即可获得公网地址。

## 📁 项目结构

```
html-to-markdown-web/
├── app.py               # Flask 后端及前端界面
├── requirements.txt     # Python 依赖
├── static/              # 静态资源（可选）
├── templates/           # 模板文件（本项目中已内嵌于 app.py）
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
