(function () {
  const cfg = window.BLOG_ADVANCED || {};
  const root = cfg.root || '/';

  function withRoot(url) {
    if (!url) return '#';
    if (/^(https?:)?\/\//.test(url) || url.startsWith('mailto:')) return url;
    return `${root.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  }

  function singleArticle() {
    const main = document.querySelector('.column-main');
    if (!main) return null;
    const articles = main.querySelectorAll('article.article');
    const title = main.querySelector('article.article h1.title');
    return articles.length === 1 && title ? main : null;
  }

  function addReadingProgress() {
    if (!cfg.reading_progress || document.getElementById('reading-progress')) return;
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.appendChild(bar);

    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    };

    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function addHeadingAnchors() {
    if (!cfg.heading_anchors) return;
    document.querySelectorAll('.content h2[id], .content h3[id]').forEach((heading) => {
      if (heading.querySelector('.advanced-heading-anchor')) return;
      const anchor = document.createElement('a');
      anchor.className = 'advanced-heading-anchor';
      anchor.href = `#${heading.id}`;
      anchor.setAttribute('aria-label', 'Copy section link');
      anchor.textContent = '#';
      heading.appendChild(anchor);
    });
  }

  function addPopularPosts() {
    const popular = cfg.popular_posts || {};
    if (!popular.enabled || !Array.isArray(popular.posts) || !popular.posts.length) return;
    if (document.querySelector('[data-advanced-popular]')) return;

    const sidebar = document.querySelector('.column-left') || document.querySelector('.column-right');
    if (!sidebar) return;

    const card = document.createElement('div');
    card.className = 'card widget';
    card.dataset.advancedPopular = 'true';
    card.innerHTML = `
      <div class="card-content">
        <h3 class="menu-label">${popular.title || 'Popular Posts'}</h3>
        <ul class="advanced-popular-list"></ul>
      </div>`;

    const list = card.querySelector('ul');
    popular.posts.forEach((post) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = withRoot(post.url);
      a.textContent = post.title;
      li.appendChild(a);
      list.appendChild(li);
    });

    const profile = sidebar.querySelector('.widget[data-type="profile"], .card.widget');
    if (profile && profile.nextSibling) {
      sidebar.insertBefore(card, profile.nextSibling);
    } else {
      sidebar.appendChild(card);
    }
  }

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  function setTemporaryLabel(button, text, resetText) {
    const span = button.querySelector('span');
    if (!span) return;
    span.textContent = text;
    setTimeout(() => { span.textContent = resetText; }, 1400);
  }

  function shareUrl(platform, title, url) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    switch (platform) {
      case 'x':
        return `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
      case 'email':
        return `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
      default:
        return url;
    }
  }

  function addShareButtons() {
    const share = cfg.share || {};
    const main = singleArticle();
    if (!share.enabled || !main || main.querySelector('.advanced-share')) return;

    const content = main.querySelector('article.article .content');
    if (!content) return;

    const platforms = share.platforms || ['x', 'email', 'xiaohongshu', 'copy'];
    const title = document.querySelector('article.article h1.title')?.textContent?.trim() || document.title;
    const url = window.location.href.split('#')[0];

    const bar = document.createElement('div');
    bar.className = 'advanced-share';

    platforms.forEach((platform) => {
      if (platform === 'copy') {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = '<i class="fas fa-link"></i><span>Copy link</span>';
        button.addEventListener('click', async () => {
          await copyText(url);
          setTemporaryLabel(button, 'Copied', 'Copy link');
        });
        bar.appendChild(button);
        return;
      }

      if (platform === 'xiaohongshu') {
        const a = document.createElement('a');
        a.href = share.xiaohongshu_profile || url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.title = 'Open Xiaohongshu profile';
        a.innerHTML = '<i class="xhs-icon"></i><span>Xiaohongshu</span>';
        bar.appendChild(a);
        return;
      }

      const a = document.createElement('a');
      a.href = shareUrl(platform, title, url);
      a.target = platform === 'email' ? '_self' : '_blank';
      a.rel = 'noopener';
      const icon = platform === 'x' ? 'x-icon' : 'fas fa-envelope';
      const label = platform === 'x' ? 'X' : 'Email';
      a.innerHTML = `<i class="${icon}"></i><span>${label}</span>`;
      bar.appendChild(a);
    });

    content.insertAdjacentElement('afterend', bar);
  }

  function addToc() {
    const toc = cfg.toc || {};
    const main = singleArticle();
    if (!toc.enabled || !main || document.querySelector('[data-advanced-toc]')) return;

    const headings = Array.from(main.querySelectorAll('.content h2[id], .content h3[id]'));
    if (headings.length < (toc.min_headings || 3)) return;

    const sidebar = document.querySelector('.column-left') || document.querySelector('.column-right');
    if (!sidebar) return;

    const card = document.createElement('div');
    card.className = 'card widget';
    card.dataset.advancedToc = 'true';
    card.innerHTML = `
      <div class="card-content">
        <h3 class="menu-label">${toc.title || 'Contents'}</h3>
        <ul class="advanced-toc-list"></ul>
      </div>`;

    const list = card.querySelector('ul');
    headings.forEach((heading) => {
      const li = document.createElement('li');
      li.className = heading.tagName === 'H3' ? 'depth-3' : 'depth-2';
      const a = document.createElement('a');
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent.replace(/#$/, '').trim();
      li.appendChild(a);
      list.appendChild(li);
    });

    const profile = sidebar.querySelector('.widget[data-type="profile"], .card.widget');
    if (profile && profile.nextSibling) {
      sidebar.insertBefore(card, profile.nextSibling);
    } else {
      sidebar.appendChild(card);
    }
  }

  function addComments() {
    const comments = cfg.comments || {};
    const main = singleArticle();
    if (!comments.enabled || !main || document.querySelector('.advanced-comments-card')) return;

    const card = document.createElement('div');
    card.className = 'card advanced-comments-card';
    card.id = 'comments';
    card.innerHTML = '<div class="card-content"><h3 class="title is-5">Comments</h3><div class="advanced-comments-hint">Comments are powered by GitHub Issues or Discussions. Install the corresponding GitHub App after deployment to let readers leave comments.</div><div class="advanced-comments-target"></div></div>';
    main.appendChild(card);
    const target = card.querySelector('.advanced-comments-target');

    if (comments.provider === 'utterances') {
      const script = document.createElement('script');
      script.src = 'https://utteranc.es/client.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('repo', comments.utterances_repo || comments.repo || '');
      script.setAttribute('issue-term', comments.utterances_issue_term || 'pathname');
      script.setAttribute('theme', comments.utterances_theme || 'github-light');
      target.appendChild(script);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', comments.repo || '');
    script.setAttribute('data-repo-id', comments.repo_id || '');
    script.setAttribute('data-category', comments.category || 'General');
    script.setAttribute('data-category-id', comments.category_id || '');
    script.setAttribute('data-mapping', comments.mapping || 'pathname');
    script.setAttribute('data-strict', comments.strict || '0');
    script.setAttribute('data-reactions-enabled', comments.reactions_enabled || '1');
    script.setAttribute('data-emit-metadata', comments.emit_metadata || '0');
    script.setAttribute('data-input-position', comments.input_position || 'bottom');
    script.setAttribute('data-theme', comments.theme || 'light');
    script.setAttribute('data-lang', comments.lang || 'en');
    target.appendChild(script);
  }

  function addLanguageSwitchers() {
    const posts = Array.from(document.querySelectorAll('[data-bilingual-post]'));
    posts.forEach((post) => {
      const buttons = Array.from(post.querySelectorAll('[data-lang-button]'));
      const contents = Array.from(post.querySelectorAll('[data-lang-content]'));
      if (!buttons.length || !contents.length) return;

      const article = post.closest('article.article');
      const articleTitle = article?.querySelector('h1.title');
      const excerptIntro = article?.querySelector('.post-excerpt-intro');
      if (articleTitle && excerptIntro) excerptIntro.hidden = true;

      function titleFor(lang) {
        return lang === 'en' ? post.dataset.titleEn : post.dataset.titleZh;
      }

      function setLanguage(lang) {
        contents.forEach((content) => {
          content.hidden = content.dataset.langContent !== lang;
        });
        buttons.forEach((button) => {
          const isActive = button.dataset.langButton === lang;
          button.classList.toggle('is-active', isActive);
          button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        if (articleTitle && titleFor(lang)) articleTitle.textContent = titleFor(lang);
      }

      buttons.forEach((button) => {
        button.addEventListener('click', () => setLanguage(button.dataset.langButton));
      });
      setLanguage(post.dataset.defaultLang || 'zh');
    });
  }

  function addEditLink() {
    const edit = cfg.edit_link || {};
    const main = singleArticle();
    if (!edit.enabled || !main || !edit.repository || main.querySelector('.advanced-edit-link')) return;

    const pathParts = window.location.pathname.replace(root, '').split('/').filter(Boolean);
    const year = pathParts[0];
    const slug = pathParts[1];
    if (!year || !slug) return;

    const url = `${edit.repository.replace(/\/$/, '')}/edit/${edit.branch || 'main'}/source/_posts/${slug}.md`;
    const link = document.createElement('p');
    link.className = 'advanced-edit-link is-size-7';
    link.innerHTML = `<a href="${url}" target="_blank" rel="noopener"><i class="fab fa-github"></i> ${edit.label || 'Edit this page'}</a>`;
    main.querySelector('article.article')?.appendChild(link);
  }

  function boot() {
    addReadingProgress();
    addHeadingAnchors();
    addPopularPosts();
    addShareButtons();
    addToc();
    addComments();
    addLanguageSwitchers();
    addEditLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
