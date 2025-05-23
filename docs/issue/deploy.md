2025-05-23

好的，非常乐意为你书写这份工程日志，记录我们一起解决这个双站点部署问题的完整过程。

---

**工程日志：Vue 主应用与 VitePress 文档站点的 GitHub Pages 部署历险记**

**项目代号：** AlphaTab-Vue

**日期：** 2025年5月20日 - 2025年5月23日

**工程师：** Gemini 2.5 pro chat, Roo code with deepseek-v3

**目标：** 在同一个代码仓库中，将 Vue 3 主应用和新建的 VitePress 文档站点，通过 GitHub Actions 自动部署到 GitHub Pages。期望的访问路径为：
* 主应用： `https://<用户名>.github.io/alphatab-vue/`
* 文档站点： `https://<用户名>.github.io/alphatab-vue/docs/`

**过程记录：**

**阶段一：初步构想与本地开发环境的挑战 (2025-05-20 - 2025-05-22)**

1.  **需求明确：**
    * 用户已有一个 Vue 3 + Vite 主应用项目，希望为其 `docs` 文件夹下的 Markdown 文档生成一个 VitePress 站点。
    * 核心需求是通过 GitHub Actions 实现自动化部署，将主应用和文档站部署到 GitHub Pages 的指定路径。

2.  **初始方案提出：**
    * **Gemini 建议：**
        * 安装 VitePress 及其依赖。
        * 分别配置主应用 (`vite.config.js`) 和 VitePress (`docs/.vitepress/config.js`) 的 `base` 路径，使其在生产环境中指向正确的子目录（例如，主应用为 `/${REPO_NAME}/`，文档为 `/${REPO_NAME}/docs/`）。
        * 提供一个 GitHub Actions workflow 模板，使用 GitHub 官方的 `actions/configure-pages`, `actions/upload-pages-artifact`, 和 `actions/deploy-pages` 进行部署，该 workflow 会分别构建主应用和文档，然后将构建产物整合到正确的目录结构后上传部署。

3.  **本地开发问题浮现：**
    * **用户反馈：** 主应用和 VitePress 文档站在本地开发时（`npm run dev` 和 `npm run docs:dev`）会运行在不同的端口（例如 `localhost:5173` 和 `localhost:5174`）。这导致在主应用中通过相对路径（如 `/docs/`）跳转到文档站点的链接失效。
    * **Gemini 提出思路：** 这是预期行为，因为它们是独立的开发服务器。
    * **解决方案探索：** 建议在主应用的 `vite.config.js` 中配置 Vite 的开发服务器代理 (`server.proxy`)，将 `/docs` 路径的请求转发给 VitePress 的开发服务器。
        * 例如，主应用（`localhost:5173`）的 `/docs/*` 请求代理到 VitePress（例如 `localhost:5174`），并根据 VitePress 开发时的 `base` 路径（通常为 `/`）进行 `rewrite`。
    * **阶段成果：** 本地开发链接问题通过代理得到解决，注意力转向 CI/CD 部署。

**阶段二：CI 构建失败 - Rollup 原生模块的困境 (2025-05-22 - 2025-05-23)**

1.  **初步部署尝试与失败：**
    * 用户根据建议调整了 GitHub Actions workflow（最初用户使用的是 `peaceiris/actions-gh-pages`，后采纳了 Gemini 推荐的 `actions/deploy-pages` 方案）。
    * **问题出现：** GitHub Actions 在执行 `npm run build`（主应用的构建命令 `vue-tsc -b && vite build`）时失败。
    * **错误日志：** `Error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try \`npm i\` again after removing both package-lock.json and node_modules directory.`

2.  **问题分析与解决思路：**
    * **Gemini 分析：** 这是一个典型的 npm 在处理 Rollup（Vite 的底层打包工具）的可选原生依赖时遇到的问题。CI 环境（Linux）与本地开发环境（可能不同）的差异，以及 `node_modules` 或 `package-lock.json` 的状态不一致，都可能导致这个问题。错误信息本身也指出了 npm 的一个相关 bug。
    * **解决方案迭代：**
        * **尝试 1 (用户根据初步建议修改)：** 在 `npm install` 前执行 `rm -rf node_modules`。
            * **结果：** 同样的 Rollup 错误依旧存在。
        * **Gemini 强烈建议：** 切换到 `npm ci` 进行依赖安装。`npm ci` 专为 CI 环境设计，它会进行纯净安装，严格遵循 `package-lock.json`，通常能更好地处理此类问题。同时建议在 `setup-node` action 中为 `npm ci` 配置 `cache-dependency-path: package-lock.json`。
        * **Gemini 后备建议 (严格遵循错误提示)：** 如果 `npm ci` 不可用或仍失败，则在 CI 中尝试 `rm -rf node_modules && rm -f package-lock.json && npm install`。这直接遵循了错误日志中的建议，但指出在 CI 中删除 `package-lock.json` 并非长久之计，因为它会影响构建的可复现性。
    * **用户采纳的方案：** 用户在其 workflow 中实施了包含 `rm -rf node_modules` 和 `rm -f package-lock.json` 后接 `npm install` 的方案。
    * **阶段成果：** 经过这一轮调整，CI 构建成功通过！Rollup 原生模块问题得到解决。

