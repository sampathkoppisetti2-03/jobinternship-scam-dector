// ============================================================
//   SHIELDWATCH — Main JavaScript
// ============================================================

/* ── Theme Toggle ─────────────────────────────────────────── */
const themeToggle = document.querySelectorAll('.theme-toggle');
const savedTheme = localStorage.getItem('sw-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

function updateThemeIcons(theme) {
  themeToggle.forEach(btn => {
    btn.innerHTML = theme === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  });
}
updateThemeIcons(savedTheme);

themeToggle.forEach(btn => {
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sw-theme', next);
    updateThemeIcons(next);
    showToast('Theme Changed', `Switched to ${next} mode`, next === 'dark' ? 'info' : 'success');
  });
});

/* ── Navbar Scroll ────────────────────────────────────────── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}

/* ── Mobile Nav ───────────────────────────────────────────── */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const isOpen = mobileNav.classList.contains('open');
    hamburger.innerHTML = isOpen
      ? '<span style="transform:rotate(45deg) translate(5px,5px)"></span><span style="opacity:0"></span><span style="transform:rotate(-45deg) translate(5px,-5px)"></span>'
      : '<span></span><span></span><span></span>';
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.innerHTML = '<span></span><span></span><span></span>';
    }
  });
}

/* ── Active Nav Link ──────────────────────────────────────── */
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const linkPath = link.getAttribute('href');
  if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── Scroll To Top ────────────────────────────────────────── */
const scrollBtn = document.querySelector('.scroll-top');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Scroll Reveal ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ── Animated Counters ────────────────────────────────────── */
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = isFloat ? (eased * target).toFixed(1) : Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseFloat(entry.target.dataset.target);
        const suffix = entry.target.dataset.suffix || '';
        animateCounter(entry.target, target, suffix);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── Toast System ─────────────────────────────────────────── */
function showToast(title, message, type = 'info') {
  const container = document.querySelector('.toast-container');
  if (!container) return;

  const icons = { warning: '⚠️', danger: '🚨', success: '✅', info: '🛡️' };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '🔔'}</span>
    <div class="toast-text">
      <strong>${title}</strong>
      <span>${message}</span>
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toast-in 0.35s ease reverse';
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}

/* Auto-show warning toast on pages */
setTimeout(() => {
  showToast('Security Reminder', 'Never pay for job offers — it\'s always a scam', 'warning');
}, 2500);

/* ── Scam Card Filter ─────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const scamCards = document.querySelectorAll('.scam-card');

if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      scamCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? 'block' : 'none';
        if (match) {
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        }
      });
    });
  });
}

/* ── Risk Bar Animation ───────────────────────────────────── */
const riskObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.risk-bar');
        if (bar && bar.dataset.width) {
          setTimeout(() => bar.style.width = bar.dataset.width, 200);
        }
      }
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll('.scam-card').forEach(card => riskObserver.observe(card));

/* ── Link Checker ─────────────────────────────────────────── */
const checkerInput = document.getElementById('link-input');
const checkerBtn = document.getElementById('checker-btn');
const checkerResult = document.getElementById('checker-result');
const checkingLoader = document.getElementById('checking-loader');

// Known patterns for heuristic analysis
const scamPatterns = {
  highRisk: [
    /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|shorturl|tiny\.cc/i,
    /free.*job|job.*free|internship.*free.*money/i,
    /login.*google.*docs|googledocs.*login/i,
    /\.(tk|ml|ga|cf|gq|xyz|top|click|link|work|online)\b/i,
    /verify.*account.*urgent|urgent.*verify/i,
    /whatsapp.*job|telegram.*job|job.*whatsapp/i,
    /work.*from.*home.*\$|earn.*daily.*guaranteed/i,
    /apply.*now.*\d{4,}.*salary/i,
    /hiring.*immediately.*no.*experience.*required/i,
    /paytm.*job|cashback.*job|wallet.*job/i,
  ],
  mediumRisk: [
    /\.blogspot\.|\.wixsite\.|\.weebly\.|\.wordpress\.com/i,
    /apply.*form.*google.*forms/i,
    /glassdoor.*apply|naukri.*redirect/i,
    /internship.*stipend.*guaranteed/i,
    /apply.*hr.*whatsapp/i,
    /job.*registration.*fee|apply.*fee/i,
    /\d{10,}.*job|job.*\d{10,}/i,
  ],
  trusted: [
    /linkedin\.com/i,
    /naukri\.com/i,
    /indeed\.com/i,
    /glassdoor\.com/i,
    /monster\.com/i,
    /timesjobs\.com/i,
    /internshala\.com/i,
    /letsintern\.com/i,
    /unstop\.com/i,
    /hirist\.com/i,
    /foundit\.in/i,
    /shine\.com/i,
    /google\.com\/about\/careers/i,
    /careers\.(microsoft|amazon|apple|meta|netflix|infosys|wipro|tcs|accenture)\.com/i,
    /\.gov\.in/i,
    /\.ac\.in/i,
  ]
};

