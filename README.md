# Git Pan - 纯前端（Git驱动）加密网盘

一个基于 Next.js 构建的、使用 Git 作为存储后端的纯前端网盘系统。

## 特性

- **Git 存储**: 所有的文件都存储在 Git 仓库中（默认使用 cnb.cool）。
- **客户端加密**: 文件在上传前在浏览器中使用 AES 进行加密，确保传输和 Git 存储的都是加密数据。
- **开屏认证**: 进入页面需要输入密码，该密码同时作为 AES 加密的密钥。
- **无明文令牌**: Git Token 和 API 密钥均存储在服务端环境变量中，不会泄露到客户端。

## 快速开始

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **配置环境变量**:
   在根目录创建 .env.local 文件：
   ```env
   GIT_USERNAME=cnb
   GIT_TOKEN=9VW6cjvSFR1fb46dnvoarjyRCnC
   GIT_REPO=https://cnb.cool/tianhw/pan
   APP_PASSWORD=你的访问密码
   ```

3. **运行开发服务器**:
   ```bash
   npm run dev
   ```

4. **访问**:
   打开 http://localhost:3000

## 安全说明

- **传输安全**: 建议在 HTTPS 环境下运行。
- **端到端加密**: 文件的明文内容从未离开过用户的浏览器，除非通过解密过程查看。
- **环境安全**: Git Token 仅在 Node.js 环境中执行，确保了仓库的安全性。
