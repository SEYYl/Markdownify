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
const loadingOutput = document.getElementById('loadingOutput');
const loadingPreview = document.getElementById('loadingPreview');
let currentMarkdown = '';
let loadingTimeout = null;

// ========== 转换选项 ==========

const OPTIONS_KEY = 'htmlToMdOptions';
const defaultOptions = {
    links: true,
    images: true,
    tables: true,
    readability: true,
};

function loadOptions() {
    try {
        const saved = localStorage.getItem(OPTIONS_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...defaultOptions, ...parsed };
        }
    } catch (e) { /* ignore */ }
    return { ...defaultOptions };
}

function saveOptions(opts) {
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(opts));
}

function getOptionsPayload() {
    const opts = loadOptions();
    return {
        ignore_links: !opts.links,
        ignore_images: !opts.images,
        ignore_tables: !opts.tables,
        use_readability: opts.readability,
    };
}

function applyOptionsToUI() {
    const opts = loadOptions();
    document.getElementById('optLinks').checked = opts.links;
    document.getElementById('optImages').checked = opts.images;
    document.getElementById('optTables').checked = opts.tables;
    document.getElementById('optReadability').checked = opts.readability;
}

function setupOptionListeners() {
    ['optLinks', 'optImages', 'optTables', 'optReadability'].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('change', () => {
            const opts = {
                links: document.getElementById('optLinks').checked,
                images: document.getElementById('optImages').checked,
                tables: document.getElementById('optTables').checked,
                readability: document.getElementById('optReadability').checked,
            };
            saveOptions(opts);
            // 如果有内容，重新转换
            if (htmlInput.value.trim()) {
                convertToMarkdown(htmlInput.value);
            }
        });
    });
}

// 选项面板折叠
const optionsToggle = document.getElementById('optionsToggle');
const optionsContent = document.getElementById('optionsContent');
let optionsExpanded = localStorage.getItem('htmlToMdOptionsExpanded') === 'true';

function updateOptionsUI() {
    optionsContent.style.display = optionsExpanded ? 'flex' : 'none';
    optionsToggle.innerText = optionsExpanded ? '⚙️ 转换选项 ▴' : '⚙️ 转换选项 ▾';
}

optionsToggle.addEventListener('click', () => {
    optionsExpanded = !optionsExpanded;
    localStorage.setItem('htmlToMdOptionsExpanded', optionsExpanded);
    updateOptionsUI();
});

// ========== 转换历史 ==========

const HISTORY_KEY = 'htmlToMdHistory';
const MAX_HISTORY = 20;