**阶段三：主应用部署后静态资源 404 - `base` 路径的回归 (2025-05-23)**

1.  **新问题出现：**
    * CI 构建和部署成功后，用户发现主 Vue 应用虽然可以访问，但其引用的静态资源（CSS, JS, SVG 图片）全部返回 404 错误。
    * **用户关键观察：** “之前vue会有一个末尾的路由 `/alphatab-vue/` 后来没了”。这直接指向了主应用的 `base` 路径配置问题。浏览器尝试从 `https://<用户名>.github.io/` 而不是 `https://<用户名>.github.io/alphatab-vue/` 下加载资源。

2.  **问题诊断与解决：**
    * **Gemini 分析：** 这几乎肯定是主应用 `vite.config.js` 中生产环境的 `base` 路径配置不正确。
    * **用户确认：** 用户分享了当前的 `vite.config.js`，显示 `base: process.env.NODE_ENV === 'production' ? '/' : '/'`，即生产环境的 `base` 被硬编码为 `/`。
    * **解决方案：** 指导用户将其 `vite.config.js` 中的 `base` 配置改回之前讨论过的、能够根据 `REPO_NAME` 环境变量动态设置生产环境 `base` 路径的正确版本：
        ```javascript
        base: mode === 'production' && repoName ? `/${repoName}/` : '/',
        ```
    * **阶段成果：** 用户更新 `vite.config.js` 配置后，主应用的静态资源 404 问题解决，主应用在 `https://<用户名>.github.io/alphatab-vue/` 路径下完美加载。

**阶段四：文档站点部署的最终确认 (2025-05-23)**

1.  **目标确认：** 确保 VitePress 文档站点能够正确部署并访问于 `https://<用户名>.github.io/alphatab-vue/docs/`。

2.  **配置审查与验证：**
    * **VitePress `base` 配置 (`docs/.vitepress/config.js`)：**
        * 用户分享了其更新后的配置，其中 `base` 已硬编码为 `'/alphatab-vue/docs/'`。
        * **Gemini 确认：** 此硬编码配置正确且直接，符合预期部署路径。导航和侧边栏链接因基于此 `base`，也将正确解析。
    * **GitHub Actions Workflow 部署结构：**
        * 用户分享了完整的 workflow 文件。
        * **Gemini 确认：**
            * `REPO_NAME` 环境变量设置正确。
            * 依赖安装步骤（尽管是之前的权宜之计）能够成功构建。
            * `Prepare deployment artifact` 步骤中的文件复制逻辑正确：主应用构建产物复制到部署产物的根目录，VitePress 文档构建产物复制到部署产物的 `docs/` 子目录。
            * 后续的 `upload-pages-artifact` 和 `deploy-pages` 步骤标准且正确。

3.  **最终方案确认：** 用户提供的两份配置文件（VitePress config 和 GitHub Actions workflow）在逻辑上完全支持将文档部署到 `/alphatab-vue/docs/`。

**最终成果 (2025-05-23)：**

用户确认所有问题已“完美解决”。主 Vue 应用和 VitePress 文档站点均已成功通过 GitHub Actions 自动部署到 GitHub Pages，并分别在 `https://<用户名>.github.io/alphatab-vue/` 和 `https://<用户名>.github.io/alphatab-vue/docs/` 路径下正确访问。

**项目总结与关键学习点：**

1.  **`base` 路径是王道：** 对于部署到 GitHub Pages (或其他子目录环境) 的单页应用和静态站点生成器，正确配置 `base` 路径是确保资源正确加载的首要条件。主应用和 VitePress 都需要精确设置。
2.  **CI 环境的依赖处理：**
    * `npm ci` 是 CI 环境中安装依赖的首选，能提供更好的一致性和可靠性。
    * 处理像 Rollup 原生模块这样的可选依赖问题时，有时需要更彻底的清理步骤（如错误日志中提示的删除 `node_modules` 和 `package-lock.json`），但这些应被视为特定问题的权宜之计。
3.  **环境变量的传递与使用：** 在 GitHub Actions 中，通过 `env` 上下文设置环境变量 (如 `REPO_NAME`)，并在构建脚本和配置文件 (如 `vite.config.js`) 中正确读取和使用这些变量，对于实现灵活和正确的构建至关重要。
4.  ** methodical troubleshooting (按部就班的故障排除)：** 从本地开发问题，到 CI 构建失败，再到部署后资源加载失败，通过逐步分析日志、提出假设、尝试解决方案并验证结果，最终成功解决了所有问题。
5.  **清晰的部署结构：** 在 GitHub Actions 中，精确控制构建产物的最终存放结构，是确保多部分站点在目标 URL 正确呈现的关键。

这次部署历程充分展示了现代 Web 开发中从本地开发到自动化部署的复杂性和常见挑战，但也证明了通过细致的配置和系统的故障排除，完全可以达成预期的目标。

---