function extractDomain(url) {
  try {
    const u = new URL(url.startsWith('http') ? url : 'https://' + url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function analyzeURL(url) {
  const lower = url.toLowerCase();
  const domain = extractDomain(url);
  const flags = [];
  let riskScore = 0;

  // Check trusted
  for (const pattern of scamPatterns.trusted) {
    if (pattern.test(lower)) {
      return {
        level: 'safe',
        title: '✅ Likely Legitimate Platform',
        detail: `This URL matches a known, trusted job platform (${domain}). However, always verify the specific job posting for legitimacy. Scammers can also post on legitimate platforms.`,
        tags: ['Trusted Domain', 'Known Platform', 'Proceed with Caution'],
        score: 15
      };
    }
  }

  // Check high risk
  for (const pattern of scamPatterns.highRisk) {
    if (pattern.test(lower)) {
      riskScore += 40;
      flags.push('High-risk pattern detected');
    }
  }

  // Check medium risk
  for (const pattern of scamPatterns.mediumRisk) {
    if (pattern.test(lower)) {
      riskScore += 20;
      flags.push('Suspicious pattern detected');
    }
  }

  // Additional heuristics
  if (!/^https:/.test(url) && url.length > 4) { riskScore += 15; flags.push('No HTTPS'); }
  if (/\d{3,}\.\d{3,}\.\d+/.test(url)) { riskScore += 30; flags.push('IP address URL'); }
  if (url.length > 120) { riskScore += 10; flags.push('Suspiciously long URL'); }
  if ((url.match(/-/g) || []).length > 4) { riskScore += 10; flags.push('Multiple hyphens'); }
  if (/login|signin|verify|account|update|secure/.test(lower) && !/official|google|microsoft/.test(lower)) {
    riskScore += 20; flags.push('Login/verify page on unknown domain');
  }
  if (/job|internship|hiring|recruitment/.test(lower)) {
    riskScore += 5;
  }

  if (riskScore >= 50) {
    return {
      level: 'danger',
      title: '🚨 High Scam Risk Detected',
      detail: `This URL exhibits multiple characteristics common in job/internship scams. Domain: ${domain}. ${flags.length > 0 ? 'Issues found: ' + flags.slice(0,3).join(', ') + '.' : ''} Do NOT enter personal information or make any payments.`,
      tags: flags.slice(0,4),
      score: riskScore
    };
  } else if (riskScore >= 20) {
    return {
      level: 'warning',
      title: '⚠️ Suspicious — Verify Carefully',
      detail: `This URL has some characteristics that warrant caution. Domain: ${domain}. ${flags.length > 0 ? 'Flags: ' + flags.join(', ') + '.' : ''} Research the company independently before sharing personal data.`,
      tags: flags.slice(0,3).concat(['Manual Verification Advised']),
      score: riskScore
    };
  } else {
    return {
      level: 'safe',
      title: '🔍 No Major Threats Detected',
      detail: `No obvious scam patterns found for ${domain}. This doesn't guarantee legitimacy — always cross-check company details, look for official websites, and never pay for job applications.`,
      tags: ['No Known Patterns', 'Still Verify Manually'],
      score: riskScore
    };
  }
}

if (checkerBtn && checkerInput) {
  async function runCheck() {
    const url = checkerInput.value.trim();
    if (!url) {
      showToast('Input Required', 'Please enter a URL to check', 'warning');
      checkerInput.focus();
      return;
    }

    // Show loader
    checkerResult.classList.remove('show');
    checkingLoader.classList.add('show');

    await new Promise(r => setTimeout(r, 1800 + Math.random() * 600));

    checkingLoader.classList.remove('show');

    const result = analyzeURL(url);
    const tagClass = result.level === 'danger' ? 'tag-danger' : result.level === 'warning' ? 'tag-warning' : 'tag-success';
    const scoreColor = result.level === 'danger' ? '#ef4444' : result.level === 'warning' ? '#f59e0b' : '#10b981';

    checkerResult.className = `checker-result show ${result.level}`;
    checkerResult.innerHTML = `
      <div class="result-header">
        <span class="result-icon">${result.level === 'danger' ? '🚨' : result.level === 'warning' ? '⚠️' : '✅'}</span>
        <div>
          <div class="result-title">${result.title}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px">Risk Score: <span style="color:${scoreColor};font-weight:700">${result.score}/100</span></div>
        </div>
      </div>
      <p class="result-detail">${result.detail}</p>
      <div class="result-tags">
        ${result.tags.map(t => `<span class="result-tag ${tagClass}">${t}</span>`).join('')}
      </div>
    `;

    const toastType = result.level === 'danger' ? 'danger' : result.level === 'warning' ? 'warning' : 'success';
    showToast('URL Analyzed', result.title, toastType);
  }

  checkerBtn.addEventListener('click', runCheck);
  checkerInput.addEventListener('keypress', e => { if (e.key === 'Enter') runCheck(); });
}

/* ── Smooth page load ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);
});
