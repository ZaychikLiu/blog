# 内容填充和发布指南

这个模板复刻的是 `https://ppwwyyxx.com/blog/` 这一类独立博客部分：Hexo 生成静态页面，Icarus 负责文章列表、侧栏、标签、归档、RSS 和代码高亮。

## 1. 第一次本地运行

进入仓库目录：

```bash
cd hexo-icarus-blog-template
npm install
npm run dev
```

浏览器打开：

```text
http://localhost:4000/blog/
```

如果你把站点部署在 GitHub Pages 的 `blog` 仓库里，最终地址通常是：

```text
https://zaychikliu.github.io/blog/
```

## 2. 改站点基本信息

主要改两个文件。

`_config.yml` 是 Hexo 的站点配置：

```yaml
title: Zaychik's Blog
description: Notes on research, engineering, and everyday learning.
author: Zaychik Liu
url: https://zaychikliu.github.io/blog
root: /blog/
```

`_config.icarus.yml` 是 Icarus 主题配置：

```yaml
logo:
  text: "Zaychik's Blog"

widgets:
  - position: left
    type: profile
    author: Zaychik Liu
    avatar: /img/avatar.svg
    follow_link: https://github.com/ZaychikLiu
    social_links:
      Xiaohongshu:
        icon: fas fa-book-open
        url: https://www.xiaohongshu.com/user/profile/your-xiaohongshu-id
```

常改项：

- 博客标题：`_config.yml` 的 `title`，以及 `_config.icarus.yml` 的 `logo.text`
- 作者名：两个文件里的 `author`
- GitHub 链接：`_config.icarus.yml` 里的 `github.com/ZaychikLiu`
- 小红书链接：把 `_config.icarus.yml` 和 `_config.yml` 里的 `your-xiaohongshu-id` 替换成你的小红书主页 ID 或完整主页 URL
- 头像：替换 `source/img/avatar.svg`，或者把 `avatar` 改成一张外链图片
- 页脚年份和名字：`_config.icarus.yml` 的 `footer.copyright`

## 3. `/blog/` 路径怎么改

默认配置适合仓库名叫 `blog`，站点在：

```text
https://zaychikliu.github.io/blog/
```

如果你用 `ZaychikLiu.github.io` 这个用户主页仓库，想让博客在根路径：

```yaml
url: https://zaychikliu.github.io
root: /
```

如果你用自定义域名，比如：

```text
https://example.com/blog/
```

则写：

```yaml
url: https://example.com/blog
root: /blog/
```

如果你用自定义域名根路径：

```yaml
url: https://example.com
root: /
```

## 4. 写一篇新文章

推荐用命令生成：

```bash
npm run new "My First Post"
```

Hexo 会在 `source/_posts/` 下创建 Markdown 文件。

一篇文章的开头叫 front matter：

```markdown
---
title: My First Post
date: 2026-06-10 20:00:00
tags:
  - Python
  - Research
categories:
  - Notes
---

首页摘要写在这里。

<!-- more -->

正文从这里开始。
```

`<!-- more -->` 很重要：它前面的内容会显示在首页文章列表里，后面的内容只在点进文章后显示。

## 5. 标签和归档

你不用手工维护 Tags 和 Archives 页面。文章里写：

```yaml
tags:
  - Deep Learning
  - PyTorch
categories:
  - Research
```

Hexo 会自动生成：

- `/blog/tags/`
- `/blog/archives/`
- `/blog/categories/`

当前导航只放了 Archives、Tags、About Me。想把 Categories 加到导航，改 `_config.icarus.yml`：

```yaml
navbar:
  menu:
    Archives: /archives
    Categories: /categories
    Tags: /tags
    About Me: /about
```

## 6. 侧栏怎么改

侧栏在 `_config.icarus.yml` 的 `widgets`。

当前顺序是：

```yaml
widgets:
  - type: profile
  - type: recent_posts
  - type: tags
  - type: archives
```

ppwwyyxx 的博客里有一个 `Popular Posts`，那应该是自定义过的 Icarus widget。官方 Icarus 默认提供的是 `recent_posts`。如果你只是想有类似推荐入口，可以先用 `recent_posts`；如果之后要做完全一样的 `Popular Posts`，需要 fork Icarus 主题并加一个自定义 widget。

## 7. About Me 页面

编辑：

```text
source/about/index.md
```

这里适合放：

- 你的简介
- 研究方向
- 当前项目
- GitHub / Google Scholar / LinkedIn / 邮箱
- 代表论文或项目

## 8. 图片和附件

这个模板启用了：

```yaml
post_asset_folder: true
```

如果文章文件是：

```text
source/_posts/my-post.md
```

你可以新建同名目录：

```text
source/_posts/my-post/
```

然后放图片：

```text
source/_posts/my-post/figure1.png
```

文章里引用：

```markdown
![figure](figure1.png)
```

## 9. 数学公式

Icarus 配置里已经启用了 MathJax：

```yaml
plugins:
  mathjax: true
```

写法：

```markdown
Inline: $E = mc^2$

Block:

$$
\sum_i x_i
$$
```

## 10. 发布到 GitHub Pages

推荐仓库名：

```text
blog
```

也就是：

```text
ZaychikLiu/blog
```

步骤：

1. 在 GitHub 上创建一个空仓库 `blog`
2. 把这个模板推上去
3. 打开仓库 Settings -> Pages
4. Source 选择 `GitHub Actions`
5. push 到 `main` 后，Actions 会自动发布

本地推送命令：

```bash
git init
git add .
git commit -m "Initialize Hexo Icarus blog"
git branch -M main
git remote add origin git@github.com:ZaychikLiu/blog.git
git push -u origin main
```

