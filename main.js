// ─── STATE ──────────────────────────────────────────────────────────────────
let allMembers = [];
let currentDept = 'All';
let searchQuery = '';

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadCompany();
  loadTeam();
  initThemeToggle();
  initScrollReveal();
  initNavHamburger();
});

// ─── COMPANY DATA ─────────────────────────────────────────────────────────────
async function loadCompany() {
  try {
    const res = await fetch('/api/company');
    const c = await res.json();

    document.title = `${c.name} — About Us`;
    document.getElementById('companyName').textContent = c.name;
    document.getElementById('heroTitle').innerHTML = `${c.tagline.split(' ').slice(0,1).join(' ')}<br><span class="gradient-text">${c.tagline.split(' ').slice(1).join(' ')}</span>`;
    document.getElementById('heroDesc').textContent = c.description.substring(0, 120) + '…';
    document.getElementById('companyDesc').textContent = c.description;
    document.getElementById('missionText').textContent = c.mission;
    document.getElementById('missionCard').textContent = c.mission;
    document.getElementById('visionCard').textContent = c.vision;

    // Service chips
    const chips = document.getElementById('serviceChips');
    chips.innerHTML = c.services.map(s =>
      `<span class="service-chip">${s}</span>`
    ).join('');
  } catch (err) {
    console.error('Failed to load company:', err);
  }
}

// ─── TEAM DATA ────────────────────────────────────────────────────────────────
async function loadTeam() {
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (currentDept !== 'All') params.set('department', currentDept);

    const res = await fetch(`/api/team?${params}`);
    allMembers = await res.json();
    renderTeam(allMembers);
  } catch (err) {
    document.getElementById('teamGrid').innerHTML = `
      <div class="team-empty">
        <p style="font-size:2rem">⚠️</p>
        <p>Failed to load team members</p>
      </div>`;
  }
}

function renderTeam(members) {
  const grid = document.getElementById('teamGrid');

  if (!members.length) {
    grid.innerHTML = `
      <div class="team-empty">
        <p style="font-size:2.5rem;margin-bottom:0.5rem">🔍</p>
        <p>No team members found</p>
        <p style="font-size:0.82rem;color:var(--text-faint);margin-top:0.25rem">Try a different search or filter</p>
      </div>`;
    return;
  }

  grid.innerHTML = members.map((m, i) => `
    <div class="member-card" style="animation-delay:${i * 0.07}s" onclick="openModal('${m.id}')">
      <div class="card-image-wrap">
        <img src="${m.image}" alt="${m.name}" loading="lazy" onerror="this.src='https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(m.name)}'">
        <span class="dept-badge dept-${m.department}">${m.department}</span>
        <div class="card-overlay">
          <div class="overlay-socials">
            ${m.social.linkedin ? `<a href="${m.social.linkedin}" target="_blank" class="social-btn" onclick="event.stopPropagation()"><i class="fab fa-linkedin-in"></i></a>` : ''}
            ${m.social.github ? `<a href="${m.social.github}" target="_blank" class="social-btn" onclick="event.stopPropagation()"><i class="fab fa-github"></i></a>` : ''}
            ${m.social.twitter ? `<a href="${m.social.twitter}" target="_blank" class="social-btn" onclick="event.stopPropagation()"><i class="fab fa-twitter"></i></a>` : ''}
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="member-name">${m.name}</div>
        <div class="member-role">${m.role}</div>
        <p class="member-bio">${m.bio}</p>
      </div>
    </div>
  `).join('');
}

// ─── SEARCH & FILTER ──────────────────────────────────────────────────────────
document.getElementById('searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  loadTeam();
});

document.getElementById('filterTabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;

  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentDept = tab.dataset.dept;
  loadTeam();
});

// ─── MODAL ────────────────────────────────────────────────────────────────────
function openModal(id) {
  const m = allMembers.find(x => x.id === id);
  if (!m) return;

  document.getElementById('modalImg').src = m.image;
  document.getElementById('modalImg').alt = m.name;
  document.getElementById('modalName').textContent = m.name;
  document.getElementById('modalRole').textContent = `${m.role} · ${m.department}`;
  document.getElementById('modalBio').textContent = m.bio;

  const socials = [];
  if (m.social.linkedin) socials.push(`<a href="${m.social.linkedin}" target="_blank" class="modal-social-link"><i class="fab fa-linkedin-in"></i> LinkedIn</a>`);
  if (m.social.github) socials.push(`<a href="${m.social.github}" target="_blank" class="modal-social-link"><i class="fab fa-github"></i> GitHub</a>`);
  if (m.social.twitter) socials.push(`<a href="${m.social.twitter}" target="_blank" class="modal-social-link"><i class="fab fa-twitter"></i> Twitter</a>`);
  document.getElementById('modalSocials').innerHTML = socials.join('');

  document.getElementById('memberModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('memberModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('memberModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('memberModal')) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  btn.textContent = saved === 'dark' ? '🌙' : '☀️';

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '🌙' : '☀️';
  });
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── HAMBURGER ────────────────────────────────────────────────────────────────
function initNavHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  btn.addEventListener('click', () => links.classList.toggle('open'));
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3500);
}