function getHistory() {
    try {
        const saved = localStorage.getItem(HISTORY_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
}

function saveHistoryItem(entry) {
    let history = getHistory();
    history.unshift({
        ...entry,
        timestamp: Date.now(),
        id: Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    });
    if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function relativeTime(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return mins + '分钟前';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + '小时前';
    const days = Math.floor(hours / 24);
    if (days < 7) return days + '天前';
    return new Date(ts).toLocaleDateString('zh-CN');
}

function typeBadge(type) {
    const badges = { url: '🔗', html: '📄', text: '📝' };
    return badges[type] || '';
}

function deleteHistoryItem(id) {
    let history = getHistory();
    history = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
    updateHistoryUI();
}

function renderHistory() {
    const history = getHistory();
    const list = document.getElementById('historyList');
    const count = document.getElementById('historyCount');
    const clearBtn = document.getElementById('clearHistoryBtn');

    count.textContent = history.length;

    if (history.length === 0) {
        list.innerHTML = '<div class="history-empty">暂无转换记录</div>';
        clearBtn.style.display = 'none';
        return;
    }

    clearBtn.style.display = 'block';
    list.innerHTML = history.map((item, index) => {
        const time = relativeTime(item.timestamp);
        let label = item.title || item.url || item.preview || '(空)';
        if (item.title && item.url) {
            label = `${item.title}`;
        }
        const badge = typeBadge(item.type);
        return `
            <div class="history-item" data-index="${index}" data-id="${escapeHtml(item.id)}">
                <span class="history-badge">${badge}</span>
                <span class="history-label">${escapeHtml(label)}</span>
                <span class="history-time">${time}</span>
                <button class="history-delete" title="删除这条">✕</button>
            </div>
        `;
    }).join('');

    // 点击历史项还原
    list.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.classList.contains('history-delete')) return;
            const history = getHistory();
            const idx = parseInt(el.dataset.index);
            const item = history[idx];
            if (item && item.markdown) {
                currentMarkdown = item.markdown;
                markdownOutput.innerText = item.markdown;
                markdownPreview.innerHTML = DOMPurify.sanitize(marked.parse(item.markdown));
                if (typeof hljs !== 'undefined') {
                    markdownPreview.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightElement(block);
                    });
                }
                updateCharCount();
                showToast('📜 已加载历史记录', 'success');
            }
        });
    });

    // 单条删除
    list.querySelectorAll('.history-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = btn.closest('.history-item');
            const id = item.dataset.id;
            deleteHistoryItem(id);
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 历史面板折叠
const historyToggle = document.getElementById('historyToggle');
const historyContent = document.getElementById('historyContent');
let historyExpanded = localStorage.getItem('htmlToMdHistoryExpanded') === 'true';

function updateHistoryUI() {
    historyContent.style.display = historyExpanded ? 'block' : 'none';
    // 只更新计数和箭头，不销毁子元素
    const countEl = document.getElementById('historyCount');
    if (countEl) {
        countEl.textContent = getHistory().length;
    }
    const arrowEl = historyToggle.querySelector('span:last-child');
    if (arrowEl) {
        arrowEl.textContent = historyExpanded ? '▴' : '▾';
    }
}

historyToggle.addEventListener('click', () => {
    historyExpanded = !historyExpanded;
    localStorage.setItem('htmlToMdHistoryExpanded', historyExpanded);
    updateHistoryUI();
    if (historyExpanded) renderHistory();
});

// 清空历史
document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    localStorage.removeItem(HISTORY_KEY);

    // 确保面板展开，让用户看到"暂无转换记录"
    if (!historyExpanded) {
        historyExpanded = true;
        localStorage.setItem('htmlToMdHistoryExpanded', 'true');
    }

    // 更新 UI
    updateHistoryUI();
    renderHistory();
    showToast('🗑️ 历史已清空', 'success');
});

// ========== Loading 状态 ==========

// ========== Loading 状态 ==========

function showLoading() {
    loadingTimeout = setTimeout(() => {
        loadingOutput.setAttribute('aria-hidden', 'false');
        loadingPreview.setAttribute('aria-hidden', 'false');
        markdownOutput.childNodes.forEach(node => {
            if (node !== loadingOutput) node.remove();
        });
        markdownPreview.childNodes.forEach(node => {
            if (node !== loadingPreview) node.remove();
        });
    }, 200);
}

function hideLoading() {
    clearTimeout(loadingTimeout);
    loadingOutput.setAttribute('aria-hidden', 'true');
    loadingPreview.setAttribute('aria-hidden', 'true');
}

// ========== 转换函数 ==========

async function convertToMarkdown(html) {
    if (!html.trim()) {
        hideLoading();
        currentMarkdown = '';
        markdownOutput.innerText = '';
        markdownPreview.innerHTML = '';
        return;
    }
    showLoading();
    try {
        const response = await fetch('/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                html: html,
                options: getOptionsPayload()
            })
        });
        const data = await response.json();
        hideLoading();
        if (data.markdown !== undefined) {
            currentMarkdown = data.markdown;
            markdownOutput.innerText = data.markdown;
            markdownPreview.innerHTML = DOMPurify.sanitize(marked.parse(data.markdown));
            if (typeof hljs !== 'undefined') {
                markdownPreview.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
            updateCharCount();
            // 保存历史
            saveHistoryItem({
                preview: html.slice(0, 60).replace(/\s+/g, ' ').trim(),
                markdown: data.markdown,
                type: 'html',
            });
            updateHistoryUI();
        } else {
            markdownOutput.innerText = '转换失败，请检查 HTML 格式';
            markdownPreview.innerHTML = '<p>转换失败，请检查 HTML 格式</p>';
        }
    } catch (err) {
        hideLoading();
        markdownOutput.innerText = '网络错误：' + err.message;
        markdownPreview.innerHTML = '<p>网络错误：' + err.message + '</p>';
    }
}

