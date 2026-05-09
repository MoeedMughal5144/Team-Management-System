// ─── STATE ──────────────────────────────────────────────────────────────────
let allMembers = [];
let deleteTargetId = null;
let editingId = null;

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadTeam();
  loadCompany();
});

// ─── PAGE SWITCHING ───────────────────────────────────────────────────────────
function switchPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');

  const titles = { team: 'Team Members', company: 'Company Info' };
  document.getElementById('topbarTitle').textContent = titles[page];
  document.getElementById('addMemberBtn').style.display = page === 'team' ? 'inline-flex' : 'none';
}

// ─── LOAD TEAM ────────────────────────────────────────────────────────────────
async function loadTeam() {
  try {
    const res = await fetch('/api/team');
    allMembers = await res.json();
    renderStats();
    renderTable(allMembers);
  } catch (err) {
    showToast('Failed to load team data', 'error');
  }
}

function renderStats() {
  const depts = {};
  allMembers.forEach(m => { depts[m.department] = (depts[m.department] || 0) + 1; });

  document.getElementById('statsRow').innerHTML = `
    <div class="stat-card">
      <div class="stat-icon purple">👥</div>
      <div class="stat-info">
        <div class="value">${allMembers.length}</div>
        <div class="label">Total Members</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon pink">💻</div>
      <div class="stat-info">
        <div class="value">${depts['Developer'] || 0}</div>
        <div class="label">Developers</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon amber">🎨</div>
      <div class="stat-info">
        <div class="value">${depts['Designer'] || 0}</div>
        <div class="label">Designers</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green">📋</div>
      <div class="stat-info">
        <div class="value">${depts['Management'] || 0}</div>
        <div class="label">Management</div>
      </div>
    </div>
  `;
}

