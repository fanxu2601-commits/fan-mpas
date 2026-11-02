# XU Fan · Academic homepage

独立静态科研主页，英文为主，支持中文切换、个人照片、交互地球及科研地点详情。所有运行所需脚本、样式和地图均随站点保存，不依赖 ChatGPT 登录或内容接口。

## 发布到 GitHub Pages

1. 在自己的 GitHub 账号下创建公开仓库 `fan-mpas`，默认分支为 `main`。
2. 将此文件夹的内容上传到仓库根目录，包括 `.github/workflows/pages.yml`。不要上传压缩包本身，也不要额外套一层文件夹。
3. 仓库 Settings → Pages → Source 选择 **GitHub Actions**。
4. Actions → Publish academic homepage → Run workflow。也可通过提交一次修改触发发布。
5. 工作流成功后，在 Settings → Pages 查看真实公开网址。通常形式为 `https://你的用户名.github.io/fan-mpas/`。

## 修改文字后自动发布

在 GitHub 打开 `content.json`，点击铅笔按钮，修改文字并 Commit changes。工作流会生成完整 HTML 并发布，不必手动重新上传所有文件。更新需要构建时间，通常数分钟，可能长达 10 分钟；并非每敲一个字就立即公开。

- `profile.intro.en` / `.zh`：首页研究简介。
- `profile.bio` / `bioDetail`：详细简介。
- `profile.research`：研究方向。
- `profile.publications`：论文。
- `profile.experience`：学术经历。
- `profile.activities`：教学和会议。
- `profile.email`：邮箱。
- `places`：地球科研地点，坐标格式为 `[经度, 纬度]`，双语字段为 `[英文, 中文]`。
- 照片：`fan-xu.jpg`。

JSON 必须保留英文双引号和逗号；提交前可在本地运行 `node build.mjs` 检查。不要手工编辑生成的 `index.html` 或 `profile.js`，否则下次构建会覆盖。

## 本地预览与通用静态托管

安装 Node.js 22 或更新版本，在本目录运行 `node build.mjs`，然后 `python -m http.server 8080 --directory _site`，访问 `http://localhost:8080`。无需安装 npm 依赖。

`_site/` 是可以直接部署到任何静态托管平台的完整站点。路径均为相对路径，支持 GitHub Pages 项目子目录。主要文字已直接写入 HTML，即使 JavaScript 不可用也能阅读简介、论文与经历；地球和语言切换需要 JavaScript。

## 原编辑后台

原站点及后台仍保留在 https://fan-mpas.maple-wasp-5895.chatgpt.site/admin 。此版本以迁移时的公开内容为快照，原后台的保存不会自动改动 GitHub 仓库。迁移后的常规修改以 `content.json` 为准。

GitHub Pages 不能运行原站点的服务端登录与数据库。本仓库不包含账号密钥、数据库或原始 CV 中的私人信息。现有照片和学术邮箱属于用户已要求公开的主页内容。

## 资源

海岸线来自 Natural Earth（public domain）；D3 的许可证保存在 `D3-LICENSE.txt`。版式参考 Chistrong Wen 的学术主页，所有个人资料和科研内容为 XU Fan 的资料。

GitHub Pages 官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