let debounceTimer;
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

function displayMarkdown(markdown, sourceUrl, pageTitle) {
    currentMarkdown = markdown;
    markdownOutput.innerText = markdown;
    markdownPreview.innerHTML = DOMPurify.sanitize(marked.parse(markdown));
    if (typeof hljs !== 'undefined') {
        markdownPreview.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
    updateCharCount();
    // 保存历史
    const label = pageTitle || sourceUrl || markdown.slice(0, 60).replace(/\s+/g, ' ').trim();
    saveHistoryItem({
        title: pageTitle || '',
        url: sourceUrl || '',
        preview: markdown.slice(0, 60).replace(/\s+/g, ' ').trim(),
        markdown: markdown,
        type: pageTitle || sourceUrl ? 'url' : 'html',
    });
    updateHistoryUI();
}

async function convertUrlToMarkdown(url) {
    if (!url || !url.trim()) {
        return;
    }

    showLoading();

    try {
        const response = await fetch('/convert-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url.trim(),
                options: getOptionsPayload()
            })
        });
        const data = await response.json();
        hideLoading();
        if (response.ok && data.markdown !== undefined) {
            displayMarkdown(data.markdown, url, data.title);
            showToast('🔗 URL 转换成功！', 'success');
        } else {
            const errorMsg = data.error || 'URL 转换失败';
            markdownOutput.innerText = errorMsg;
            markdownPreview.innerHTML = `<p>${DOMPurify.sanitize(errorMsg)}</p>`;
            showToast(errorMsg, 'error');
        }
    } catch (err) {
        hideLoading();
        const errorMsg = '网络错误：' + err.message;
        markdownOutput.innerText = errorMsg;
        markdownPreview.innerHTML = `<p>${DOMPurify.sanitize(errorMsg)}</p>`;
        showToast(errorMsg, 'error');
    }
}

// ========== 事件绑定 ==========

// ========== 输入模式切换（HTML / 文本） ==========

let inputMode = 'html'; // 'html' | 'text'

function setInputMode(mode) {
    inputMode = mode;
    // 更新 tab 样式
    document.querySelectorAll('.input-mode-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });
    // 更新 placeholder 和提示
    if (mode === 'text') {
        htmlInput.placeholder = '在此粘贴纯文本，或拖拽 .txt 文件到此处...';
    } else {
        htmlInput.placeholder = '在此粘贴 HTML 代码，或拖拽 HTML 文件到此处...';
    }
    // 清空并重置
    htmlInput.value = '';
    currentMarkdown = '';
    hideLoading();
    markdownOutput.innerText = '';
    markdownPreview.innerHTML = '';
    updateCharCount();
}

document.querySelectorAll('.input-mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        if (mode !== inputMode) {
            setInputMode(mode);
        }
    });
});

// 覆盖输入处理：根据模式走不同的转换
const handleInput = debounce((e) => {
    const text = e.target.value;
    if (inputMode === 'text') {
        convertTextToMarkdown(text);
    } else {
        convertToMarkdown(text);
    }
}, 500);
htmlInput.addEventListener('input', handleInput);

// 文本模式转换
async function convertTextToMarkdown(text) {
    if (!text.trim()) {
        hideLoading();
        currentMarkdown = '';
        markdownOutput.innerText = '';
        markdownPreview.innerHTML = '';
        return;
    }
    showLoading();
    try {
        const response = await fetch('/convert-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                options: getOptionsPayload()
            })
        });
        const data = await response.json();
        hideLoading();
        if (data.markdown !== undefined) {
            currentMarkdown = data.markdown;
            markdownOutput.innerText = data.markdown;
            markdownPreview.innerHTML = DOMPurify.sanitize(marked.parse(data.markdown));
            if (typeof hljs !== 'undefined') {
                markdownPreview.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
            updateCharCount();
            saveHistoryItem({
                preview: text.slice(0, 60).replace(/\s+/g, ' ').trim(),
                markdown: data.markdown,
                type: 'text',
            });
            updateHistoryUI();
        }
    } catch (err) {
        hideLoading();
        markdownOutput.innerText = '网络错误：' + err.message;
        markdownPreview.innerHTML = '<p>网络错误：' + err.message + '</p>';
    }
}

