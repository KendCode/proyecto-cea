// ============================================
// controllers/modulosController.js
// ============================================

import {
  crearModulo,
  obtenerModulos,
  actualizarModulo,
  eliminarModulo
} from "../services/modulosService.js";

import {
  obtenerCarreras
} from "../services/carrerasService.js";

import {
  obtenerNiveles
} from "../services/nivelesService.js";

// ============================================
// VARIABLES GLOBALES
// ============================================

let modulos = [];

let carreras = {};

let niveles = {};

let editId = null;

// ============================================
// INIT
// ============================================

async function init() {

  await cargarCarreras();

  await cargarNiveles();

  await cargarModulos();

}

init();

// ============================================
// CARGAR CARRERAS
// ============================================

async function cargarCarreras() {

  const data = await obtenerCarreras();

  const selectCarrera =
    document.getElementById("fCarrera");

  const filtroCarrera =
    document.getElementById("filtroCarrera");

  selectCarrera.innerHTML =
    `<option value="">Seleccionar...</option>`;

  filtroCarrera.innerHTML =
    `<option value="">Todas las carreras</option>`;

  data.forEach(c => {

    carreras[c.id] = c;

    selectCarrera.innerHTML += `
      <option value="${c.id}">
        ${c.nombre}
      </option>
    `;

    filtroCarrera.innerHTML += `
      <option value="${c.id}">
        ${c.nombre}
      </option>
    `;

  });

  document.getElementById(
    "carrerasCount"
  ).textContent = data.length;

}

// ============================================
// CARGAR NIVELES
// ============================================

async function cargarNiveles() {

  const data = await obtenerNiveles();

  const selectNivel =
    document.getElementById("fNivel");

  const filtroNivel =
    document.getElementById("filtroNivel");

  selectNivel.innerHTML =
    `<option value="">Seleccionar...</option>`;

  filtroNivel.innerHTML =
    `<option value="">Todos los niveles</option>`;

  data.forEach(n => {

    niveles[n.id] = n;

    selectNivel.innerHTML += `
      <option value="${n.id}">
        ${n.nombre}
      </option>
    `;

    filtroNivel.innerHTML += `
      <option value="${n.id}">
        ${n.nombre}
      </option>
    `;

  });

}

// ============================================
// CARGAR MODULOS
// ============================================

async function cargarModulos() {

  modulos = await obtenerModulos();

  renderTabla();

}

// ============================================
// FILTROS
// ============================================

function getFiltrados() {

  const fc =
    document.getElementById(
      "filtroCarrera"
    ).value;

  const fn =
    document.getElementById(
      "filtroNivel"
    ).value;

  const fe =
    document.getElementById(
      "filtroEstado"
    ).value;

  return modulos
    .filter(m =>

      (!fc || m.carreraId === fc)

      &&

      (!fn || m.nivelId === fn)

      &&

      (
        fe === ""
        ||
        String(m.estado) === fe
      )

    )
    .sort(
      (a, b) => a.orden - b.orden
    );

}

// ============================================
// RENDER TABLA
// ============================================

function renderTabla() {

  const data = getFiltrados();

  const tbody =
    document.getElementById(
      "tbodyMod"
    );

  if (!data.length) {

    tbody.innerHTML = `
      <tr>
        <td colspan="7"
          style="
            text-align:center;
            padding:40px;
            color:var(--txt-muted)
          ">
          Sin módulos
        </td>
      </tr>
    `;

    return;

  }

  tbody.innerHTML =
    data.map(m => {

      const c =
        carreras[m.carreraId] || {};

      const n =
        niveles[m.nivelId] || {};

      return `
        <tr>

          <td>
            <span
              style="
                font-family:var(--mono);
                color:var(--accent-4)
              ">
              #${m.orden}
            </span>
          </td>

          <td class="td-name">
            ${m.nombre}
          </td>

          <td>
            <span
              class="role-badge rb-admin"
              style="font-family:var(--mono)"
            >
              ${m.sigla}
            </span>
          </td>

          <td>
            <span class="role-badge rb-dir">
              ${c.sigla || "—"}
            </span>

            ${c.nombre || "—"}
          </td>

          <td>
            ${n.nombre || "—"}

            <span
              style="
                font-size:10px;
                color:var(--txt-muted)
              ">
              (${n.sigla || ""})
            </span>
          </td>

          <td>

            <button
              onclick="toggleEstado('${m.id}')"
              style="
                background:none;
                border:none;
                cursor:pointer
              "
            >

              <span class="
                status-dot
                ${m.estado
                  ? "active"
                  : "inactive"
                }
              ">

                ${m.estado
                  ? "Activo"
                  : "Inactivo"
                }

              </span>

            </button>

          </td>

          <td>

            <div
              style="
                display:flex;
                gap:6px
              "
            >

              <button
                class="btn btn-ghost btn-sm"
                onclick="editar('${m.id}')"
              >
                <i class="bi bi-pencil-fill"></i>
              </button>

              <button
                class="btn btn-danger btn-sm"
                onclick="eliminar('${m.id}')"
              >
                <i class="bi bi-trash-fill"></i>
              </button>

            </div>

          </td>

        </tr>
      `;

    }).join("");

  document.getElementById(
    "totalMod"
  ).textContent =
    modulos.length;

  document.getElementById(
    "activos"
  ).textContent =
    modulos.filter(
      m => m.estado
    ).length;

}

