// controllers/EstudController.js

import { auth }
from "../firebase/auth.js";

import {
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

  obtenerEstudiante,
  obtenerUsuario,
  obtenerCarrera,
  obtenerNivel,
  obtenerModulos,
  obtenerCalificaciones,
  obtenerDocente

}
from "../services/EstudService.js";


async function cargarDashboard(uid) {

  const estudiante =
    await obtenerEstudiante(uid);

  if (!estudiante) return;

  const usuario =
    await obtenerUsuario(
      estudiante.usuarioId
    );

  const carrera =
    await obtenerCarrera(
      estudiante.carreraId
    );

  const nivel =
    await obtenerNivel(
      estudiante.nivelId
    );

  const modulos =
    await obtenerModulos(
      estudiante.carreraId,
      estudiante.nivelId
    );

  const notas =
    await obtenerCalificaciones(
      estudiante.id
    );

  const docente =
    await obtenerDocente(
      estudiante.carrera,
      estudiante.nivel
    );


  // =========================
  // HEADER
  // =========================

  document.getElementById(
    "welcomeName"
  ).textContent =
    usuario.nombre;

  document.getElementById(
    "infoCarrera"
  ).textContent =
    `${carrera.nombre} · ${nivel.nombre}`;


  // =========================
  // STATS
  // =========================

  document.getElementById(
    "statCarrera"
  ).textContent =
    carrera.sigla || carrera.nombre;

  document.getElementById(
    "statNivel"
  ).textContent =
    nivel.sigla || nivel.nombre;

  document.getElementById(
    "statModulos"
  ).textContent =
    modulos.length;

  const promedio =
    notas.length
      ? Math.round(
          notas.reduce(
            (a,b)=>a+b.nota,
            0
          ) / notas.length
        )
      : 0;

  document.getElementById(
    "statPromedio"
  ).textContent =
    promedio;


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

  }


  // =========================
  // NOTAS
  // =========================

  const notasList =
    document.getElementById(
      "notasList"
    );

  notasList.innerHTML = "";

  for (const n of notas) {

    const modulo =
      modulos.find(
        m => m.id === n.moduloId
      );

    notasList.innerHTML += `
      <div class="item-card">

        <strong>
          ${modulo?.nombre || ""}
        </strong>

        <div>
          Nota: ${n.nota}
        </div>

      </div>
    `;

  }

}