// ========== 智能粘贴检测 ==========
htmlInput.addEventListener('paste', (event) => {
    const pasted = (event.clipboardData || window.clipboardData).getData('text');
    if (!pasted) return;

    const trimmed = pasted.trim();

    // 1. 检测 URL → 直接 URL 转换
    if (/^https?:\/\/[^\s<"'<>]+$/i.test(trimmed) && trimmed.split('\n').length <= 1) {
        event.preventDefault();
        convertUrlToMarkdown(trimmed);
        showToast('🔗 检测到链接，自动转换', 'success');
        return;
    }

    // 2. 检测 HTML → 自动切到 HTML 模式
    const hasHtml = /<[a-z][\s\S]*>/i.test(trimmed);
    if (hasHtml && inputMode !== 'html') {
        // 阻止默认粘贴，手动设置内容后触发转换
        event.preventDefault();
        setInputMode('html');
        htmlInput.value = trimmed;
        convertToMarkdown(trimmed);
        showToast('📄 检测到 HTML，已切换模式', 'success');
        return;
    }

    // 3. 纯文本 → 自动切到文本模式
    if (!hasHtml && inputMode !== 'text') {
        event.preventDefault();
        setInputMode('text');
        htmlInput.value = trimmed;
        convertTextToMarkdown(trimmed);
        showToast('📝 检测到纯文本，已切换模式', 'success');
    }
    // 模式正确则让浏览器正常粘贴
});

// 一键复制
copyBtn.addEventListener('click', async () => {
    if (!currentMarkdown) {
        showToast('没有可复制的内容', 'error');
        return;
    }

    // 尝试 clipboard API
    try {
        await navigator.clipboard.writeText(currentMarkdown);
        showToast('已成功复制到剪贴板', 'success');
    } catch {
        // fallback: 用 textarea 选中 + execCommand
        try {
            const ta = document.createElement('textarea');
            ta.value = currentMarkdown;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('已成功复制到剪贴板', 'success');
        } catch {
            showToast('复制失败，请手动选择后 Ctrl+C', 'error');
            return;
        }
    }

    const originalText = copyBtn.innerText;
    copyBtn.innerText = '✅ 已复制';
    setTimeout(() => { copyBtn.innerText = originalText; }, 1500);
});

downloadBtn.addEventListener('click', () => {
    if (!currentMarkdown) {
        showToast('没有可下载的 Markdown', 'error');
        return;
    }
    const now = new Date();
    const ts = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + '-' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0');
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `html2md-${ts}.md`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
});

clearBtn.addEventListener('click', () => {
    htmlInput.value = '';
    currentMarkdown = '';
    hideLoading();
    markdownOutput.innerText = '';
    markdownPreview.innerHTML = '';
    updateCharCount();
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

urlConvertBtn.addEventListener('click', () => { openUrlModal(); });
urlModalClose.addEventListener('click', closeUrlModal);
urlModalCancel.addEventListener('click', closeUrlModal);
urlModal.addEventListener('click', (event) => {
    if (event.target === urlModal) { closeUrlModal(); }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && urlModal.getAttribute('aria-hidden') === 'false') {
        closeUrlModal();
    }
});

urlModalSubmit.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) { urlInput.focus(); return; }
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

// ========== 批量 URL 转换 ==========

const batchUrlBtn = document.getElementById('batchUrlBtn');
const batchUrlModal = document.getElementById('batchUrlModal');
const batchUrlInput = document.getElementById('batchUrlInput');
const batchUrlModalClose = document.getElementById('batchUrlModalClose');
const batchUrlModalCancel = document.getElementById('batchUrlModalCancel');
const batchUrlModalSubmit = document.getElementById('batchUrlModalSubmit');

function openBatchUrlModal() {
    batchUrlModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    batchUrlInput.value = '';
    setTimeout(() => batchUrlInput.focus(), 100);
}

function closeBatchUrlModal() {
    batchUrlModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

batchUrlBtn.addEventListener('click', openBatchUrlModal);
batchUrlModalClose.addEventListener('click', closeBatchUrlModal);
batchUrlModalCancel.addEventListener('click', closeBatchUrlModal);

batchUrlModal.addEventListener('click', (event) => {
    if (event.target === batchUrlModal) { closeBatchUrlModal(); }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && batchUrlModal.getAttribute('aria-hidden') === 'false') {
        closeBatchUrlModal();
    }
});

batchUrlModalSubmit.addEventListener('click', async () => {
    const text = batchUrlInput.value.trim();
    if (!text) { batchUrlInput.focus(); return; }

    const urls = text.split('\n')
        .map(u => u.trim())
        .filter(u => u && /^https?:\/\//i.test(u));

    if (urls.length === 0) {
        showToast('请输入有效的网页地址（http:// 或 https://）', 'error');
        return;
    }

    closeBatchUrlModal();
    showLoading();

    try {
        const response = await fetch('/convert-urls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                urls: urls,
                options: getOptionsPayload()
            })
        });
        const data = await response.json();
        hideLoading();

        if (response.ok && data.markdown) {
            displayMarkdown(data.markdown, `批量转换 (${urls.length} 个链接)`);

            const success = data.results.filter(r => r.success).length;
            const failed = data.results.filter(r => !r.success).length;
            const msg = failed > 0
                ? `✅ ${success} 个成功，❌ ${failed} 个失败`
                : `✅ ${success} 个全部转换成功`;
            showToast(msg, failed > 0 ? 'error' : 'success');
        } else {
            showToast(data.error || '批量转换失败', 'error');
        }
    } catch (err) {
        hideLoading();
        showToast('网络错误：' + err.message, 'error');
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

// ========== 主题切换（三态：light → dark → cyber） ==========

const THEME_MODES = ['light', 'dark', 'cyber'];
const THEME_LABELS = {
    light: '🌙 深色模式',
    dark: '💠 赛博模式',
    cyber: '☀️ 浅色模式',
};

function getNextTheme(current) {
    const idx = THEME_MODES.indexOf(current);
    return THEME_MODES[(idx + 1) % THEME_MODES.length];
}

function applyTheme(mode) {
    // 移除所有主题类
    document.body.classList.remove('dark', 'cyber-theme');
    if (mode === 'dark') {
        document.body.classList.add('dark');
    } else if (mode === 'cyber') {
        document.body.classList.add('cyber-theme');
    }
    // 按钮文字显示下一个模式
    const next = getNextTheme(mode);
    themeToggle.innerText = THEME_LABELS[mode];
    localStorage.setItem('htmlToMdTheme', mode);
    // 重新高亮代码块
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('.markdown-output pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
}

// 初始化主题
let savedTheme = localStorage.getItem('htmlToMdTheme');
if (!savedTheme) {
    // 首次使用，检测系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        savedTheme = 'dark';
    } else {
        savedTheme = 'light';
    }
}
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = localStorage.getItem('htmlToMdTheme') || 'light';
    const next = getNextTheme(current);
    applyTheme(next);
});