// ============================================
// FILTRAR
// ============================================

window.filtrar = renderTabla;

// ============================================
// ABRIR MODAL
// ============================================

window.abrirModal = function(id = null) {

  editId = id;

  document.getElementById(
    "modalTitulo"
  ).textContent =
    id
      ? "Editar Módulo"
      : "Nuevo Módulo";

  if (id) {

    const m =
      modulos.find(
        x => x.id === id
      );

    document.getElementById(
      "fNombre"
    ).value = m.nombre;

    document.getElementById(
      "fSigla"
    ).value = m.sigla;

    document.getElementById(
      "fOrden"
    ).value = m.orden;

    document.getElementById(
      "fCarrera"
    ).value = m.carreraId;

    document.getElementById(
      "fNivel"
    ).value = m.nivelId;

    document.getElementById(
      "fEstado"
    ).value =
      String(m.estado);

  }

  else {

    [
      "fNombre",
      "fSigla",
      "fOrden"
    ].forEach(i => {

      document.getElementById(
        i
      ).value = "";

    });

    document.getElementById(
      "fCarrera"
    ).value = "";

    document.getElementById(
      "fNivel"
    ).value = "";

    document.getElementById(
      "fEstado"
    ).value = "true";

  }

  document.getElementById(
    "modalModulo"
  ).classList.add("show");

};

// ============================================
// CERRAR MODAL
// ============================================

window.cerrarModal = () => {

  document.getElementById(
    "modalModulo"
  ).classList.remove("show");

};

// ============================================
// EDITAR
// ============================================

window.editar = id => abrirModal(id);

// ============================================
// GUARDAR
// ============================================

window.guardar = async function() {

  const data = {

    nombre:
      document.getElementById(
        "fNombre"
      ).value.trim(),

    sigla:
      document.getElementById(
        "fSigla"
      ).value
        .trim()
        .toUpperCase(),

    orden:
      parseInt(
        document.getElementById(
          "fOrden"
        ).value
      ) || 1,

    carreraId:
      document.getElementById(
        "fCarrera"
      ).value,

    nivelId:
      document.getElementById(
        "fNivel"
      ).value,

    estado:
      document.getElementById(
        "fEstado"
      ).value === "true"

  };

  if (

    !data.nombre
    ||
    !data.sigla
    ||
    !data.carreraId
    ||
    !data.nivelId

  ) {

    alert(
      "Completa todos los campos"
    );

    return;

  }

  try {

    if (editId) {

      await actualizarModulo(
        editId,
        data
      );

      alert(
        "Módulo actualizado"
      );

    }

    else {

      await crearModulo(data);

      alert(
        "Módulo registrado"
      );

    }

    cerrarModal();

    await cargarModulos();

  }

  catch (error) {

    console.error(error);

    alert(
      "Error al guardar módulo"
    );

  }

};

// ============================================
// ELIMINAR
// ============================================

window.eliminar = async function(id) {

  const ok =
    confirm(
      "¿Eliminar módulo?"
    );

  if (!ok) return;

  try {

    await eliminarModulo(id);

    await cargarModulos();

    alert("Eliminado");

  }

  catch (error) {

    console.error(error);

  }

};

// ============================================
// TOGGLE ESTADO
// ============================================

window.toggleEstado =
  async function(id) {

    try {

      const modulo =
        modulos.find(
          m => m.id === id
        );

      await actualizarModulo(
        id,
        {
          estado: !modulo.estado
        }
      );

      await cargarModulos();

    }

    catch (error) {

      console.error(error);

    }

  };