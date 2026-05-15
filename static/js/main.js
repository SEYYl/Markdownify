// DOM 元素
const htmlInput = document.getElementById('htmlInput');
const markdownOutput = document.getElementById('markdownOutput');
const markdownPreview = document.getElementById('markdownPreview');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const urlConvertBtn = document.getElementById('urlConvertBtn');
const urlModal = document.getElementById('urlModal');
const urlInput = document.getElementById('urlInput');
const urlModalClose = document.getElementById('urlModalClose');
const urlModalCancel = document.getElementById('urlModalCancel');
const urlModalSubmit = document.getElementById('urlModalSubmit');
const toastContainer = document.getElementById('toastContainer');
const layoutToggleBtn = document.getElementById('layoutToggleBtn');
const themeToggle = document.getElementById('themeToggle');
const pasteBtn = document.getElementById('pasteBtn');
let currentMarkdown = '';

// 转换函数（调用后端）
async function convertToMarkdown(html) {
    if (!html.trim()) {
        currentMarkdown = '';
        markdownOutput.innerText = '';
        markdownPreview.innerHTML = '';
        return;
    }
    markdownOutput.innerText = '⏳ 转换中...';
    markdownPreview.innerHTML = '<p>⏳ 转换中...</p>';
    try {
        const response = await fetch('/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ html: html })
        });
        const data = await response.json();
        if (data.markdown !== undefined) {
            currentMarkdown = data.markdown;
            markdownOutput.innerText = data.markdown;
            markdownPreview.innerHTML = DOMPurify.sanitize(marked.parse(data.markdown));
            if (typeof hljs !== 'undefined') {
                markdownPreview.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        } else {
            markdownOutput.innerText = '转换失败，请检查 HTML 格式';
            markdownPreview.innerHTML = '<p>转换失败，请检查 HTML 格式</p>';
        }
    } catch (err) {
        markdownOutput.innerText = '网络错误：' + err.message;
        markdownPreview.innerHTML = '<p>网络错误：' + err.message + '</p>';
    }
}

// 防抖函数
let debounceTimer;
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

function displayMarkdown(markdown) {
    currentMarkdown = markdown;
    markdownOutput.innerText = markdown;
    markdownPreview.innerHTML = DOMPurify.sanitize(marked.parse(markdown));
    if (typeof hljs !== 'undefined') {
        markdownPreview.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
}

async function convertUrlToMarkdown(url) {
    if (!url || !url.trim()) {
        return;
    }

    markdownOutput.innerText = '⏳ 抓取并转换中...';
    markdownPreview.innerHTML = '<p>⏳ 抓取并转换中...</p>';

    try {
        const response = await fetch('/convert-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url.trim() })
        });
        const data = await response.json();
        if (response.ok && data.markdown !== undefined) {
            displayMarkdown(data.markdown);
            showToast('🔗 URL 转换成功！', 'success');
        } else {
            const errorMsg = data.error || 'URL 转换失败';
            markdownOutput.innerText = errorMsg;
            markdownPreview.innerHTML = `<p>${DOMPurify.sanitize(errorMsg)}</p>`;
            showToast(errorMsg, 'error');
        }
    } catch (err) {
        const errorMsg = '网络错误：' + err.message;
        markdownOutput.innerText = errorMsg;
        markdownPreview.innerHTML = `<p>${DOMPurify.sanitize(errorMsg)}</p>`;
        showToast(errorMsg, 'error');
    }
}

// 实时转换（带500ms防抖）
const handleInput = debounce((e) => {
    convertToMarkdown(e.target.value);
}, 500);
htmlInput.addEventListener('input', handleInput);

// 一键复制
copyBtn.addEventListener('click', async () => {
    if (!currentMarkdown) {
        showToast('没有可复制的内容', 'error');
        return;
    }
    try {
        await navigator.clipboard.writeText(currentMarkdown);
        showToast('已成功复制到剪贴板', 'success');
        const originalText = copyBtn.innerText;
        copyBtn.innerText = '✅ 已复制';
        setTimeout(() => { copyBtn.innerText = originalText; }, 1500);
    } catch (err) {
        showToast('复制失败，可手动选择', 'error');
    }
});

downloadBtn.addEventListener('click', () => {
    if (!currentMarkdown) {
        showToast('没有可下载的 Markdown', 'error');
        return;
    }
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'converted.md';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
});

clearBtn.addEventListener('click', () => {
    htmlInput.value = '';
    currentMarkdown = '';
    markdownOutput.innerText = '';
    markdownPreview.innerHTML = '';
    htmlInput.focus();
});

function openUrlModal() {
    urlModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    urlInput.value = '';
    setTimeout(() => urlInput.focus(), 100);
}

