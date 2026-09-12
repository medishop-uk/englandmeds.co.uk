/* Shared image placements; resolve from this asset for local and deployed paths. */
(() => {
  'use strict';
  const base = new URL('../img/', document.currentScript.src);
  const medicine = {
    'diazepam-martin-dow-10mg-elm': 'valium.jpg',
    'noctin-nitrazepam-5-mg-elm': 'noctin.jpg',
    'rivotril-clonazepam-2mg-elm': 'rivotril-2.jpg',
    'sedil-5-mg-diazepam-elm': 'sedil.jpg',
    'zopiclone-price-in-england-uk': 'zopiclone-tablets.jpg'
  };
  const posts = {
    'englandmeds': 'englandmeds-blog-image-1jpg.jpg',
    'buy-medication-without-prescription-in-the-united-kingdom-englandmeds': 'englandmeds-blog-image-2jpg.jpg',
    'generalised-anxiety-disorder-vs-panic-disorder': 'england-anxietyjpg.jpg',
    'guide-for-safe-prescription-medicines-england-meds': 'guide-for-safe-prescription-medicines-online.jpg',
    'how-to-safely-order-prescription-medicines-online-in-the-uk-elm': 'how-to-safely-purchase-prescription-medicines-online-in-uk-complete-guide.jpg',
    'how-to-stop-a-panic-attack-fast': 'england-panic-attack-2jpg.jpg',
    'neuropathy-or-nerve-pain-causes-symptoms-treatment-options': 'england-neuropathyjpg.jpg',
    'nhs-gphc-law-for-online-pharmacy-uk': 'englandmeds-blog-image-1jpg.jpg',
    'panic-attack-symptoms-causes-what-to-do': 'england-panic-attackjpg.jpg'
  };
  const services = {
    'best-online-drugstore-in-england': 'reliable-online-dispensary-in-england.webp',
    'safe-online-pharmacy-in-workington-englandmeds-uk': 'safe-online-pharmacy-in-workington.webp'
  };
  const slug = path => decodeURIComponent(path).split('/').filter(Boolean).pop()?.replace(/\.html$/i, '');
  function photo(path, alt, eager = false) {
    const img = document.createElement('img');
    img.src = new URL(path, base).href;
    img.alt = alt;
    img.loading = eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    return img;
  }
  function medicineCards() {
    document.querySelectorAll('.medicine-card, .category-product-card, .shop-card').forEach(card => {
      const link = card.querySelector('a[href*="medicine/"]');
      const file = link && medicine[slug(new URL(link.href).pathname)];
      const frame = card.querySelector('.medicine-image-link, .category-product-art, .card-art');
      if (!file || !frame || frame.dataset.photo) return;
      frame.dataset.photo = 'true';
      frame.classList.add('medicine-photo');
      frame.replaceChildren(photo('medicine/' + file, card.querySelector('h2,h3')?.textContent.trim() || 'Medicine packaging'));
    });
  }
  function init() {
    medicineCards();
    const current = slug(location.pathname);
    const product = document.querySelector('.product-main-image');
    if (product && medicine[current]) {
      product.classList.add('medicine-photo');
      product.replaceChildren(photo('medicine/' + medicine[current], document.querySelector('h1').textContent.trim(), true));
    }
    document.querySelectorAll('.content-card').forEach(card => {
      const link = card.querySelector('a[href*="post/"]');
      const file = link && posts[slug(new URL(link.href).pathname)];
      const frame = card.querySelector('.card-art');
      if (!file || !frame) return;
      frame.classList.add('editorial-photo');
      frame.replaceChildren(photo('blog/post/' + file, card.querySelector('h2').textContent.trim()));
    });
    const article = document.querySelector('.article-content');
    const isPost = location.pathname.includes('/blog/post/');
    const file = isPost ? posts[current] : services[current];
    if (article && file) {
      const figure = document.createElement('figure');
      figure.className = 'article-photo';
      figure.append(photo((isPost ? 'blog/post/' : 'service/') + file, document.querySelector('h1').textContent.trim(), true));
      article.prepend(figure);
    }
    if (location.pathname.includes('/blog/')) {
      const hero = document.querySelector('.page-hero');
      if (hero) {
        hero.classList.add('blog-photo-hero');
        hero.style.backgroundImage = 'linear-gradient(90deg,rgba(247,251,253,.97),rgba(247,251,253,.87)),url("' + new URL('blog/blog-breadcrumb-' + (isPost ? '2' : '1') + '.webp', base).href + '")';
      }
    }
    const grid = document.querySelector('#medicine-grid') || document.querySelector('.medicine-card')?.parentElement;
    if (grid) new MutationObserver(medicineCards).observe(grid, {childList: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