function renderTable(members) {
  const tbody = document.getElementById('teamTableBody');

  if (!members.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-faint);padding:3rem">No team members found</td></tr>`;
    return;
  }

  tbody.innerHTML = members.map(m => {
    const deptClass = m.department === 'Developer' ? 'badge-dev' : m.department === 'Designer' ? 'badge-des' : 'badge-mgmt';
    const socials = [
      m.social.linkedin ? `<a href="${m.social.linkedin}" target="_blank" title="LinkedIn" style="color:var(--text-muted);margin-right:6px;"><i class="fab fa-linkedin-in"></i></a>` : '',
      m.social.github ? `<a href="${m.social.github}" target="_blank" title="GitHub" style="color:var(--text-muted);margin-right:6px;"><i class="fab fa-github"></i></a>` : '',
      m.social.twitter ? `<a href="${m.social.twitter}" target="_blank" title="Twitter" style="color:var(--text-muted)"><i class="fab fa-twitter"></i></a>` : ''
    ].filter(Boolean).join('');

    return `
      <tr>
        <td>
          <div class="member-info-cell">
            <img src="${m.image}" alt="${m.name}" class="member-avatar"
              onerror="this.src='https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(m.name)}'">
            <div>
              <div class="name">${m.name}</div>
              <div class="role-small">${m.role}</div>
            </div>
          </div>
        </td>
        <td><span class="badge ${deptClass}">${m.department}</span></td>
        <td style="max-width:220px; color:var(--text-muted); font-size:0.82rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${m.bio}</td>
        <td>${socials || '<span style="color:var(--text-faint);font-size:0.8rem">None</span>'}</td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-sm btn-secondary" onclick="editMember('${m.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="confirmDelete('${m.id}', '${m.name.replace(/'/g, "\\'")}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ─── TABLE FILTER ─────────────────────────────────────────────────────────────
function filterTable() {
  const q = document.getElementById('adminSearch').value.toLowerCase();
  const filtered = allMembers.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.role.toLowerCase().includes(q) ||
    m.department.toLowerCase().includes(q)
  );
  renderTable(filtered);
}

// ─── DRAWER (ADD / EDIT) ──────────────────────────────────────────────────────
function openDrawer(member = null) {
  editingId = null;
  document.getElementById('editId').value = '';
  document.getElementById('drawerTitle').textContent = 'Add Team Member';
  document.getElementById('saveBtnText').textContent = 'Add Member';
  document.getElementById('fName').value = '';
  document.getElementById('fRole').value = '';
  document.getElementById('fDept').value = 'Developer';
  document.getElementById('fBio').value = '';
  document.getElementById('fImage').value = '';
  document.getElementById('fLinkedin').value = '';
  document.getElementById('fGithub').value = '';
  document.getElementById('fTwitter').value = '';
  document.getElementById('imgPreview').style.display = 'none';
  document.getElementById('drawerOverlay').classList.add('open');
}

function editMember(id) {
  const m = allMembers.find(x => x.id === id);
  if (!m) return;

  editingId = id;
  document.getElementById('editId').value = id;
  document.getElementById('drawerTitle').textContent = 'Edit Team Member';
  document.getElementById('saveBtnText').textContent = 'Save Changes';
  document.getElementById('fName').value = m.name;
  document.getElementById('fRole').value = m.role;
  document.getElementById('fDept').value = m.department;
  document.getElementById('fBio').value = m.bio;
  document.getElementById('fImage').value = m.image;
  document.getElementById('fLinkedin').value = m.social.linkedin || '';
  document.getElementById('fGithub').value = m.social.github || '';
  document.getElementById('fTwitter').value = m.social.twitter || '';
  previewImg();
  document.getElementById('drawerOverlay').classList.add('open');
}

function closeDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  editingId = null;
}

function handleDrawerOverlayClick(e) {
  if (e.target === document.getElementById('drawerOverlay')) closeDrawer();
}

function previewImg() {
  const url = document.getElementById('fImage').value;
  const preview = document.getElementById('imgPreview');
  if (url) {
    preview.src = url;
    preview.style.display = 'block';
    preview.onerror = () => preview.style.display = 'none';
  } else {
    preview.style.display = 'none';
  }
}

// ─── SAVE MEMBER ──────────────────────────────────────────────────────────────
async function saveMember() {
  const name = document.getElementById('fName').value.trim();
  const role = document.getElementById('fRole').value.trim();

  if (!name || !role) {
    showToast('Name and Role are required', 'error');
    return;
  }

  const payload = {
    name,
    role,
    department: document.getElementById('fDept').value,
    bio: document.getElementById('fBio').value.trim(),
    image: document.getElementById('fImage').value.trim(),
    linkedin: document.getElementById('fLinkedin').value.trim(),
    github: document.getElementById('fGithub').value.trim(),
    twitter: document.getElementById('fTwitter').value.trim()
  };

  try {
    const isEdit = !!editingId;
    const url = isEdit ? `/api/team/${editingId}` : '/api/team';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error();
    closeDrawer();
    await loadTeam();
    showToast(isEdit ? `${name} updated successfully` : `${name} added to team`, 'success');
  } catch {
    showToast('Failed to save member', 'error');
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
function confirmDelete(id, name) {
  deleteTargetId = id;
  document.getElementById('confirmText').textContent =
    `Are you sure you want to remove ${name} from the team? This cannot be undone.`;
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmDeleteBtn').onclick = deleteMember;
}

function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
  deleteTargetId = null;
}

async function deleteMember() {
  if (!deleteTargetId) return;
  try {
    const res = await fetch(`/api/team/${deleteTargetId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    closeConfirm();
    await loadTeam();
    showToast('Team member removed', 'warning');
  } catch {
    showToast('Failed to delete member', 'error');
  }
}

// ─── COMPANY ──────────────────────────────────────────────────────────────────
async function loadCompany() {
  try {
    const res = await fetch('/api/company');
    const c = await res.json();
    document.getElementById('cName').value = c.name || '';
    document.getElementById('cTagline').value = c.tagline || '';
    document.getElementById('cMission').value = c.mission || '';
    document.getElementById('cVision').value = c.vision || '';
    document.getElementById('cDesc').value = c.description || '';
    document.getElementById('cServices').value = (c.services || []).join(', ');
  } catch { /* ignore */ }
}

async function saveCompany() {
  const payload = {
    name: document.getElementById('cName').value.trim(),
    tagline: document.getElementById('cTagline').value.trim(),
    mission: document.getElementById('cMission').value.trim(),
    vision: document.getElementById('cVision').value.trim(),
    description: document.getElementById('cDesc').value.trim(),
    services: document.getElementById('cServices').value.split(',').map(s => s.trim()).filter(Boolean)
  };

  try {
    const res = await fetch('/api/company', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error();
    showToast('Company info saved!', 'success');
  } catch {
    showToast('Failed to save company info', 'error');
  }
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3500);
}