function closeUrlModal() {
    urlModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

urlConvertBtn.addEventListener('click', () => {
    openUrlModal();
});

urlModalClose.addEventListener('click', closeUrlModal);
urlModalCancel.addEventListener('click', closeUrlModal);
urlModal.addEventListener('click', (event) => {
    if (event.target === urlModal) {
        closeUrlModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && urlModal.getAttribute('aria-hidden') === 'false') {
        closeUrlModal();
    }
});

urlModalSubmit.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        urlInput.focus();
        return;
    }
    if (!/^https?:\/\//i.test(url)) {
        showToast('请输入有效的网页地址，必须以 http:// 或 https:// 开头。', 'error');
        urlInput.focus();
        return;
    }
    closeUrlModal();
    await convertUrlToMarkdown(url);
});

urlInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        urlModalSubmit.click();
    }
});

function showToast(message, type = 'success') {
    toastContainer.textContent = message;
    toastContainer.className = `toast visible ${type}`;
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toastContainer.className = 'toast';
    }, 2800);
}

// 深色模式切换
let isDark = localStorage.getItem('htmlToMdTheme') === 'dark';
if (isDark || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    themeToggle.innerText = '☀️ 浅色模式';
    isDark = true;
}
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    isDark = document.body.classList.contains('dark');
    themeToggle.innerText = isDark ? '☀️ 浅色模式' : '🌙 深色模式';
    localStorage.setItem('htmlToMdTheme', isDark ? 'dark' : 'light');
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('.markdown-output pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
});

let sideBySide = localStorage.getItem('htmlToMdLayout') === 'side';
function updateLayoutState(enabled) {
    document.body.classList.toggle('side-by-side', enabled);
    layoutToggleBtn.innerText = enabled ? '当前布局：并排' : '当前布局：堆叠';
    localStorage.setItem('htmlToMdLayout', enabled ? 'side' : 'stack');
}
updateLayoutState(sideBySide);
layoutToggleBtn.addEventListener('click', () => {
    sideBySide = !sideBySide;
    updateLayoutState(sideBySide);
});

const previewToggleBtn = document.getElementById('previewToggleBtn');
let previewExpanded = false;
previewToggleBtn.addEventListener('click', () => {
    previewExpanded = !previewExpanded;
    document.body.classList.toggle('preview-expanded', previewExpanded);
    previewToggleBtn.innerText = previewExpanded ? '↩️ 退出放大' : '🔎 放大预览';
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('.markdown-output pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
});

// 拖拽上传
const inputPanel = document.getElementById('inputPanel');
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    inputPanel.addEventListener(eventName, preventDefaults, false);
});
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}
['dragenter', 'dragover'].forEach(eventName => {
    inputPanel.addEventListener(eventName, () => {
        inputPanel.classList.add('drag-over');
    }, false);
});
['dragleave', 'drop'].forEach(eventName => {
    inputPanel.addEventListener(eventName, () => {
        inputPanel.classList.remove('drag-over');
    }, false);
});
inputPanel.addEventListener('drop', handleDrop, false);
async function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.name.endsWith('.html') || file.type === 'text/html') {
            const text = await file.text();
            htmlInput.value = text;
            convertToMarkdown(text);
        } else {
            showToast('请拖拽 HTML 文件（.html）', 'error');
        }
    }
}

// 示例模板
const examples = {
    simple: `<h1>欢迎使用转换器</h1>
<p>这是一个<strong>简单示例</strong>，包含<em>斜体</em>和<a href="https://example.com">链接</a>。</p>
<ul>
<li>列表项1</li>
<li>列表项2</li>
</ul>`,
    table: `<h2>产品价格表</h2>
<table border="1">
<thead>
<tr><th>产品</th><th>价格</th></tr>
</thead>
<tbody>
<tr><td>笔记本</td><td>¥29.9</td></tr>
<tr><td>鼠标</td><td>¥9.9</td></tr>
</tbody>
</table>`,
    code: `<h2>Python 代码示例</h2>
<pre><code class="language-python">def hello():
    print("Hello, World!")
</code></pre>`
};
document.querySelectorAll('.example-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-example');
        if (examples[type]) {
            htmlInput.value = examples[type];
            convertToMarkdown(examples[type]);
        }
    });
});

// 页面加载时自动转换初始内容（如果你希望一开始就有示例，可以取消注释下一行）
// 默认textarea为空，不转换；也可以放一个默认示例
// 但是建议留空，让用户主动输入。
// 如果想让页面打开时有一个欢迎示例，可以取消注释下面这行：
// setTimeout(() => { htmlInput.value = examples.simple; convertToMarkdown(examples.simple); }, 100);

// 粘贴按钮事件
if (pasteBtn) {
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text.trim()) {
                htmlInput.value = text;
                convertToMarkdown(text);   // 自动转换
                showToast('📋 已粘贴内容并开始转换', 'success');
            } else {
                showToast('剪贴板为空', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('无法读取剪贴板内容，请检查浏览器权限', 'error');
        }
    });
}
