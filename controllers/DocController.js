// services/DocService.js
import {
  db
}
  from "../firebase/firestore.js";

import {

  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc

}
  from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  signOut,
  onAuthStateChanged
}
  from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  auth
} from "../firebase/auth.js";

// ==========================
// LOGIN
// ==========================
onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "../auth/login.html";

      return;

    }

    cargarDashboard(
      user.uid
    );

  }
);

function normalizarId(valor) {

  if (!valor) return "";

  // Si es referencia de Firestore
  if (typeof valor === "object") {

    if (valor.id) return valor.id;

    if (valor._key?.path?.segments) {
      return valor._key.path.segments.at(-1);
    }

  }

  return valor
    .toString()
    .replace("/carreras/", "")
    .replace("/niveles/", "")
    .trim();
}
// ==========================
// DASHBOARD
// ==========================
async function cargarDashboard(uid) {

  try {

    // ==========================
    // ASIGNACIONES
    // ==========================
    const asignaciones =
      await obtenerAsignaciones(uid);

    // ==========================
    // VARIABLES
    // ==========================
    let carrerasUnicas =
      new Set();

    let nivelesUnicos =
      new Set();

    let totalModulos = 0;

    let totalEstudiantes = 0;

    let htmlCarreras = "";

    let htmlModulos = "";

    let htmlEstudiantes = "";

    let contadorEst = 1;

    // ==========================
    // RECORRER
    // ==========================
    for (const asi of asignaciones) {

  // ==========================
  // NORMALIZAR IDS
  // ==========================
  const carreraId = normalizarId(asi.carreraId);
  const nivelId = normalizarId(asi.nivelId);

  // ==========================
  // DATOS BASE
  // ==========================
  const carrera = await obtenerCarrera(carreraId);
  const nivel = await obtenerNivel(nivelId);

  const modulos = await obtenerModulos(carreraId, nivelId);
  const estudiantes = await obtenerEstudiantes(carreraId, nivelId);

  // ==========================
  // CONTADORES
  // ==========================
  if (carrera) carrerasUnicas.add(carrera.id);
  if (nivel) nivelesUnicos.add(nivel.id);

  totalModulos += modulos.length;
  totalEstudiantes += estudiantes.length;

  // ==========================
  // HTML CARRERAS
  // ==========================
  htmlCarreras += `
    <div class="item-card">
      <div style="font-weight:700;margin-bottom:6px;">
        ${carrera?.nombre || "-"}
      </div>
      <div style="color:var(--txt-muted);font-size:13px;">
        ${nivel?.nombre || "-"}
      </div>
    </div>
  `;

  // ==========================
  // HTML MODULOS
  // ==========================
  modulos.forEach(modulo => {
    htmlModulos += `
      <div class="item-card">
        <div style="font-weight:700;">
          ${modulo.nombre}
        </div>
        <div style="font-size:12px;color:var(--txt-muted);">
          ${nivel?.nombre}
        </div>
      </div>
    `;
  });

  // ==========================
  // HTML ESTUDIANTES
  // ==========================
  estudiantes.forEach(est => {
    htmlEstudiantes += `
      <tr>
        <td>${contadorEst++}</td>
        <td>${est.nombre}</td>
        <td>${carrera?.nombre || "-"}</td>
        <td>${nivel?.nombre || "-"}</td>
        <td>${est.gestion || "2026"}</td>
        <td>
          <a href="subirNotas.html" class="btn btn-sm btn-primary">
            <i class="bi bi-pencil"></i>
          </a>
        </td>
      </tr>
    `;
  });
}

    // ==========================
    // STATS
    // ==========================
    document.getElementById(
      "statCarreras"
    ).textContent =
      carrerasUnicas.size;

    document.getElementById(
      "statNiveles"
    ).textContent =
      nivelesUnicos.size;

    document.getElementById(
      "statModulos"
    ).textContent =
      totalModulos;

    document.getElementById(
      "statEstudiantes"
    ).textContent =
      totalEstudiantes;

    // ==========================
    // LISTAS
    // ==========================
    document.getElementById(
      "carrerasList"
    ).innerHTML =
      htmlCarreras ||
      `<div class="empty-state">
        Sin carreras
      </div>`;

    document.getElementById(
      "modulosList"
    ).innerHTML =
      htmlModulos ||
      `<div class="empty-state">
        Sin módulos
      </div>`;

    document.getElementById(
      "estudiantesBody"
    ).innerHTML =
      htmlEstudiantes ||
      `
        <tr>
          <td colspan="6">
            Sin estudiantes
          </td>
        </tr>
      `;

  }

  catch (error) {

    console.error(error);

  }

}


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
// ASIGNACIONES DOCENTE
// ==========================

export async function obtenerAsignaciones(uid) {

  const q =
    query(
      collection(db, "docentes"),
      where("usuarioId", "==", uid)
    );

  const snap =
    await getDocs(q);

  return snap.docs.map(d => ({

    id: d.id,
    ...d.data()

  }));

}


// ==========================
// CARRERA
// ==========================

export async function obtenerCarrera(id) {

  const snap =
    await getDoc(
      doc(db, "carreras", id)
    );

  return snap.exists()
    ? {
      id: snap.id,
      ...snap.data()
    }
    : null;

}


// ==========================
// NIVEL
// ==========================

export async function obtenerNivel(id) {

  const snap =
    await getDoc(
      doc(db, "niveles", id)
    );

  return snap.exists()
    ? {
      id: snap.id,
      ...snap.data()
    }
    : null;

}


// ==========================
// MODULOS
// ==========================

export async function obtenerModulos(

  carreraId,
  nivelId

) {

  const q =
    query(

      collection(db, "modulos"),

      where(
        "carreraId",
        "==",
        carreraId
      ),

      where(
        "nivelId",
        "==",
        nivelId
      ),

      where(
        "estado",
        "==",
        true
      )

    );

  const snap =
    await getDocs(q);

  return snap.docs.map(d => ({

    id: d.id,
    ...d.data()

  }));

}


// ==========================
// ESTUDIANTES
// ==========================

export async function obtenerEstudiantes(
  carreraId,
  nivelId
) {

  // ==========================
  // QUERY
  // ==========================

  const q = query(

    collection(db, "estudiantes"),

    where(
      "carreraId",
      "==",
      carreraId
    ),

    where(
      "nivelId",
      "==",
      nivelId
    )

  );

  const snap = await getDocs(q);

  return snap.docs.map(d => ({

    id: d.id,
    ...d.data()

  }));

}
