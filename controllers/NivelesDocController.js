// controllers/NivelesDocController.js
import {

  onAuthStateChanged

}
  from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

  obtenerAsignaciones,
  obtenerCarrera,
  obtenerNivel,
  obtenerModulos,
  obtenerEstudiantes

}
  from "../services/DocService.js";


import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  auth
} from "../firebase/auth.js";

// ==========================
// CERRAR SESION
// ==========================
document
  .getElementById("btnLogout")
  .addEventListener(
    "click",
    async () => {

      const result =
        await Swal.fire({

          title:
            "¿Cerrar sesión?",

          text:
            "Tu sesión actual se cerrará.",

          icon:
            "question",

          showCancelButton:
            true,

          confirmButtonText:
            "Sí, cerrar",

          cancelButtonText:
            "Cancelar",

          confirmButtonColor:
            "#ef4444",

          cancelButtonColor:
            "#64748b",

          background:
            "#0f172a",

          color:
            "#fff"

        });

      // ==========================
      // CONFIRMAR
      // ==========================
      if (result.isConfirmed) {

        await signOut(auth);

        localStorage.removeItem(
          "usuario"
        );

        window.location.href =
          "../auth/login.html";

      }

    }
  );
// ==========================
// PALETA
// ==========================

const PALETA = [

  {
    bg: 'rgba(59,130,246,.15)',
    color: 'var(--accent)',
    icon: 'bi-layers-fill'
  },

  {
    bg: 'rgba(139,92,246,.15)',
    color: 'var(--accent-2)',
    icon: 'bi-mortarboard-fill'
  },

  {
    bg: 'rgba(16,185,129,.15)',
    color: 'var(--accent-3)',
    icon: 'bi-award-fill'
  }

];


// ==========================
// LOGIN
// ==========================

onAuthStateChanged(

  auth,

  async user => {

    if (!user) {

      window.location.href =
        "../auth/login.html";

      return;

    }

    await cargarNiveles(
      user.uid
    );

  }

);


// ==========================
// CARGAR NIVELES
// ==========================

async function cargarNiveles(uid) {

  const grid =
    document.getElementById(
      "nivelesGrid"
    );

  try {

    const asignaciones =
      await obtenerAsignaciones(uid);

    if (!asignaciones.length) {

      grid.innerHTML = `
        <div class="empty-state">
          Sin asignaciones
        </div>
      `;

      return;

    }

    let html = "";

    for (let i = 0; i < asignaciones.length; i++) {

      const asi =
        asignaciones[i];

      const pal =
        PALETA[
        i % PALETA.length
        ];

      const carrera =
        await obtenerCarrera(
          asi.carreraId
        );

      const nivel =
        await obtenerNivel(
          asi.nivelId
        );

      const modulos =
        await obtenerModulos(
          asi.carreraId,
          asi.nivelId
        );

      // ==========================
      // ORDENAR MODULOS
      // ==========================

      modulos.sort(
        (a, b) => a.orden - b.orden
      );
      const estudiantes =
        await obtenerEstudiantes(
          asi.carreraId,
          asi.nivelId
        );

      html += `

        <div class="panel-card">

          <div style="
            display:flex;
            justify-content:space-between;
            margin-bottom:18px;
          ">

            <div>

              <div style="
                font-weight:800;
                font-size:18px;
              ">
                ${nivel.nombre}
              </div>

              <div style="
                color:var(--txt-muted);
                font-size:12px;
              ">
                ${carrera.nombre}
              </div>

            </div>

            <div style="
              color:${pal.color};
              font-size:26px;
            ">
              <i class="
                bi
                ${pal.icon}
              "></i>
            </div>

          </div>

          <div style="
            margin-bottom:16px;
          ">

            <strong>
              Estudiantes:
            </strong>

            ${estudiantes.length}

          </div>

          <div style="
            margin-bottom:16px;
          ">

            <strong>
              Módulos:
            </strong>

            ${modulos.length}

          </div>

          ${modulos.map(m => `

            <div style="
              padding:8px;
              background:var(--bg-elevated);
              border-radius:8px;
              margin-bottom:6px;
            ">

              ${m.nombre}

            </div>

          `).join("")}

          <div style="
            margin-top:18px;
          ">

            <a
              href="
                subirNotas.html?
                carreraId=${asi.carreraId}
                &nivelId=${asi.nivelId}
              "
              class="
                btn
                btn-primary
              "
            >

              <i class="
                bi
                bi-pencil-square
              "></i>

              Subir Notas

            </a>

          </div>

        </div>

      `;

    }

    grid.innerHTML =
      html;

  } catch (error) {

    console.error(error);

    grid.innerHTML = `
      <div class="empty-state">
        Error al cargar
      </div>
    `;

  }

}

