# ✨ Starflare

[![GitHub 仓库星标数](https://img.shields.io/github/stars/nieheyong/starflare)](https://github.com/nieheyong/starflare/stargazers)
[![GitHub 仓库派生数](https://img.shields.io/github/forks/nieheyong/starflare)](https://github.com/nieheyong/starflare/network/members)
[![GitHub 仓库议题数](https://img.shields.io/github/issues/nieheyong/starflare)](https://github.com/nieheyong/starflare/issues)

[English README.md](README.md)

Starflare 是一款简洁高效的 Web 应用程序，可帮助您轻松管理您的 GitHub 星标仓库。🌟 轻松组织、搜索和发现您已加星标的仓库。立即前往 [starflare.app](https://starflare.app) 体验吧！

> ⚠️ **关于数据持久性的重要提示：** Starflare 目前将数据存储在浏览器的本地存储中。这意味着清除浏览器数据或使用不同的浏览器/设备将导致数据丢失。为了确保数据的持久性，我们强烈建议您定期导出数据作为备份。

## 预览 📸

![深色主题](./src/assets/img/dark.png)
![浅色主题](./src/assets/img/light.png)

[演示视频 🎥](https://github.com/nieheyong/starflare/assets/9368693/81e3a5d3-6c2c-4b87-9897-22fe9c02ca7b)

## 功能 🚀

*   🏷️ **创建和管理标签：** 使用自定义标签组织您已加星标的仓库。
*   🏷️ **为仓库添加标签：** 轻松地为您已加星标的仓库分配标签，以便快速分类。
*   🔍 **即时搜索：** 快速找到您要查找的仓库。
*   📱 **可安装的 PWA：** 将 Starflare 安装为渐进式 Web 应用程序 (PWA)，获得类似原生应用的体验。
*   ☁️ **部署到 Cloudflare：** 在 Cloudflare Pages 上轻松托管您自己的 Starflare 实例。
*   🌙 **支持深色模式：** 在弱光环境下享受舒适的浏览体验。
*   ☀️ **支持浅色模式：** 当您喜欢时，可以切换到明亮而充满活力的界面。

## 在 Cloudflare Pages 上部署 ⚙️

Starflare 可以轻松部署到 Cloudflare Pages。请按照以下步骤操作：

1. **派生 (Fork) 仓库：** 将此仓库派生到您自己的 GitHub 帐户。

2. **创建 GitHub OAuth 应用程序：**
    *   前往您的 GitHub 开发者设置：[https://github.com/settings/developers](https://github.com/settings/developers)
    *   点击 "New OAuth App"。
    *   填写以下详细信息（将占位符替换为您自己的信息）：
        *   **Application name:** `Starflare`（或您选择的名称）
        *   **Homepage URL:** `您的自定义域名`
        *   **Authorization callback URL:** `您的自定义域名/#/login`
    *   点击 "Register application"。
    *   复制 **Client ID** 并生成一个新的 **Client Secret**。您在下一步中将需要这些信息。

3. **部署到 Cloudflare Pages：**
    *   前往您的 Cloudflare 仪表板并选择 "Workers & Pages"。
    *   点击 "Create application"。
    *   选择 "Pages" 并连接您派生的 Starflare 仓库。
    *   **重要提示：** 在 "Build settings" 中
      *   **Framework preset:** `Vue`
      *   **Build command:**  `npm run build`
      *   **Build output directory:** `/dist`

4. **环境变量：**
    *   在您项目的 Cloudflare Pages 仪表板中，前往 "Settings" -> "Environment Variables"。
    *   添加以下环境变量（将占位符替换为您的实际值）：

        | 变量名          | 值                                       |
        | :--------------- | :--------------------------------------- |
        | `CLIENT_ID`      | 您的 GitHub OAuth 应用程序的 Client ID    |
        | `CLIENT_SECRET` | 您的 GitHub OAuth 应用程序的 Client Secret |
        | `NODE_VERSION`  | `16.20.0`                               |
        | `YARN_VERSION`  | `1.22.19`                               |

5. **配置 `.env`：**
    *   在您派生的仓库中，编辑文件 `main/.env`。
    *   使用您的 GitHub OAuth 应用程序的凭证更新 `VUE_APP_CLIENT_ID` 的值。

6. **部署并享受！**
    *   提交并将更改推送到您派生的仓库。Cloudflare Pages 将自动构建和部署您的 Starflare 实例。

## 类似项目 🤝

以下是一些提供类似功能的其他项目：

*   [Gitstars](https://github.com/cfour-hi/gitstars)
*   [Astral](https://github.com/astralapp/astral)
*   [GitHub Stars Manager](https://github.com/raythunder/github-stars-manager)

## 贡献 👥

欢迎贡献！如果您有任何想法、错误修复或功能请求，请随时提出议题 (issue) 或提交拉取请求 (pull request)。
