const CACHE_NAME = 'html2md-v2';

// 需要预缓存的资源
const PRECACHE_URLS = [
  '/',
  '/static/css/style.css',
  '/static/js/main.js',
  '/static/icon-192.png',
  '/static/icon-512.png',
  '/static/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js'
];

// 安装：预缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// 激活：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截请求：网络优先，回退到缓存
self.addEventListener('fetch', event => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  // API 请求不走缓存
  if (event.request.url.includes('/convert') || event.request.url.includes('/convert-url')) {
    event.respondWith(fetch(event.request).catch(() => {
      return new Response(
        JSON.stringify({ markdown: '', error: '当前处于离线状态，转换功能不可用。' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 将成功响应加入缓存
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // 离线时从缓存获取
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // HTML 页面回退到首页
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('离线', { status: 503 });
        });
      })
  );
});
