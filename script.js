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
}, { passive: true });

// =============================================
// HAMBURGER MENU
// =============================================
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

document.querySelectorAll('.nav-link:not(.dropdown-btn), .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
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
// SMOOTH NAVIGATION & MODALS
// =============================================
const modalOverlay = document.getElementById('main-modal');
const modalBodyContent = document.getElementById('modal-body-content');

function openModal(id) {
  const contentEl = document.getElementById(id);
  if (!contentEl) return;
  
  const container = contentEl.querySelector('.section-container') || contentEl;
  modalBodyContent.innerHTML = container.innerHTML;
  
  // Trigger any reveal animations inside modal immediately
  modalBodyContent.querySelectorAll('[class*="scroll-reveal"]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  
  cupimDropdown.classList.remove('open');
  hamburger.classList.remove('open');
  navLinksEl.classList.remove('open');
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { modalBodyContent.innerHTML = ''; }, 400);
}

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        // Se for um link para uma seção de praga (que agora é modal), abre o modal
        if (target.classList.contains('pest-section')) {
          e.preventDefault();
          openModal(target.id);
          return;
        }
        // Senão faz scroll suave
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
  '.scroll-reveal, .scroll-reveal-up, .scroll-reveal-left, .scroll-reveal-right'
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
// SECTION COUNTER ANIMATION
// =============================================
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);

  const run = () => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = Math.floor(start);
    requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

let countersStarted = false;
const counters = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(el => {
        animateCounter(el, parseInt(el.getAttribute('data-count')), 2200);
      });
    }
  });
}, { threshold: 0.5 });

const heroEl = document.getElementById('inicio');
if (heroEl) counterObserver.observe(heroEl);

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
// MAGNETIC HOVER ON CARDS (subtle tilt)
// =============================================
document.querySelectorAll('.service-card, .pest-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 7;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 7;
    card.style.transform     = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
    card.style.transition    = 'box-shadow 0.2s, border-color 0.35s';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s, border-color 0.35s';
  });
});

// Glow follow on service cards
document.querySelectorAll('.service-card').forEach(card => {
  const glow = card.querySelector('.service-card-glow');
  if (!glow) return;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    glow.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(141,198,65,0.12) 0%, transparent 65%)`;
  });
});

// =============================================
// WHATSAPP FLOAT OPACITY
// =============================================
const waFloat = document.getElementById('whatsapp-float');
window.addEventListener('scroll', () => {
  waFloat.style.opacity = window.scrollY > 300 ? '1' : '0.72';
}, { passive: true });

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
    window.open(`https://wa.me/5511910081131?text=${encodeURIComponent(msg)}`, '_blank');
    btn.textContent = 'Enviar Mensagem pelo WhatsApp';
    btn.style.opacity = '1';
    btn.disabled = false;
    document.getElementById('contact-form').reset();
    showNotification('Mensagem preparada! Você foi redirecionado para o WhatsApp.', 'success');
  }, 700);
}

function showNotification(msg, type) {
  document.querySelector('.form-notification')?.remove();

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

  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes notifIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }`;
  document.head.appendChild(styleTag);

  document.getElementById('contact-form').appendChild(el);
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
// ACTIVE NAV HIGHLIGHT ON SCROLL
// =============================================
const navSections = ['inicio','servicos','madeira-seca','cupim-solo','desratizacao','dedetizacao','contato'];

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

// =============================================
// CARD CAROUSEL LOGIC
// =============================================
document.querySelectorAll('.card-carousel').forEach(carousel => {
  const slides = carousel.querySelectorAll('.carousel-slide');
  if (slides.length <= 1) return; // No need to slide if only 1 image
  
  let currentIdx = 0;
  setInterval(() => {
    slides[currentIdx].classList.remove('active');
    currentIdx = (currentIdx + 1) % slides.length;
    slides[currentIdx].classList.add('active');
  }, 3000 + Math.random() * 1000); // randomize slightly so they don't all change at exact same ms
});

console.log('%cPROTECT INSECT', 'color:#FF7A00;font-size:1.4rem;font-weight:bold;font-family:Oswald');
console.log('%cSite carregado com sucesso. (v3 - Modals)', 'color:#FF9933;font-size:0.85rem');
