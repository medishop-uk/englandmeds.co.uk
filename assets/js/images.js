/* Shared image placements; resolve from this asset for local and deployed paths. */
(() => {
  'use strict';
  const base = new URL('../img/', document.currentScript.src);
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
  function init() {
    const contacts = document.createElement('nav');
    contacts.className = 'floating-contacts';
    contacts.setAttribute('aria-label', 'Contact EnglandMeds');
    contacts.innerHTML = '<a class="floating-whatsapp" href="https://wa.me/447438135064" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.7 11.7 0 0 0 2.1 17.6L.5 23.5l6-1.6A11.7 11.7 0 0 0 20.5 3.5ZM12 21a9 9 0 0 1-4.6-1.3l-.3-.2-3.5.9.9-3.4-.2-.4A9 9 0 1 1 12 21Zm5-6.7c-.3-.2-1.7-.8-2-.9s-.5-.2-.7.2-.8.9-1 1-.4.2-.7 0a7.5 7.5 0 0 1-3.7-3.2c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.6L8.8 7c-.2-.5-.4-.5-.7-.5h-.6c-.2 0-.6.1-.8.4-2.4 2.6.6 6.3 1 6.8.3.4 3 4.5 7.3 5.1 1 .2 2.3-.4 2.6-1.1.3-.7.3-1.3.2-1.4-.1-.2-.4-.3-.8-.5Z"/></svg></a><a class="floating-telegram" href="https://t.me/BenzoAddy" target="_blank" rel="noopener noreferrer" aria-label="Chat on Telegram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21.5 3-3.4 17c-.3 1.2-1 1.5-2 .9l-5.2-3.9-2.5 2.4c-.3.3-.5.5-1 .5l.4-5.3 9.6-8.7c.4-.4-.1-.6-.6-.3L5 13.1.9 11.8c-1.1-.3-1.1-1.1.2-1.6L20 2.9c.9-.3 1.7.2 1.5 1.1Z"/></svg></a>';
    document.body.append(contacts);
    const banner = document.querySelector('.homepage-slider');
    if (banner) {
      const frames = [...banner.querySelectorAll('.slider-images img')];
      const dots = [...banner.querySelectorAll('[data-banner]')];
      const pause = banner.querySelector('[data-banner-pause]');
      let index = 0, paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
      function show(next) {
        index = (next + frames.length) % frames.length;
        frames.forEach((img,i) => { img.hidden = i !== index; });
        dots.forEach((dot,i) => dot.setAttribute('aria-pressed', String(i === index)));
      }
      dots.forEach(dot => dot.addEventListener('click', () => show(Number(dot.dataset.banner))));
      banner.querySelector('[data-banner-prev]').addEventListener('click', () => show(index-1));
      banner.querySelector('[data-banner-next]').addEventListener('click', () => show(index+1));
      pause.textContent = paused ? 'Play' : 'Pause';
      pause.addEventListener('click', () => { paused = !paused; pause.textContent = paused ? 'Play' : 'Pause'; });
      setInterval(() => { if (!paused && !document.hidden && !banner.matches(':hover') && !banner.contains(document.activeElement)) show(index+1); }, 6000);
    }
    const current = slug(location.pathname);
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
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
