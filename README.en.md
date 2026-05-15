## 🌏 Language
[简体中文](./README.md) | [English](README.en.md)

A feature-rich online tool with a modern interface that quickly converts any HTML code into Markdown format. Built using Python Flask and the `html2text` library, it supports a wide range of elements including tables, links, images, and code blocks.

## ✨ Features

- 🌗 **Dark Mode** – Supports switching between light and dark themes, automatically syncing with system preferences.
- ⚡ **Real-time Conversion** – Converts as you type; no need to click a button (includes debouncing optimization).
- 🖱️ **One-Click Copy** – Simply click a button to copy the generated Markdown to your clipboard.
- 🗂️ **Drag-and-Drop Upload** – Drag `.html` files directly into the editor to automatically load and convert them.
- 📚 **Sample Templates** – Provides one-click templates for simple text, tables, and code blocks.
- 📱 **Responsive Design** – Perfectly optimized for both desktop and mobile devices.
- 🎨 **Code Highlighting** – Automatically highlights code blocks within the output.
- 🌐 **Free Online Tool** – No registration required; simply open your browser to start using it.
- 🔓 **Fully Open Source** – Available for self-hosting or further development.

## 🚀 Try It Online

👉 [https://html-to-md-qfrj.onrender.com](https://html-to-md-qfrj.onrender.com)

> Note: Render's free instances go into hibernation after periods of inactivity; the application may take a few seconds to wake up when accessed for the first time. ## 🖼️ Interface Preview

![Webpage Screenshot](./screenshots/20260516_024924.png )

## 🛠️ Running Locally

### Prerequisites
- Python 3.8 or higher
- pip package manager
- (Optional) Git

### Installation and Startup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/html-to-markdown-web.git
cd html-to-markdown-web

# 2. Create a virtual environment (Recommended)
python -m venv venv
source venv/bin/activate      # Linux / macOS
# or .\venv\Scripts\activate   # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the application
python app.py
```

Open your browser and visit `http://127.0.0.1:5000` to start using the application.

## 📦 Deployment

You can easily deploy this project to cloud platforms (such as Render, Vercel, or PythonAnywhere).

### Deploying to Render (Recommended)

1. Push your code to a GitHub repository.
2. Log in to [Render](https://render.com) and select **New Web Service**.
3. Connect your GitHub repository.
4. Use the following configuration:
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
5. Click **Create Web Service** and wait a few moments to receive your public URL.

## 📁 Project Structure

```
html-to-markdown-web/
├── app.py               # Flask backend and frontend interface
├── requirements.txt     # Python dependencies
├── static/              # Static assets (Optional)
├── templates/           # Template files (Embedded within app.py in this project)
├── .gitignore           # Git ignore file
├── LICENSE              # MIT License
└── README.md            # Project documentation
```

## 🤝 Contributing

Issues and Pull Requests are welcome! Any suggestions for improvement are highly valued. 1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Flask](https://flask.palletsprojects.com/) – A lightweight web framework
- [html2text](https://github.com/Alir3z4/html2text) – Core library for converting HTML to Markdown
- [highlight.js](https://highlightjs.org/) – Code syntax highlighting
```

### Key Improvements:

1. **Added Badges** – Included badges for the license, Python version, and deployment platform to enhance the project's professional appearance.
2. **Detailed Feature List** – Highlighted newly added features such as dark mode, real-time conversion, drag-and-drop uploads, sample templates, code highlighting, etc.
3. **Online Demo Link** – Retained your Render deployment link and included a note regarding potential cold-start delays.
4. **UI Preview Placeholder** – Suggested adding a screenshot so users can visualize the interface at a glance.
5. **Deployment Guide** – Provided specific steps for deploying the project on Render.
6. **Project Structure** – Clearly outlined the file organization.
7. **Contributing Guide** – Facilitated participation from other contributors.
8. **Open Source License** – Explicitly stated the MIT License.
9. **Formatting Optimization** – Utilized standard Markdown syntax for improved readability.

You can save the content above as `README.md`, replace the original file in your repository, and then commit and push the changes. If you wish to add a screenshot, place the image file within your repository (e.g., `screenshot.png`) and insert the following code under the `UI Preview` section:

```markdown
## 🖼️ UI Preview

![Webpage Screenshot 1](./screenshots/20260516_024924.png)
```