// sidebar.js - Injects the admin sidebar and topbar
function renderLayout({ title, subtitle, activeLink }) {
  const sidebarHTML = `
  <div id="sidebar-overlay"></div>
  <aside id="sidebar">
    <a class="sidebar-brand" href="dashboard.html">
      <div class="brand-icon"><i class="bi bi-mortarboard-fill"></i></div>
      <div class="brand-text">
        <div class="name">CEA Sistema</div>
        <div class="sub">Centro de Educación</div>
      </div>
    </a>

    <div class="nav-section">
      <div class="nav-section-label">Principal</div>
      <div class="nav-item-wrap">
        <a href="dashboard.html" class="nav-link-custom ${activeLink==='dashboard'?'active':''}">
          <i class="bi bi-grid-1x2-fill"></i> Dashboard
        </a>
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-section-label">Gestión</div>
      <div class="nav-item-wrap">
        <a href="usuarios.html" class="nav-link-custom ${activeLink==='usuarios'?'active':''}">
          <i class="bi bi-people-fill"></i> Usuarios
        </a>
        <a href="estudiantes.html" class="nav-link-custom ${activeLink==='estudiantes'?'active':''}">
          <i class="bi bi-person-badge-fill"></i> Estudiantes
        </a>
        <a href="docentes.html" class="nav-link-custom ${activeLink==='docentes'?'active':''}">
          <i class="bi bi-person-workspace"></i> Docentes
        </a>
        <a href="carreras.html" class="nav-link-custom ${activeLink==='carreras'?'active':''}">
          <i class="bi bi-building"></i> Carreras
        </a>
        <a href="modulos.html" class="nav-link-custom ${activeLink==='modulos'?'active':''}">
          <i class="bi bi-journals"></i> Módulos
        </a>
        <a href="niveles.html" class="nav-link-custom ${activeLink==='niveles'?'active':''}">
          <i class="bi bi-layers-fill"></i> Niveles
        </a>
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-section-label">Académico</div>
      <div class="nav-item-wrap">
        <a href="calificaciones.html" class="nav-link-custom ${activeLink==='calificaciones'?'active':''}">
          <i class="bi bi-star-fill"></i> Calificaciones
        </a>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="user-card" id="userCard">
        <div class="user-avatar" id="userInitials">A</div>
        <div class="user-info">
          <div class="uname" id="userName">Admin</div>
          <div class="urole" id="userRole">Administrador</div>
        </div>
        <i class="bi bi-three-dots-vertical ms-auto" style="color:var(--txt-muted);margin-left:auto"></i>
      </div>
    </div>
  </aside>

  <div id="topbar">
    <button class="hamburger" onclick="toggleSidebar()"><i class="bi bi-list"></i></button>
    <div>
      <div class="topbar-title">${title}</div>
      ${subtitle ? `<div class="topbar-sub">${subtitle}</div>` : ''}
    </div>
    <div class="topbar-search">
      <i class="bi bi-search"></i>
      <input type="text" placeholder="Buscar...">
    </div>
    <div class="topbar-actions">
      <button class="icon-btn" title="Notificaciones" onclick="window.location.href='../admin/dashboard.html'">
        <i class="bi bi-bell"></i>
        <span class="dot"></span>
      </button>
      <button class="icon-btn" title="Cerrar sesión" onclick="cerrarSesion()">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
  loadUserInfo();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('show');
}
document.addEventListener('click', e => {
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay && overlay.classList.contains('show') && !document.getElementById('sidebar').contains(e.target)) {
    document.getElementById('sidebar').classList.remove('open');
    overlay.classList.remove('show');
  }
});

function loadUserInfo() {
  const user = JSON.parse(sessionStorage.getItem('cea_user') || '{}');
  if (user.nombre) {
    document.getElementById('userName').textContent = `${user.nombre} ${user.ap_paterno || ''}`.trim();
    document.getElementById('userRole').textContent = user.rol || 'Usuario';
    document.getElementById('userInitials').textContent = (user.nombre[0] || 'A').toUpperCase();
  }
}

function cerrarSesion() {
  if (confirm('¿Cerrar sesión?')) {
    sessionStorage.clear();
    window.location.href = '../../index.html';
  }
}

function showToast(msg, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
  toast.innerHTML = `<i class="bi ${icons[type]||icons.info}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}