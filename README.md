# HTML to Markdown 在线转换器

一个简洁、快速的在线工具，可以将任意 HTML 代码转换为 Markdown 格式。基于 Python Flask 和 html2text 库，支持表格、链接、图片等常用元素。

## ✨ 特性

- 实时转换，界面分屏显示
- 保留链接、图片、表格、列表等结构
- 干净、响应式的网页设计
- 无需注册，完全免费
- 开源，可以自己部署或二次开发

## 🚀 在线体验

[点击体验](https://html-to-md-qfrj.onrender.com/)（部署后替换）

## 🛠️ 本地运行

### 前提条件
- Python 3.8+
- pip

### 步骤
```bash
# 克隆仓库
git clone https://github.com/你的用户名/html-to-markdown-web.git
cd html-to-markdown-web

# 创建虚拟环境
python -m venv venv
source venv/bin/activate   # Linux/Mac
# 或 .\venv\Scripts\activate  (Windows)

# 安装依赖
pip install -r requirements.txt

# 运行
python app.py
```
## 打开浏览器访问 http://127.0.0.1:5000 即可使用。
