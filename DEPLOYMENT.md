# 部署指南

本文档详细介绍如何将 **HTML to Markdown 转换器** 部署到不同的平台。

---

## 📋 目录

- [部署前准备](#部署前准备)
- [方案一：Render（推荐）](#方案一render推荐)
- [方案二：Railway](#方案二railway)
- [方案三：PythonAnywhere](#方案三pythonanywhere)
- [方案四：Fly.io](#方案四flyio)
- [方案五：Docker 部署](#方案五docker-部署)
- [方案六：VPS/云服务器](#方案六vps云服务器)
- [部署对比表](#部署对比表)
- [故障排除](#故障排除)

---

## 🛠️ 部署前准备

### 1. 确保代码已推送到 GitHub

```bash
git add .
git commit -m "准备部署"
git push origin main
```

### 2. 验证关键配置（已完成）

**app.py 已支持环境变量端口：**
```python
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

**requirements.txt 使用兼容版本：**
```
requests>=2.28.0  # 避免版本冲突
```

### 3. 本地测试

在部署前，建议先在本地测试应用是否正常运行：

```bash
# 安装依赖
pip install -r requirements.txt

# 运行应用
python app.py
```

访问 `http://localhost:5000` 确认应用正常。

---

## ☁️ 方案一：Render（推荐）

**优点**：免费、自动部署、HTTPS、操作简单  
**适合**：个人项目、快速部署、测试环境

### 详细步骤

#### 1. 注册并连接 GitHub

1. 访问 [https://render.com](https://render.com)
2. 点击 **Get Started for Free**
3. 使用 GitHub 账号登录
4. 授权 Render 访问你的 GitHub 仓库

#### 2. 创建 Web Service

1. 进入 Dashboard
2. 点击 **New +** → **Web Service**
3. 在 **Connect a repository** 页面，选择你的 `html-to-markdown-web` 仓库
4. 点击 **Connect**

#### 3. 配置部署参数

填写以下配置：

```
Name: html-to-md (或你喜欢的名称)
Environment: Python 3
Region: 
  - Singapore (新加坡，适合亚洲用户)
  - Frankfurt (法兰克福，适合欧洲用户)
  - Oregon (俄勒冈，适合美洲用户)
Branch: main
Root Directory: (留空)
```

#### 4. 设置构建和启动命令

**Advanced 区域：**

```
Build Command: pip install -r requirements.txt

Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
```

#### 5. 选择实例类型

- **Free**：免费，15 分钟无活动会休眠
- **Starter**：$7/月，不休眠，512MB RAM

选择 **Free** 即可开始。

#### 6. 创建并等待部署

1. 点击 **Create Web Service**
2. 等待 2-5 分钟完成部署
3. 部署成功后，你会获得一个公网 URL
   - 格式：`https://html-to-md-xxxx.onrender.com`

### 管理应用

#### 查看部署日志

- 进入应用 Dashboard
- 点击 **Logs** 标签
- 可以查看实时日志和历史部署记录

#### 手动触发重新部署

- 点击 **Manual Deploy** → **Deploy latest commit**
- 每次推送代码到 GitHub 也会自动触发部署

#### 配置自定义域名（可选）

1. 进入 **Settings** 标签
2. 找到 **Custom Domains**
3. 点击 **Add Custom Domain**
4. 按照提示配置 DNS

### 注意事项

⚠️ **免费实例限制：**
- 15 分钟无活动自动休眠
- 首次访问需要 30-50 秒唤醒时间
- 每月 750 小时免费额度
- 适合个人使用和测试

 **优化建议：**
- 可以设置健康检查端点保持活跃
- 或使用 Starter 实例避免休眠

---

## 🚂 方案二：Railway

**优点**：每月 $5 免费额度、自动检测、部署快速  
**适合**：小型应用、测试项目、需要数据库的场景

### 详细步骤

#### 1. 注册 Railway

1. 访问 [https://railway.app](https://railway.app)
2. 点击 **Start a New Project**
3. 选择 **Login with GitHub**
4. 授权访问你的仓库

#### 2. 从 GitHub 导入

1. 点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 搜索并选择 `html-to-markdown-web` 仓库
4. 点击 **Deploy**

#### 3. 自动配置

Railway 会自动：
- 检测 Python 项目
- 安装 `requirements.txt` 中的依赖
- 使用 gunicorn 启动应用
- 分配端口和环境变量

#### 4. 查看部署状态

1. 进入项目页面
2. 点击服务卡片查看详细信息
3. 在 **Deployments** 标签查看部署历史
4. 在 **Logs** 标签查看实时日志

#### 5. 生成公网域名

1. 点击 **Settings** 标签
2. 找到 **Domains** 部分
3. 点击 **Generate Domain**
4. 获得类似 `html-to-md-production.up.railway.app` 的域名

#### 6. 配置环境变量（可选）

如果需要添加环境变量：
1. 点击 **Variables** 标签
2. 点击 **New Variable**
3. 添加键值对
4. 点击 **Deploy** 重新部署

### 注意事项

- 免费额度：$5/月（通常足够小项目）
- 支持自定义域名
- 提供 PostgreSQL、Redis 等数据库服务
- 项目长时间不活跃可能会被暂停

---

## 🐍 方案三：PythonAnywhere

**优点**：专为 Python 优化、免费版可用、稳定性好  
**适合**：Python 项目、学习、长期运行的小应用

### 详细步骤

#### 1. 注册账户

1. 访问 [https://www.pythonanywhere.com](https://www.pythonanywhere.com)
2. 选择 **Beginner**（免费）或 **Hacker**（$5/月）
3. 创建账户并登录

#### 2. 上传代码

**方法 A：从 GitHub 克隆（推荐）**

1. 点击右上角 **Consoles** → **Bash**
2. 运行命令：
   ```bash
   git clone https://github.com/你的用户名/html-to-markdown-web.git
   ```

**方法 B：直接上传文件**

1. 进入 **Files** 标签页
2. 点击 **Upload a file**
3. 逐个上传项目文件

#### 3. 创建 Web 应用

1. 进入 **Web** 标签页
2. 点击 **Add a new web app**
3. 选择 **Manual configuration**
4. 选择 **Python 3.10**（或最新版本）
5. 点击 **Next**

#### 4. 配置 WSGI 文件

1. 点击 **WSGI configuration file** 链接
2. 注释掉所有现有代码
3. 添加以下代码：

```python
import sys

# 添加项目路径
path = '/home/你的用户名/html-to-markdown-web'
if path not in sys.path:
    sys.path.append(path)

# 导入 Flask 应用
from app import app as application
```

4. 点击 **Save**

#### 5. 安装依赖

1. 打开 **Bash** 控制台
2. 运行：
   ```bash
   cd html-to-markdown-web
   pip3.10 install -r requirements.txt --user
   ```

#### 6. 配置静态文件

1. 回到 **Web** 标签页
2. 找到 **Static files** 部分
3. 点击 **Add another static file**
4. 填写：
   ```
   URL: /static/
   Directory: /home/你的用户名/html-to-markdown-web/static/
   ```
5. 点击保存

#### 7. 重新加载应用

1. 在 **Web** 标签页顶部
2. 点击绿色的 **Reload** 按钮
3. 等待几秒钟

#### 8. 访问应用

访问：`https://你的用户名.pythonanywhere.com`

### 注意事项

- 免费版每日 CPU 限制：100 秒
- 不支持自定义端口
- 需要每天登录一次保持活跃（免费版）
- 域名格式：`你的用户名.pythonanywhere.com`

---

##  方案四：Fly.io

**优点**：全球边缘节点、免费额度、支持 Docker  
**适合**：需要全球低延迟、容器化部署

### 详细步骤

#### 1. 安装 Fly CLI

**macOS：**
```bash
brew install flyctl
```

**Linux：**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows（PowerShell）：**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

#### 2. 注册并登录

```bash
fly auth signup  # 注册新账户
# 或
fly auth login   # 登录已有账户
```

#### 3. 创建应用

```bash
cd html-to-markdown-web
fly launch
```

交互式配置：
```
? App Name: html-to-md (或留空自动生成)
? Choose region: sin (新加坡) / fra (法兰克福) / ewr (纽约)
? Would you like to set up a Postgresql database now? No
? Would you like to set up an Upstash Redis database now? No
```

#### 4. 部署应用

```bash
fly deploy
```

等待几分钟完成部署。

#### 5. 访问应用

```bash
fly open  # 在浏览器中打开
# 或
fly status  # 查看应用状态
```

#### 6. 查看日志

```bash
fly logs  # 查看实时日志
```

### 注意事项

- 免费额度：3 个免费 VM（256MB RAM）
- 支持自定义域名
- 全球多个区域可选
- 需要安装 Fly CLI

---

##  方案五：Docker 部署

**优点**：环境一致、易于迁移、适合任何服务器  
**适合**：本地测试、私有服务器、容器化环境

### 方法一：直接 Docker 部署

#### 1. 创建 Dockerfile

在项目根目录创建 `Dockerfile`（无扩展名）：

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

# 暴露端口
EXPOSE 5000

# 启动应用
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
```

#### 2. 创建 .dockerignore

```
venv/
__pycache__/
.git/
*.md
screenshots/
.vscode/
.env
```

#### 3. 构建镜像

```bash
docker build -t html-to-md-converter .
```

#### 4. 运行容器

```bash
# 基本运行
docker run -d -p 5000:5000 --name html-to-md html-to-md-converter

# 带环境变量运行
docker run -d -p 5000:5000 \
  --name html-to-md \
  -e PORT=5000 \
  html-to-md-converter
```

#### 5. 访问应用

打开浏览器访问：`http://localhost:5000`

#### 6. 管理容器

```bash
# 查看运行中的容器
docker ps

# 查看日志
docker logs html-to-md

# 停止容器
docker stop html-to-md

# 启动容器
docker start html-to-md

# 删除容器
docker rm html-to-md

# 删除镜像
docker rmi html-to-md-converter
```

### 方法二：Docker Compose 部署

#### 1. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  html-to-md:
    build: .
    ports:
      - "5000:5000"
    restart: unless-stopped
    environment:
      - PORT=5000
    volumes:
      - ./static:/app/static  # 可选：挂载静态文件
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

#### 2. 启动服务

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 重新构建并启动
docker-compose up -d --build
```

#### 3. 查看状态

```bash
docker-compose ps
```

### 注意事项

- 需要安装 Docker 和 Docker Compose
- 确保 5000 端口未被占用
- 生产环境建议使用反向代理（如 Nginx）
- 可以配合 systemd 实现开机自启

---

## 🖥️ 方案六：VPS/云服务器

**优点**：完全控制、无限制、适合生产环境  
**适合**：生产环境、高流量应用、需要自定义配置

### Ubuntu/Debian 服务器部署

#### 1. 连接服务器

```bash
ssh root@your-server-ip
# 或
ssh ubuntu@your-server-ip
```

#### 2. 更新系统并安装必要软件

```bash
# 更新包列表
sudo apt update && sudo apt upgrade -y

# 安装 Python、Nginx、Git
sudo apt install -y python3 python3-pip python3-venv nginx git
```

#### 3. 克隆项目

```bash
cd /var/www
sudo git clone https://github.com/你的用户名/html-to-markdown-web.git
cd html-to-markdown-web
```

#### 4. 创建虚拟环境

```bash
# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 退出虚拟环境
deactivate
```

#### 5. 创建 Systemd 服务

创建服务文件：

```bash
sudo nano /etc/systemd/system/html-to-md.service
```

添加以下内容：

```ini
[Unit]
Description=HTML to Markdown Converter
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/html-to-markdown-web
Environment="PATH=/var/www/html-to-markdown-web/venv/bin"
ExecStart=/var/www/html-to-markdown-web/venv/bin/gunicorn app:app --bind 0.0.0.0:5000 --workers 2 --threads 2
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**参数说明：**
- `--workers 2`：2 个工作进程
- `--threads 2`：每个进程 2 个线程
- `Restart=always`：崩溃后自动重启

#### 6. 启动服务

```bash
# 重载 systemd 配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start html-to-md

# 设置开机自启
sudo systemctl enable html-to-md

# 查看状态
sudo systemctl status html-to-md

# 查看日志
sudo journalctl -u html-to-md -f
```

#### 7. 配置 Nginx 反向代理

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/html-to-md
```

添加配置：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 日志
    access_log /var/log/nginx/html-to-md-access.log;
    error_log /var/log/nginx/html-to-md-error.log;

    # 代理设置
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # 静态文件
    location /static/ {
        alias /var/www/html-to-markdown-web/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 安全设置
    location ~ /\. {
        deny all;
    }
}
```

#### 8. 启用站点

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/html-to-md /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl restart nginx
```

#### 9. 配置防火墙

```bash
# 允许 HTTP 和 HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 允许 SSH（重要！）
sudo ufw allow 22/tcp

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

#### 10. 配置 SSL（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取并配置 SSL 证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 按照提示输入邮箱和同意条款
# 选择是否重定向 HTTP 到 HTTPS（推荐选择 2）
```

**自动续期测试：**
```bash
sudo certbot renew --dry-run
```

#### 11. 监控和维护

```bash
# 查看应用状态
sudo systemctl status html-to-md

# 查看 Nginx 状态
sudo systemctl status nginx

# 查看应用日志
sudo journalctl -u html-to-md -n 100

# 查看 Nginx 访问日志
sudo tail -f /var/log/nginx/html-to-md-access.log

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/html-to-md-error.log

# 重启应用
sudo systemctl restart html-to-md

# 重启 Nginx
sudo systemctl restart nginx
```

### CentOS/RHEL 服务器部署

步骤类似，但包管理器不同：

```bash
# 安装依赖
sudo yum update -y
sudo yum install -y python3 python3-pip nginx git

# 使用 pip3 而非 pip
pip3 install -r requirements.txt

# Systemd 配置相同
# Nginx 配置路径：/etc/nginx/nginx.conf
```

### 注意事项

- 推荐 Ubuntu 20.04+ 或 Debian 11+
- 需要配置防火墙
- 强烈建议配置 SSL 证书
- 定期备份数据和代码
- 设置日志轮转避免磁盘满
- 监控服务器资源使用

---

## 📊 部署对比表

| 特性 | Render | Railway | PythonAnywhere | Fly.io | Docker | VPS |
|------|--------|---------|----------------|--------|--------|-----|
| **费用** | 免费/$7+ | $5免费额度 | 免费/$5+ | 免费额度 | 取决于主机 | $5+/月 |
| **难度** | ⭐ | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **休眠** | 有(免费) | 无 | 有限制 | 无 | 无 | 无 |
| **自定义域名** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **HTTPS** | ✅ | ✅ | ✅ | ✅ | 需配置 | 需配置 |
| **自动部署** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **数据库支持** | ❌ | ✅ | ❌ | ✅ | 需配置 | 需配置 |
| **适合场景** | 个人项目 | 小型应用 | Python项目 | 全球部署 | 任何环境 | 生产环境 |
| **月流量限制** | 100GB | 无限制 | 有限制 | 160GB | 无限制 | 取决于套餐 |
| **RAM** | 512MB | 512MB | 有限制 | 256MB | 取决于主机 | 取决于套餐 |
| **支持地区** | 3个 | 多个 | 1个 | 30+ | 任意 | 任意 |

---

## 🔧 故障排除

### 常见问题及解决方案

#### 1. 构建失败：找不到依赖版本

**错误信息：**
```
ERROR: No matching distribution found for requests==2.31.2
```

**解决方案：**
- 修改 `requirements.txt`，使用 `>=` 替代 `==`
- 例如：`requests>=2.28.0`
- 重新推送代码触发重新部署

#### 2. 端口绑定错误

**错误信息：**
```
OSError: [Errno 98] Address already in use
```

**解决方案：**
- 确保 app.py 从环境变量读取 PORT
- 检查代码：
  ```python
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=False)
  ```
- 重启服务或容器

#### 3. 静态文件 404 错误

**症状：** CSS/JS 文件无法加载，页面样式丢失

**解决方案：**
- **Render/Railway**：自动处理，检查路径是否正确
- **PythonAnywhere**：配置 Static files 映射
  ```
  URL: /static/
  Directory: /home/用户名/html-to-markdown-web/static/
  ```
- **VPS/Nginx**：检查 Nginx 配置中的 alias 路径
  ```nginx
  location /static/ {
      alias /var/www/html-to-markdown-web/static/;
  }
  ```

#### 4. 依赖安装失败

**错误信息：**
```
ERROR: Could not find a version that satisfies the requirement
```

**解决方案：**
- 检查 `requirements.txt` 格式（每行一个包）
- 确保没有多余的空格或特殊字符
- 尝试更新 pip：`pip install --upgrade pip`
- 使用 `--no-cache-dir` 标志：
  ```bash
  pip install --no-cache-dir -r requirements.txt
  ```

#### 5. 应用无法启动

**症状：** 部署成功但无法访问

**排查步骤：**
1. **查看部署日志**
   - Render：Dashboard → Logs
   - Railway：项目 → Logs
   - VPS：`sudo journalctl -u html-to-md -f`

2. **检查常见错误**
   - Python 版本不兼容
   - 缺少必要的依赖
   - 端口配置错误
   - 权限问题

3. **本地测试**
   ```bash
   python app.py
   # 确认本地能正常运行
   ```

#### 6. 超时或连接被拒绝

**症状：** 访问时显示 502/504 错误

**解决方案：**
- 检查应用是否正常运行
- 增加 gunicorn 超时设置：
  ```bash
  gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120
  ```
- 检查防火墙规则
- 验证域名 DNS 配置

#### 7. 内存不足错误

**错误信息：**
```
Killed
```
或
```
MemoryError
```

**解决方案：**
- 增加实例规格（升级到付费套餐）
- 减少 gunicorn worker 数量：
  ```bash
  gunicorn app:app --workers 1 --threads 1
  ```
- 优化代码减少内存使用

#### 8. 权限错误

**错误信息：**
```
Permission denied
```

**解决方案：**
- VPS 部署时确保正确的文件权限：
  ```bash
  sudo chown -R www-data:www-data /var/www/html-to-markdown-web
  sudo chmod -R 755 /var/www/html-to-markdown-web
  ```
- 使用正确的用户运行服务

### 查看日志命令

#### Render
```
Dashboard → 选择应用 → Logs 标签
```

#### Railway
```
项目页面 → 选择服务 → Logs 标签
```

#### PythonAnywhere
```
Web 标签 → Error log / Server log
```

#### Fly.io
```bash
fly logs
```

#### Docker
```bash
# 查看容器日志
docker logs html-to-md

# 实时查看
docker logs -f html-to-md
```

#### VPS (Systemd)
```bash
# 查看服务日志
sudo journalctl -u html-to-md

# 实时查看
sudo journalctl -u html-to-md -f

# 查看最近 100 行
sudo journalctl -u html-to-md -n 100
```

#### Nginx
```bash
# 访问日志
sudo tail -f /var/log/nginx/html-to-md-access.log

# 错误日志
sudo tail -f /var/log/nginx/html-to-md-error.log
```

---

## 📚 快速参考

### 常用命令速查

#### Git 操作
```bash
git status                    # 查看状态
git add .                     # 添加所有文件
git commit -m "message"       # 提交
git push origin main          # 推送
```

#### Docker 操作
```bash
docker build -t app .         # 构建镜像
docker run -p 5000:5000 app   # 运行容器
docker ps                     # 查看容器
docker logs app               # 查看日志
docker-compose up -d          # 启动服务
```

#### VPS 服务管理
```bash
sudo systemctl start html-to-md    # 启动
sudo systemctl stop html-to-md     # 停止
sudo systemctl restart html-to-md  # 重启
sudo systemctl status html-to-md   # 状态
sudo systemctl enable html-to-md   # 开机自启
```

---

##  需要帮助？

如果遇到问题：
1. 查看本文档的故障排除部分
2. 查看各平台的官方文档
3. 在 GitHub 提交 Issue：https://github.com/SEYYl/html-to-markdown-web/issues
4. 查看项目 README.md

---

**最后更新**: 2026年5月
