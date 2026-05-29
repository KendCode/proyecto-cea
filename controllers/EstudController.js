// controllers/EstudController.js

import { auth } from "../firebase/auth.js";

import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

  obtenerEstudiante,
  obtenerCarrera,
  obtenerNivel,
  obtenerModulos,
  obtenerCalificaciones,
  obtenerDocente,
  obtenerUsuario

} from "../services/EstudService.js";


// =========================
// LOGIN
// =========================

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.href =
      "../auth/login.html";

    return;

  }

  cargarDashboard(user.uid);

});


// =========================
// DASHBOARD
// =========================

async function cargarDashboard(uid) {

  try {
    const usuario =
      await obtenerUsuario(uid);

    //console.log("USUARIO:", usuario);

    if (!usuario) return;


    // =========================
    // ESTUDIANTE
    // =========================

    const estudiante =
      await obtenerEstudiante(uid);

    //console.log("ESTUDIANTE:", estudiante);

    if (!estudiante) return;
    // =========================
    // IDS
    // =========================

    const carreraId =
      estudiante.carreraId.id;

    const nivelId =
      estudiante.nivelId.id;
    //console.log("CARRERA ID:", carreraId); //console.log("NIVEL ID:", nivelId);
    // =========================
    // DATOS
    // =========================

    const carrera =
      await obtenerCarrera(carreraId);
    //console.log("CARRERA:", carrera);

    const nivel =
      await obtenerNivel(nivelId);
    //console.log("NIVEL:", nivel);

    const modulos =
      await obtenerModulos(
        carreraId,
        nivelId
      );

    const notas =
      await obtenerCalificaciones(estudiante.id);

    const docente =
      await obtenerDocente(
        carreraId,
        nivelId
      );

    // =========================
    // NOMBRE
    // =========================

    document.getElementById(
      "welcomeName"
    ).textContent =
      `Bienvenido ${usuario.nombre}`;

    document.getElementById(
      "sidebarNombre"
    ).textContent =
      usuario.nombre;

    // =========================
    // INFO
    // =========================

    document.getElementById(
      "infoCarrera"
    ).textContent =
      `${carrera?.nombre || "-"} · ${nivel?.nombre || "-"}`;

    document.getElementById(
      "sidebarCarrera"
    ).textContent =
      carrera?.nombre || "-";

    // =========================
    // STATS
    // =========================

    document.getElementById(
      "statCarrera"
    ).textContent =
      carrera?.nombre || "-";

    document.getElementById(
      "statNivel"
    ).textContent =
      nivel?.nombre || "-";

    document.getElementById(
      "statModulos"
    ).textContent =
      modulos.length;

    // =========================
    // PROMEDIO
    // =========================

    let promedio = 0;

    if (notas.length > 0) {

      const total =
        notas.reduce(
          (acc, item) =>
            acc + Number(item.nota),
          0
        );

      promedio =
        (total / notas.length)
          .toFixed(1);

    }

    document.getElementById(
      "statPromedio"
    ).textContent =
      promedio || "0";

    // =========================
    // DOCENTE
    // =========================

    const docenteCard =
      document.getElementById(
        "docenteCard"
      );

    if (docente) {

      const userDoc =
        await obtenerUsuario(
          docente.usuarioId
        );

      docenteCard.innerHTML = `
        <div class="item-card">

          <strong>
            ${userDoc.nombre}
            ${userDoc.ap_paterno}
          </strong>

          <div>
            Docente asignado
          </div>

        </div>
      `;

    } else {

      docenteCard.innerHTML = `
        <div class="empty-state">
          Sin docente asignado
        </div>
      `;

    }

    // =========================
    // NOTAS
    // =========================

    const notasList =
      document.getElementById(
        "notasList"
      );

    notasList.innerHTML = "";

    if (notas.length === 0) {

      notasList.innerHTML = `
        <div class="empty-state">
          Sin calificaciones
        </div>
      `;

    }

    for (const n of notas) {

      const modulo =
        modulos.find(
          m => m.id === n.moduloId
        );

      notasList.innerHTML += `

        <div class="item-card"
          style="
            padding:14px;
            border-radius:14px;
            background:#f8fafc;
            margin-bottom:10px;
          ">

          <strong>
            ${modulo?.nombre || "Módulo"}
          </strong>

          <div>
            Nota: ${n.nota}
          </div>

        </div>
      `;

    }

    // =========================
    // PROGRESO
    // =========================

    const progreso =
      document.getElementById(
        "progresoModulos"
      );

    progreso.innerHTML = "";

    modulos.sort(
      (a, b) => a.orden - b.orden
    );

    modulos.forEach(modulo => {

      const nota =
        notas.find(
          n => n.moduloId === modulo.id
        );

      const valor =
        nota?.nota || 0;

      progreso.innerHTML += `

    <div style="margin-bottom:18px">

      <div style="
        display:flex;
        justify-content:space-between;
        margin-bottom:6px;
        font-size:14px;
        font-weight:700;
      ">

        <span>
          ${modulo.orden}. ${modulo.nombre}
        </span>

        <span>${valor}</span>

      </div>

      <div style="
        width:100%;
        height:12px;
        background:#e2e8f0;
        border-radius:999px;
        overflow:hidden;
      ">

        <div style="
          width:${valor}%;
          height:100%;
          background:linear-gradient(
            135deg,
            #10b981,
            #3b82f6
          );
        "></div>

      </div>

    </div>
  `;

    });

  }

  catch (error) {

    console.error(
      "ERROR DASHBOARD:",
      error
    );

  }

}


// =========================
// LOGOUT
// =========================

document
  .getElementById("logoutBtn")
  .addEventListener(
    "click",
    async () => {

      await signOut(auth);

      localStorage.removeItem(
        "usuario"
      );

      window.location.href =
        "../auth/login.html";

    }
  );

