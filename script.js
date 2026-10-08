/* =============================================
   PROTECT INSECT – JAVASCRIPT v2
   Scroll Animations, Interactions, Form
   ============================================= */

// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
const navbar  = document.getElementById('navbar');
const navLinksEl = document.getElementById('nav-links');
const hamburger  = document.getElementById('hamburger');
const heroBgLines = document.querySelector('.hero-bg-lines');
const heroSectionEl = document.getElementById('inicio');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  // Scrolled style
  navbar.classList.toggle('scrolled', currentScroll > 40);

  // Smart hide/show on direction
  if (currentScroll > lastScroll && currentScroll > 350) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = currentScroll;

  // Subtle parallax drift on the hero background lines
  if (heroBgLines && heroSectionEl && currentScroll < heroSectionEl.offsetHeight) {
    heroBgLines.style.transform = `translateY(${currentScroll * 0.15}px)`;
  }
}, { passive: true });

// =============================================
// HAMBURGER MENU (off-canvas drawer)
// =============================================
const navOverlay = document.getElementById('nav-overlay');

function closeMobileNav() {
  hamburger.classList.remove('open');
  navLinksEl.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const opening = !navLinksEl.classList.contains('open');
  hamburger.classList.toggle('open', opening);
  navLinksEl.classList.toggle('open', opening);
  navOverlay.classList.toggle('active', opening);
  document.body.style.overflow = opening ? 'hidden' : '';
});

navOverlay.addEventListener('click', closeMobileNav);

document.querySelectorAll('.nav-link:not(.dropdown-btn), .nav-cta').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// =============================================
// DROPDOWN
// =============================================
const cupimDropdown = document.getElementById('cupim-dropdown');
const cupimBtn      = document.getElementById('cupim-btn');

cupimBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  cupimDropdown.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!cupimDropdown.contains(e.target)) {
    cupimDropdown.classList.remove('open');
  }
});

// =============================================
// SMOOTH NAVIGATION (in-page anchors)
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// =============================================
// SCROLL REVEAL ANIMATIONS (IntersectionObserver)
// =============================================
const revealEls = document.querySelectorAll(
  '.scroll-reveal, .scroll-reveal-up, .scroll-reveal-left, .scroll-reveal-right, .reveal-title'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el    = entry.target;
    const delay = parseInt(el.getAttribute('data-delay') || 0, 10);

    setTimeout(() => {
      el.classList.add('in-view');
    }, delay);

    revealObserver.unobserve(el);
  });
}, {
  threshold:  0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// =============================================
// HERO ENTRANCE — staggered slide-in on page load
// =============================================
function revealHero() {
  const heroEls = document.querySelectorAll('.hero-content .hero-reveal');
  const STEP = 150; // ms between each element
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('in-view'), i * STEP);
  });
}