// ========== 布局切换 ==========

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

// ========== 拖拽上传 ==========

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
    if (files.length === 0) return;

    const file = files[0];
    const isHtml = file.name.endsWith('.html') || file.type === 'text/html';
    const isText = file.name.endsWith('.txt') || file.type === 'text/plain';

    if (isHtml) {
        // HTML 文件 → 切到 HTML 模式
        if (inputMode !== 'html') setInputMode('html');
        const text = await file.text();
        htmlInput.value = text;
        convertToMarkdown(text);
    } else if (isText) {
        // 文本文件 → 切到文本模式
        if (inputMode !== 'text') setInputMode('text');
        const text = await file.text();
        htmlInput.value = text;
        convertTextToMarkdown(text);
    } else {
        showToast('请拖拽 .html 或 .txt 文件', 'error');
    }
}

// ========== 字数统计 ==========

function updateCharCount() {
    const inputEl = document.getElementById('inputCharCount');
    const outputEl = document.getElementById('outputCharCount');
    const inputLen = htmlInput.value.length;
    const outputLen = currentMarkdown.length;
    inputEl.textContent = inputLen > 0 ? `${inputLen}` : '';
    outputEl.textContent = outputLen > 0 ? `${outputLen}` : '';
}

// 输入实时更新字数
htmlInput.addEventListener('input', updateCharCount);