如果你用 HTTPS remote：

```bash
git remote add origin https://github.com/ZaychikLiu/blog.git
```

## 11. 常用命令

```bash
npm run dev
```

本地预览。

```bash
npm run build
```

生成静态站点到 `public/`。

```bash
npm run clean
```

清理生成缓存。

```bash
npm run new "Post Title"
```

创建新文章。

## 12. 最容易忘的三件事

改部署路径时，`url` 和 `root` 要一起改。

文章首页摘要靠 `<!-- more -->` 控制。

GitHub Pages 要在 Settings -> Pages 里选择 `GitHub Actions`，否则 workflow 构建完也不会接管发布。

## 13. 高级功能总开关

高级功能都在 `_config.yml` 的 `advanced:` 下面：

```yaml
advanced:
  reading_progress: true
  heading_anchors: true
  share:
    enabled: true
  popular_posts:
    enabled: true
  toc:
    enabled: true
  comments:
    enabled: true
    provider: utterances
  analytics:
    google_analytics:
      measurement_id:
    plausible:
      domain:
```

实现代码在：

```text
scripts/advanced-features.js
source/js/advanced-blog.js
source/css/advanced-blog.css
```

一般只改 `_config.yml`，不用改 JS。

## 14. Popular Posts 推荐文章

ppwwyyxx 的博客侧栏里有 `Popular Posts`。这个模板已经做了手工推荐版：

```yaml
advanced:
  popular_posts:
    enabled: true
    title: Popular Posts
    posts:
      - title: Hello Hexo Icarus
        url: /2026/hello-hexo-icarus/
      - title: Research Note Template
        url: /2026/research-note-template/
```

每发一篇你想长期推荐的文章，就把文章标题和路径加到这里。

路径规则来自 `_config.yml`：

```yaml
permalink: :year/:title/
```

例如文章文件：

```text
source/_posts/my-good-post.md
```

生成路径通常是：

```text
/2026/my-good-post/
```

## 15. 文章目录 TOC

文章页会自动扫描 `h2` / `h3` 标题，在侧栏生成目录：

```yaml
advanced:
  toc:
    enabled: true
    title: Contents
    min_headings: 1
```

默认只要文章里有 h2/h3 标题，目录就会显示在文章侧栏。

## 16. 评论系统

模板默认启用 Utterances 评论区，读者可以用 GitHub 账号在文章底部留言。上线后需要安装 Utterances GitHub App，并确认仓库 Issues 已开启。

### Utterances

Utterances 基于 GitHub Issues，配置更少。

准备步骤：

1. 安装 <https://github.com/apps/utterances>
2. 允许它访问你的博客仓库
3. 打开仓库 Settings -> Features，确认 Issues 已开启
4. 部署后点进任意文章底部，确认评论框出现

当前默认配置：

```yaml
advanced:
  comments:
    enabled: true
    provider: utterances
    utterances_repo: ZaychikLiu/blog
    utterances_issue_term: pathname
    utterances_theme: github-light
```

如果你更喜欢 GitHub Discussions 风格，也可以改用 Giscus：

```yaml
advanced:
  comments:
    enabled: true
    provider: giscus
    repo: ZaychikLiu/blog
    repo_id: 这里填 data-repo-id
    category: General
    category_id: 这里填 data-category-id
    mapping: pathname
    theme: light
    lang: en
```

只选一种评论系统，不要两个都开。

## 17. 统计

### Google Analytics 4

在 Google Analytics 创建 Web 数据流，拿到 Measurement ID，例如：

```text
G-XXXXXXXXXX
```

填到：

```yaml
advanced:
  analytics:
    google_analytics:
      measurement_id: G-XXXXXXXXXX
```

### Plausible

如果你用 Plausible：

```yaml
advanced:
  analytics:
    plausible:
      domain: zaychikliu.github.io
      script_url: https://plausible.io/js/script.js
```

如果你的博客在 `/blog/` 子路径，`domain` 仍然通常写域名本身，不带路径。

## 18. 分享按钮

文章页正文下方会显示分享按钮：

```yaml
advanced:
  share:
    enabled: true
    xiaohongshu_profile: https://www.xiaohongshu.com/user/profile/your-xiaohongshu-id
    xiaohongshu_text: "{title}\n{url}"
    platforms:
      - x
      - linkedin
      - email
      - xiaohongshu
      - copy
```

小红书没有统一的网页分享接口，这里的 `xiaohongshu` 按钮会复制“文章标题 + 链接”的发布文案，方便粘贴到小红书。`xiaohongshu_profile` 同时用于记录你的小红书主页地址。不想要哪个平台就删掉哪一行。

## 19. SEO 文件

模板已经加了：

```yaml
sitemap:
  path: sitemap.xml

robotstxt:
  useragent: "*"
  allow:
    - /
  sitemap: https://zaychikliu.github.io/blog/sitemap.xml
```

部署后你应该能访问：

```text
https://zaychikliu.github.io/blog/sitemap.xml
https://zaychikliu.github.io/blog/robots.txt
```

如果换域名，记得改 `robotstxt.sitemap`。

## 20. 编辑链接

如果你想在文章页底部显示 “Edit this page”：

```yaml
advanced:
  edit_link:
    enabled: true
    label: Edit this page
    repository: https://github.com/ZaychikLiu/blog
    branch: main
```

这个功能假设文章文件名和 URL slug 一致。例如：

```text
source/_posts/hello-hexo-icarus.md
```

对应：

```text
/2026/hello-hexo-icarus/
```
