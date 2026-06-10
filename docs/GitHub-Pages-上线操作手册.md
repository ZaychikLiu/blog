# GitHub 推送与网页上线操作手册

把本地 Hexo + Icarus 博客推送到 GitHub，并用 GitHub Pages 发布成别人能访问的网页

适用目录：`/Users/zaychik/Desktop/博客/hexo-icarus-blog-template`

## 1. 你最终会得到什么

完成后，你的博客源码会在 GitHub 仓库里，GitHub Actions 会自动构建 Hexo 静态站点，GitHub Pages 会把生成的 public 目录发布成网页。

- 源码仓库：ZaychikLiu/blog
- 默认网页地址：https://zaychikliu.github.io/blog/
- 每次修改文章后，只需要 git add、commit、push，GitHub 会自动重新部署。

> 当前模板已经把 GitHub Actions、/blog/ 子路径、sitemap、robots.txt 都配置好了。你只需要创建仓库并推送。

## 2. 准备工作检查

打开终端，进入博客模板目录：

```bash
cd /Users/zaychik/Desktop/博客/hexo-icarus-blog-template
```

检查本地仓库状态和远程地址：

```bash
git status
git remote -v
```

| 项目 | 说明 |
| --- | --- |
| git status | working tree clean |
| origin | git@github.com:ZaychikLiu/blog.git |
| 分支 | main |

如果 remote 不对，可以重设：

```bash
git remote set-url origin git@github.com:ZaychikLiu/blog.git
```

## 3. 在 GitHub 创建空仓库

1. 打开 https://github.com/new
2. Repository name 填 blog。
3. Owner 选择 ZaychikLiu。
4. Visibility 建议选 Public，这样别人能访问 Pages。
5. 不要勾选 Add a README file、.gitignore、license，因为本地仓库已经有内容。
6. 点击 Create repository。

> 如果你想用根域名 zaychikliu.github.io，而不是 /blog/ 子路径，仓库名要叫 ZaychikLiu.github.io，同时需要把 _config.yml 的 url/root 改掉。当前手册按 blog 仓库说明。

## 4. 把本地代码推送到 GitHub

创建仓库后，在本地执行：

```bash
cd /Users/zaychik/Desktop/博客/hexo-icarus-blog-template
git push -u origin main
```

如果推送成功，你会在 GitHub 的 ZaychikLiu/blog 仓库里看到这些文件：

- _config.yml
- _config.icarus.yml
- source/_posts/
- .github/workflows/pages.yml
- docs/

### 如果 SSH 推送失败

如果看到 Permission denied (publickey)，说明本机 SSH key 没有连上 GitHub。可以改用 HTTPS：

```bash
git remote set-url origin https://github.com/ZaychikLiu/blog.git
git push -u origin main
```

也可以重新登录 GitHub CLI：

```bash
gh auth login -h github.com
```

## 5. 开启 GitHub Pages

1. 打开 GitHub 仓库 ZaychikLiu/blog。
2. 进入 Settings。
3. 左侧点击 Pages。
4. Build and deployment 的 Source 选择 GitHub Actions。
5. 回到仓库的 Actions 页面，查看 Deploy Hexo Blog workflow 是否运行。
6. 第一次部署通常需要 1 到 3 分钟。

> 这个模板已经有 .github/workflows/pages.yml，所以不需要手动选择 branch 和 docs 目录。请选择 GitHub Actions。

## 6. 确认网页可访问

Actions 变成绿色以后，打开：

```bash
https://zaychikliu.github.io/blog/
```

还可以检查这些地址：

```bash
https://zaychikliu.github.io/blog/archives/
https://zaychikliu.github.io/blog/tags/
https://zaychikliu.github.io/blog/atom.xml
https://zaychikliu.github.io/blog/sitemap.xml
```

- 如果主页 404，先等 1 到 3 分钟再刷新。
- 如果仍然 404，检查 Settings -> Pages 是否选择 GitHub Actions。
- 如果 CSS 丢失，检查 _config.yml 里的 url/root 是否和仓库路径一致。

## 7. 以后如何更新文章

每次新增或修改文章后，在本地执行：

```bash
cd /Users/zaychik/Desktop/博客/hexo-icarus-blog-template
npm run build
git status
git add .
git commit -m "Update blog content"
git push
```

push 后 GitHub Actions 会自动重新部署，通常几分钟内线上网页就会更新。

> public/、node_modules/、db.json 已经被 .gitignore 排除，不会被提交。

## 8. 常见问题速查

| 项目 | 说明 |
| --- | --- |
| git push 要求登录 | 使用 HTTPS remote，或运行 gh auth login。 |
| Permission denied publickey | 配置 GitHub SSH key，或切换 HTTPS remote。 |
| Pages 没更新 | 检查 Actions 是否失败；失败时点进日志看 npm/build 错误。 |
| 网页样式错乱 | 检查 _config.yml 的 root 是否是 /blog/。 |
| 别人看不到网页 | 仓库需要 Public，或确认 Pages 地址是否正确。 |