// ========== 示例模板 ==========

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

// ========== 粘贴按钮 ==========

if (pasteBtn) {
    pasteBtn.addEventListener('click', async () => {
        try {
            // 先请求剪贴板读取权限
            let permission = await navigator.permissions.query({ name: 'clipboard-read' });
            if (permission.state === 'denied') {
                // 权限被拒，聚焦输入框让用户手动粘贴
                htmlInput.focus();
                htmlInput.select();
                showToast('📋 请按 Ctrl+V 粘贴内容', 'error');
                return;
            }
            const text = await navigator.clipboard.readText();
            if (text.trim()) {
                htmlInput.value = text;
                // 根据内容类型自动处理
                if (/^https?:\/\//i.test(text.trim()) && text.trim().split('\n').length <= 1) {
                    convertUrlToMarkdown(text.trim());
                } else {
                    convertToMarkdown(text);
                }
                showToast('📋 已粘贴内容并开始转换', 'success');
            } else {
                showToast('剪贴板为空', 'error');
            }
        } catch (err) {
            // clipboard 不可用（HTTP 或浏览器限制），聚焦输入框让用户手动粘贴
            console.warn('Clipboard API unavailable:', err.message);
            htmlInput.focus();
            htmlInput.select();
            showToast('📋 请按 Ctrl+V 粘贴内容', 'error');
        }
    });
}

// ========== HTML 格式化 ==========

function formatHTML(code) {
    // 简单但有效的 HTML 格式化：基于标签缩进
    const voidElements = new Set([
        'area','base','br','col','embed','hr','img','input','link','meta',
        'param','source','track','wbr','command','keygen','menuitem'
    ]);
    // 去掉多余的空白
    let clean = code
        .replace(/<!--[\s\S]*?-->/g, '')  // 移除注释
        .replace(/>\s+</g, '>\n<')        // 标签间换行
        .replace(/(<[^>]+>)\s*/g, '$1\n') // 标签后换行
        .replace(/\s*<\//g, '\n</')       // 闭合标签前换行
        .replace(/\n{2,}/g, '\n')         // 多余空行
        .trim();

    const lines = clean.split('\n');
    const result = [];
    let indent = 0;
    const indentStr = '  ';

    for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // 闭合标签减少缩进
        if (/^<\//.test(trimmed)) {
            indent = Math.max(0, indent - 1);
        }

        result.push(indentStr.repeat(indent) + trimmed);

        // 非自闭合、非空、非注释标签增加缩进
        const tagMatch = trimmed.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
        if (tagMatch) {
            const tag = tagMatch[1].toLowerCase();
            const isVoid = voidElements.has(tag);
            const isClosing = /^<\//.test(trimmed);
            const isSelfClosing = /\/>$/.test(trimmed);
            if (!isClosing && !isVoid && !isSelfClosing) {
                indent++;
            }
        }
    }

    return result.join('\n');
}

const formatBtn = document.getElementById('formatBtn');
if (formatBtn) {
    formatBtn.addEventListener('click', () => {
        const html = htmlInput.value.trim();
        if (!html) {
            showToast('没有可格式化的内容', 'error');
            return;
        }
        // 检测是不是 HTML 模式或内容像 HTML
        if (inputMode !== 'html' && !/<[a-z][\s\S]*>/i.test(html)) {
            showToast('格式化仅支持 HTML 模式', 'error');
            return;
        }
        // 如果当前不是 HTML 模式，自动切换
        if (inputMode !== 'html') {
            setInputMode('html');
        }

        try {
            const formatted = formatHTML(html);
            htmlInput.value = formatted;
            convertToMarkdown(formatted);
            showToast('✨ HTML 已格式化', 'success');
        } catch (err) {
            console.error(err);
            showToast('格式化失败：' + err.message, 'error');
        }
    });
}

// ========== 初始化 ==========

applyOptionsToUI();
setupOptionListeners();
updateOptionsUI();
renderHistory();
updateHistoryUI();
