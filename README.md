# GitCloud

GitCloud 是一个基于 GitHub API 构建的端到端加密私有云存储解决方案。它利用 GitHub 仓库作为后端存储，并通过 Web Crypto API 提供强大的客户端加密功能。

## 🌟 特性

- **端到端加密**：所有文件在上传前均在浏览器端使用 AES-256-GCM 算法加密。
- **无服务器后端**：直接与 GitHub API 通信，无需部署复杂的数据库或文件服务器。
- **安全性**：敏感信息（如 GitHub Token）由用户提供并使用访问密码加密存储，不通过服务器中转。
- **文件管理**：支持上传、下载、删除、新建文件夹、文件搜索以及拖拽操作。

## 🚀 技术栈

- **框架**: [Next.js 16](https://nextjs.org/)
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **加密**: [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- **GitHub 交互**: [Octokit](https://github.com/octokit/octokit.js)
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/)

## 🛠️ 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd pan
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

在项目根目录创建 `.env.local` 文件，并添加以下配置：

```env
GITHUB_TOKEN=您的GitHub_Personal_Access_Token
GITHUB_OWNER=您的GitHub用户名
GITHUB_REPO=用于存储文件的仓库名称
APP_PASSWORD=访问GitCloud的全局密码
```

### 4. 启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。


## 📄 开源协议

基于 MIT 协议开源。

---

Powered by [THW](https://blog.tianhw.top)