// =============================================
// PARTICLES BACKGROUND
// =============================================
(function createParticles() {
  const container = document.getElementById('particles-bg');
  if (!container) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleRise {
      0%   { transform: translateY(0) translateX(0); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.5; }
      100% { transform: translateY(-100vh) translateX(var(--drift)); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 28; i++) {
    const p = document.createElement('span');
    const size  = Math.random() * 3.5 + 1;
    const dur   = Math.random() * 22 + 12;
    const delay = Math.random() * -25;
    const drift = (Math.random() - 0.5) * 120;
    const alpha = Math.random() * 0.25 + 0.05;

    p.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: rgba(141,198,65,${alpha});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --drift: ${drift}px;
      animation: particleRise ${dur}s linear ${delay}s infinite;
      pointer-events: none;
    `;
    container.appendChild(p);
  }
})();

// =============================================
// FAQ ACCORDION
// =============================================
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// =============================================
// WHATSAPP FLOAT OPACITY
// =============================================
const waFloat = document.getElementById('whatsapp-float');
if (waFloat) {
  window.addEventListener('scroll', () => {
    waFloat.style.opacity = window.scrollY > 300 ? '1' : '0.72';
  }, { passive: true });
}

// =============================================
// FORM – redirect to WhatsApp
// =============================================
function handleFormSubmit(e) {
  e.preventDefault();

  const nome     = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const cidade   = document.getElementById('cidade').value.trim();
  const servicoEl = document.getElementById('servico');
  const servico   = servicoEl.value;
  const mensagem  = document.getElementById('mensagem').value.trim();

  if (!nome || !telefone || !cidade || !servico) {
    showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }

  const servicoLabel = servicoEl.options[servicoEl.selectedIndex].text;

  let msg = `Olá, Protect Insect!\n\n`;
  msg += `*Nome:* ${nome}\n`;
  msg += `*WhatsApp:* ${telefone}\n`;
  msg += `*Cidade:* ${cidade}\n`;
  msg += `*Serviço:* ${servicoLabel}\n`;
  if (mensagem) msg += `*Mensagem:* ${mensagem}\n`;
  msg += `\nGostaria de solicitar um orçamento.`;

  const btn = document.getElementById('submit-btn');
  btn.textContent = 'Redirecionando...';
  btn.style.opacity = '0.75';
  btn.disabled = true;

  setTimeout(() => {
    window.open(`https://wa.me/5511972228090?text=${encodeURIComponent(msg)}`, '_blank');
    btn.textContent = 'Enviar Mensagem pelo WhatsApp';
    btn.style.opacity = '1';
    btn.disabled = false;
    document.getElementById('contact-form').reset();
    showNotification('Mensagem preparada! Você foi redirecionado para o WhatsApp.', 'success');
  }, 700);
}

let notifStyleInjected = false;

function showNotification(msg, type, container) {
  const target = container || document.getElementById('contact-form');
  if (!target) return;

  target.querySelector('.form-notification')?.remove();

  const el = document.createElement('div');
  el.className = 'form-notification';
  el.textContent = msg;

  const isError = type === 'error';
  el.style.cssText = `
    padding: 14px 20px;
    border-radius: 8px;
    margin-top: 16px;
    font-size: 0.86rem;
    font-weight: 500;
    background: ${isError ? 'rgba(224,85,85,0.12)' : 'rgba(141,198,65,0.12)'};
    border: 1px solid ${isError ? 'rgba(224,85,85,0.35)' : 'rgba(141,198,65,0.35)'};
    color: ${isError ? '#ff8a8a' : '#8dc641'};
    animation: notifIn 0.35s cubic-bezier(0.4,0,0.2,1);
  `;

  if (!notifStyleInjected) {
    const styleTag = document.createElement('style');
    styleTag.textContent = `@keyframes notifIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }`;
    document.head.appendChild(styleTag);
    notifStyleInjected = true;
  }

  target.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

// =============================================
// PHONE MASK
// =============================================
const telInput = document.getElementById('telefone');
if (telInput) {
  telInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6)       v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2)  v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0)  v = `(${v}`;
    e.target.value = v;
  });
}

// =============================================
// ACTIVE NAV HIGHLIGHT ON SCROLL (home page only —
// the 4 service pages hardcode their own active link)
// =============================================
if (document.body.dataset.page === 'home') {
  const navSections = ['inicio', 'servicos', 'area-atendimento', 'faq', 'contato'];

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    });
  }, { threshold: 0.35 });

  navSections.forEach(id => {
    const el = document.getElementById(id);
    if (el) navObserver.observe(el);
  });
}

// =============================================
// LIGHTBOX GALLERY (pest photo grids)
// =============================================
(function initLightbox() {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;
  const imgEl    = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn  = document.getElementById('lightbox-prev');
  const nextBtn  = document.getElementById('lightbox-next');

  let currentGroup = [];
  let currentIndex = 0;

  function show(index) {
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    const img = currentGroup[currentIndex];
    imgEl.src = img.src;
    imgEl.alt = img.alt;
  }

  function open(group, startIndex) {
    currentGroup = group;
    show(startIndex);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.pest-photo-grid').forEach(grid => {
    const imgs = Array.from(grid.querySelectorAll('img'));
    imgs.forEach((img, i) => {
      const photo = img.closest('.pest-photo') || img;
      photo.addEventListener('click', () => open(imgs, i));
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(currentIndex - 1));
  nextBtn.addEventListener('click', () => show(currentIndex + 1));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  });
})();

// =============================================
// SCROLL PROGRESS BAR
// =============================================
(function createProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 9999;
    height: 3px; width: 0%;
    background: linear-gradient(90deg, #4a6b2a, #8dc641, #b8e05c);
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const doc    = document.documentElement;
    const total  = doc.scrollHeight - doc.clientHeight;
    const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

console.log('%cPROTECT INSECT', 'color:#FF7A00;font-size:1.4rem;font-weight:bold;font-family:Oswald');
console.log('%cSite carregado com sucesso. (v4 - Multi-página)', 'color:#FF9933;font-size:0.85rem');

// HERO REVEAL ON LOAD
document.addEventListener('DOMContentLoaded', revealHero);
