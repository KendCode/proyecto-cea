
// controllers/SubirNotasController.js
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
// VARIABLES
// ==========================

let docenteUid = null;

let asignaciones = [];

let estudiantesActuales = [];

let moduloActualId = null;

let carrerasMapa = {};

let nivelesMapa = {};

let modulosGlobal = [];
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

  // ==========================
  // EVITAR DUPLICADOS
  // ==========================

  const carrerasAgregadas =
    new Set();

  for (const a of asignaciones) {

    // ==========================
    // SI YA EXISTE
    // ==========================

    if (
      carrerasAgregadas.has(
        a.carreraId
      )
    ) continue;

    carrerasAgregadas.add(
      a.carreraId
    );

    // ==========================
    // OBTENER CARRERA
    // ==========================

    const carrera =
      await obtenerCarrera(
        a.carreraId
      );

    if (!carrera) continue;

    // ==========================
    // GUARDAR EN MAPA
    // ==========================

    carrerasMapa[
      carrera.id
    ] = carrera;

    selCarrera.innerHTML += `
      <option value="${carrera.id}">
        ${carrera.nombre}
      </option>
    `;

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

    const selModulo =
      document.getElementById(
        "selModulo"
      );

    selNivel.innerHTML = `
      <option value="">
        — Seleccionar —
      </option>
    `;

    selModulo.innerHTML = `
      <option value="">
        — Seleccionar —
      </option>
    `;

    if (!carreraId) return;

    // ==========================
    // FILTRAR NIVELES
    // ==========================

    const asignacionesCarrera =
      asignaciones.filter(
        a =>
          a.carreraId === carreraId
      );

    // ==========================
    // EVITAR DUPLICADOS
    // ==========================

    const nivelesAgregados =
      new Set();

    const nivelesTemp = [];

    for (const a of asignacionesCarrera) {

      if (
        nivelesAgregados.has(
          a.nivelId
        )
      ) continue;

      nivelesAgregados.add(
        a.nivelId
      );

      // ==========================
      // OBTENER NIVEL
      // ==========================

      let nivel =
        nivelesMapa[
        a.nivelId
        ];

      if (!nivel) {

        nivel =
          await obtenerNivel(
            a.nivelId
          );

        if (nivel) {

          nivelesMapa[
            nivel.id
          ] = nivel;

        }

      }

      if (!nivel) continue;

      nivelesTemp.push(nivel);

    }
    // ==========================
    // ORDENAR NIVELES
    // ==========================

    nivelesTemp.sort(
      (a, b) => (a.orden || 0) - (b.orden || 0)
    );

    // ==========================
    // RENDER
    // ==========================

    nivelesTemp.forEach(nivel => {

      selNivel.innerHTML += `
    <option value="${nivel.id}">
      ${nivel.nombre}
    </option>
  `;

    });

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

    // ==========================
    // OBTENER MODULOS
    // ==========================

    modulosGlobal =
      await obtenerModulos(
        carreraId,
        nivelId
      );

    // ==========================
    // ORDENAR MODULOS
    // ==========================

    modulosGlobal.sort(
      (a, b) => (a.orden || 0) - (b.orden || 0)
    );

    // ==========================
    // RENDER
    // ==========================

    modulosGlobal.forEach(m => {

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
  

  // CARGAR DATOS DEL USUARIO
for(const e of estudiantesActuales){

  const usuarioSnap =
    await getDoc(
      doc(
        db,
        "usuarios",
        e.usuarioId
      )
    );


  e.usuario =
    usuarioSnap.exists()
      ? usuarioSnap.data()
      : {};

}


// ORDENAR POR APELLIDO

estudiantesActuales.sort((a,b)=>{
  const nombreA =
  `${a.usuario.ap_paterno || ""}
   ${a.usuario.ap_materno || ""}
   ${a.usuario.nombre || ""}`
  .toLowerCase();
  
  
  const nombreB =
  `${b.usuario.ap_paterno || ""}
   ${b.usuario.ap_materno || ""}
   ${b.usuario.nombre || ""}`
  .toLowerCase();
  
  
  
  return nombreA.localeCompare(nombreB);
  
  
  });

  const tbody =
    document.getElementById(
      "notasBody"
    );

  if (
    !estudiantesActuales.length
  ) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5">
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

    const calificacion =
      calSnap.exists()
        ? calSnap.data()
        : null;

    const notaActual =
      calificacion?.nota || "";

    const estadoActual =
      calificacion
        ? "registrado"
        : "pendiente";

    html += `

      <tr>

        <td>
          ${i + 1}
        </td>

        <td>

        ${usuario.ap_paterno || ""}
        ${usuario.ap_materno || ""}
        ${usuario.nombre || ""}

        </td>

        <td>
          ${usuario.ci || "—"}
        </td>

        <td>

          <input
            type="number"
            min="0"
            max="100"
            value="${notaActual}"
            placeholder="0–100"
            class="nota-input"
            id="nota-${e.id}"

            ${calificacion ? "disabled" : ""}

          >

        </td>

        <td>

          <span
            id="estado-${e.id}"
            style="
              color:var(--txt-muted)
            "
          >

            ${estadoActual}

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

      // ==========================
      // VERIFICAR SI YA EXISTE
      // ==========================

      const calRef =
        doc(
          db,
          "calificaciones",
          calId
        );

      const existeSnap =
        await getDoc(
          calRef
        );

      // ==========================
      // SI YA EXISTE
      // ==========================

      if (
        existeSnap.exists()
      ) {

        document.getElementById(
          `estado-${e.id}`
        ).innerHTML = `
    <span style="color:var(--danger)">
      Bloqueado
    </span>
  `;

        continue;

      }
      // ==========================
      // CREAR NUEVA CALIFICACION
      // ==========================

      await setDoc(

        calRef,

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

          // ==========================
          // ESTADO DE LA NOTA
          // ==========================

          estado:
            "registrado",

          // ==========================
          // CONTROL
          // ==========================

          creadoPor:
            docenteUid,

          editable:
            false,

          fechaRegistro:
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

    await Swal.fire({

      title: "¡Registro exitoso!",

      text:
        `${total} calificaciones fueron guardadas correctamente`,

      icon: "success",

      confirmButtonText: "Aceptar",

      confirmButtonColor: "#16a34a",

      background: "#ffffff",

      color: "#111827"

    });

  };

