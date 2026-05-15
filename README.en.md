# HTML to Markdown Converter

[简体中文](./README.md) | [English](./README.en.md)

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)

A lightweight Flask app that converts HTML code into Markdown text. It is ideal for notes, blog posts, documentation, or Markdown editors.

## ✨ Features

- 🌗 **Dark / Light Mode** – Switch between themes with one click
- ⚡ **Real-time Conversion** – Converts while typing, with debouncing to reduce requests
- 🗂️ **Drag-and-Drop Upload** – Drag `.html` files into the editor to convert
- 🖱️ **One-Click Copy** – Copy the generated Markdown result to the clipboard
- ⬇️ **Download Markdown** – Save the generated result as a `.md` file
- 🧹 **Clear Input** – Clear the HTML editor and reset outputs
- 🔍 **Markdown Preview** – Render a live preview and highlight code blocks
- 🔎 **Zoom Preview** – Expand the preview panel to full width and hide the other panels for easier reading
- 🌐 **URL Conversion** – Enter a webpage address and convert the page directly into Markdown
- 🧱 **Side-by-Side Layout** – Switch to a side-by-side layout so editing and preview are shown together on wide screens
- 📚 **Sample Templates** – Built-in examples for simple text, tables, and code blocks
- 📱 **Responsive Design** – Works on both desktop and mobile
- 🔓 **Open Source** – Self-host or extend the project easily

## 🚀 How to Use

1. Open the page
2. Paste HTML code or drop a `.html` file
3. Review the generated Markdown text on the right
4. Click the copy button to copy the output

## 🔧 Developer Notes

Backend endpoint: `POST /convert`

Request example:

```json
{ "html": "<p>Example</p>" }
```

Response example:

```json
{ "markdown": "Example\n" }
```

Backend URL conversion endpoint: `POST /convert-url`

Request example:

```json
{ "url": "https://example.com" }
```

Response example:

```json
{ "markdown": "Example\n" }
```

> Note: The page now shows both raw Markdown text and a live rendered preview. Code blocks in the preview are syntax highlighted.

## 🚀 Try It Online

👉 [https://html-to-md-qfrj.onrender.com](https://html-to-md-qfrj.onrender.com)

> Note: Render free instances may hibernate after inactivity and can take a few seconds to wake up.

## 🖼️ Interface Preview

![Webpage Screenshot](./screenshots/20260516_024924.png)

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

# 2. Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # Linux / macOS
# or .\venv\Scripts\activate   # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the application
python app.py
```

Open your browser and visit `http://127.0.0.1:5000`.

## 📦 Deployment

You can deploy this project to cloud platforms such as Render, Vercel, or PythonAnywhere.

### Deploying to Render (Recommended)

1. Push the code to GitHub.
2. Log in to [Render](https://render.com) and select **New Web Service**.
3. Connect your GitHub repository.
4. Use the following configuration:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Click **Create Web Service** and wait for the public URL.

## 📁 Project Structure

```
html-to-markdown-web/
├── app.py               # Flask backend entrypoint
├── requirements.txt     # Python dependencies
├── static/              # Static assets (CSS, JS)
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── templates/           # Frontend template files
│   └── index.html
├── .gitignore           # Git ignore file
├── LICENSE              # MIT License
└── README.md            # Project documentation
```

## 🤝 Contributing

Issues and Pull Requests are welcome! Any suggestions are appreciated.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Flask](https://flask.palletsprojects.com/) – Lightweight web framework
- [html2text](https://github.com/Alir3z4/html2text) – Core HTML to Markdown library
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