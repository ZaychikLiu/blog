/* global hexo */

function getRoot(config) {
  const root = config.root || '/';
  return root.endsWith('/') ? root : `${root}/`;
}

function assetUrl(config, path) {
  const root = getRoot(config);
  return `${root}${path.replace(/^\/+/, '')}`;
}

function versionedAssetUrl(config, path) {
  const advanced = config.advanced || {};
  const version = advanced.asset_version;
  const url = assetUrl(config, path);
  return version ? `${url}?v=${encodeURIComponent(version)}` : url;
}

function safeJson(value) {
  return JSON.stringify(value || {})
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function analyticsHead(config) {
  const advanced = config.advanced || {};
  const analytics = advanced.analytics || {};
  const chunks = [];

  if (analytics.google_analytics && analytics.google_analytics.measurement_id) {
    const id = analytics.google_analytics.measurement_id;
    chunks.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`);
    chunks.push(`<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');
</script>`);
  }

  if (analytics.plausible && analytics.plausible.domain) {
    const scriptUrl = analytics.plausible.script_url || 'https://plausible.io/js/script.js';
    chunks.push(`<script defer data-domain="${analytics.plausible.domain}" src="${scriptUrl}"></script>`);
  }

  return chunks.join('\n');
}

hexo.extend.injector.register('head_end', function () {
  const config = hexo.config;
  const advanced = config.advanced || {};
  const tags = [
    `<link rel="stylesheet" href="${versionedAssetUrl(config, 'css/advanced-blog.css')}">`
  ];

  if (advanced.analytics) {
    tags.push(analyticsHead(config));
  }

  return tags.filter(Boolean).join('\n');
}, 'default');

hexo.extend.injector.register('body_end', function () {
  const config = hexo.config;
  const advanced = Object.assign({}, config.advanced || {});
  advanced.root = getRoot(config);

  return `<script>window.BLOG_ADVANCED=${safeJson(advanced)};</script>
<script src="${versionedAssetUrl(config, 'js/advanced-blog.js')}" defer></script>`;
}, 'default');
