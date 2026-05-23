
// controllers/SubirNotasController.js

import {

  auth

}
from "../firebase/auth.js";

import {

  onAuthStateChanged

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

  db

}
from "../firebase/firestore.js";

import {

  obtenerAsignaciones,
  obtenerCarrera,
  obtenerNivel,
  obtenerModulos,
  obtenerEstudiantes

}
from "../services/DocService.js";

import {

  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ==========================
// VARIABLES
// ==========================

let docenteUid = null;

let asignaciones = [];

let estudiantesActuales = [];

let moduloActualId = null;


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

    docenteUid =
      user.uid;

    await cargarAsignaciones();

  }

);


// ==========================
// CARGAR ASIGNACIONES
// ==========================

async function cargarAsignaciones() {

  asignaciones =
    await obtenerAsignaciones(
      docenteUid
    );

  const selCarrera =
    document.getElementById(
      "selCarrera"
    );

  selCarrera.innerHTML = `
    <option value="">
      — Seleccionar —
    </option>
  `;

  const carrerasUnicas =
    [...new Set(
      asignaciones.map(
        a => a.carreraId
      )
    )];

  for (const carreraId of carrerasUnicas) {

    const carrera =
      await obtenerCarrera(
        carreraId
      );

    if (carrera) {

      selCarrera.innerHTML += `
        <option value="${carrera.id}">
          ${carrera.nombre}
        </option>
      `;

    }

  }

}


// ==========================
// CAMBIO CARRERA
// ==========================

window.onCarreraChange =
  async function () {

    const carreraId =
      document.getElementById(
        "selCarrera"
      ).value;

    const selNivel =
      document.getElementById(
        "selNivel"
      );

    selNivel.innerHTML = `
      <option value="">
        — Seleccionar —
      </option>
    `;

    document.getElementById(
      "selModulo"
    ).innerHTML = `
      <option value="">
        — Seleccionar —
      </option>
    `;

    if (!carreraId) return;

    const niveles =
      asignaciones.filter(
        a =>
          a.carreraId === carreraId
      );

    for (const n of niveles) {

      const nivel =
        await obtenerNivel(
          n.nivelId
        );

      if (nivel) {

        selNivel.innerHTML += `
          <option value="${nivel.id}">
            ${nivel.nombre}
          </option>
        `;

      }

    }

  };


// ==========================
// CAMBIO NIVEL
// ==========================

window.onNivelChange =
  async function () {

    const carreraId =
      document.getElementById(
        "selCarrera"
      ).value;

    const nivelId =
      document.getElementById(
        "selNivel"
      ).value;

    const selModulo =
      document.getElementById(
        "selModulo"
      );

    selModulo.innerHTML = `
      <option value="">
        — Seleccionar —
      </option>
    `;

    if (
      !carreraId ||
      !nivelId
    ) return;

    const modulos =
      await obtenerModulos(
        carreraId,
        nivelId
      );

    modulos.forEach(m => {

      selModulo.innerHTML += `
        <option value="${m.id}">
          ${m.nombre}
        </option>
      `;

    });

  };


// ==========================
// CAMBIO MODULO
// ==========================

window.onModuloChange =
  async function () {

    const moduloId =
      document.getElementById(
        "selModulo"
      ).value;

    const carreraId =
      document.getElementById(
        "selCarrera"
      ).value;

    const nivelId =
      document.getElementById(
        "selNivel"
      ).value;

    const gestion =
      document.getElementById(
        "selGestion"
      ).value;

    if (!moduloId) return;

    await cargarTablaNotas(

      moduloId,
      carreraId,
      nivelId,
      gestion

    );

  };


// ==========================
// TABLA NOTAS
// ==========================

async function cargarTablaNotas(

  moduloId,
  carreraId,
  nivelId,
  gestion

) {

  moduloActualId =
    moduloId;

  document.getElementById(
    "tablaNota"
  ).style.display = "";

  document.getElementById(
    "placeholderTabla"
  ).style.display = "none";

  const moduloSnap =
    await getDoc(
      doc(
        db,
        "modulos",
        moduloId
      )
    );

  const modulo =
    moduloSnap.exists()
      ? moduloSnap.data()
      : null;

  document.getElementById(
    "tituloTabla"
  ).textContent =
    modulo?.nombre || "Módulo";

  estudiantesActuales =
    await obtenerEstudiantes(
      carreraId,
      nivelId
    );

  const tbody =
    document.getElementById(
      "notasBody"
    );

  if (
    !estudiantesActuales.length
  ) {

    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          Sin estudiantes
        </td>
      </tr>
    `;

    return;

  }

  let html = "";

  for (let i = 0; i < estudiantesActuales.length; i++) {

    const e =
      estudiantesActuales[i];

    const usuarioSnap =
      await getDoc(
        doc(
          db,
          "usuarios",
          e.usuarioId
        )
      );

    const usuario =
      usuarioSnap.exists()
        ? usuarioSnap.data()
        : {};

    const calId =
      `${e.id}_${moduloId}_${gestion}`;

    const calSnap =
      await getDoc(
        doc(
          db,
          "calificaciones",
          calId
        )
      );

    const notaActual =
      calSnap.exists()
        ? calSnap.data().nota
        : "";

    html += `

      <tr>

        <td>
          ${i + 1}
        </td>

        <td>

          ${usuario.nombre || ""}
          ${usuario.ap_paterno || ""}

        </td>

        <td>
          ${usuario.ci || "—"}
        </td>

        <td>
          ${notaActual || "Sin nota"}
        </td>

        <td>

          <input
            type="number"
            min="0"
            max="100"
            value="${notaActual}"
            class="nota-input"
            id="nota-${e.id}"
          >

        </td>

        <td>

          <span
            id="estado-${e.id}"
            style="
              color:var(--txt-muted)
            "
          >

            Pendiente

          </span>

        </td>

      </tr>

    `;

  }

  tbody.innerHTML =
    html;

}


// ==========================
// GUARDAR TODAS
// ==========================

window.guardarTodas =
  async function () {

    const gestion =
      document.getElementById(
        "selGestion"
      ).value;

    const btn =
      document.getElementById(
        "btnGuardar"
      );

    btn.disabled = true;

    btn.innerHTML = `
      Guardando...
    `;

    let total = 0;

    for (const e of estudiantesActuales) {

      const input =
        document.getElementById(
          `nota-${e.id}`
        );

      const nota =
        parseFloat(
          input.value
        );

      if (
        isNaN(nota)
      ) continue;

      const notaFinal =
        Math.max(
          0,
          Math.min(100, nota)
        );

      const calId =
        `${e.id}_${moduloActualId}_${gestion}`;

      await setDoc(

        doc(
          db,
          "calificaciones",
          calId
        ),

        {

          estudianteId:
            e.id,

          docenteId:
            docenteUid,

          moduloId:
            moduloActualId,

          nota:
            notaFinal,

          gestion:
            gestion,

          timestamp:
            serverTimestamp()

        }

      );

      document.getElementById(
        `estado-${e.id}`
      ).innerHTML = `
        <span
          style="
            color:var(--accent-3)
          "
        >
          Guardado
        </span>
      `;

      total++;

    }

    btn.disabled = false;

    btn.innerHTML = `
      <i class="bi bi-check2-all"></i>
      Guardar Todas
    `;

    alert(
      `${total} notas guardadas`
    );

  };

