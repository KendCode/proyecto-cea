// ===============================
// docentesController.js
// ===============================

import {
  obtenerDocentes,
  crearDocente,
  actualizarDocente,
  eliminarDocente
} from "../services/docentesService.js";

import {
  obtenerUsuarios
} from "../services/usuariosService.js";

import {
  obtenerCarreras
} from "../services/carrerasService.js";

import {
  obtenerNiveles
} from "../services/nivelesService.js";

// ===============================
// VARIABLES GLOBALES
// ===============================

let docentes = [];
let usuarios = {};
let carreras = {};
let niveles = {};

let editId = null;

// ===============================
// INIT
// ===============================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    init();
  }
);

// ===============================
// CARGAR TODO
// ===============================

async function init() {

  try {

    await Promise.all([
      cargarUsuarios(),
      cargarCarreras(),
      cargarNiveles(),
      cargarDocentes()
    ]);

    renderSelectCarreras();
    renderSelectNiveles();
    renderSelectFiltroCarreras();

    renderStats();
    renderTabla();

  } catch (error) {

    console.error(error);

    showToast(
      "Error al cargar datos",
      "error"
    );

  }

}

// ===============================
// USUARIOS
// ===============================

async function cargarUsuarios() {

  const lista =
    await obtenerUsuarios();

  usuarios = {};

  lista
    .filter(
      u => u.rol === "docente"
    )
    .forEach(u => {

      usuarios[u.id] = u;

    });

}

// ===============================
// CARRERAS
// ===============================

async function cargarCarreras() {

  const lista =
    await obtenerCarreras();

  carreras = {};

  lista.forEach(c => {

    carreras[c.id] = c;

  });

}

// ===============================
// NIVELES
// ===============================

async function cargarNiveles() {

  const lista =
    await obtenerNiveles();

  niveles = {};

  lista.forEach(n => {

    niveles[n.id] = n;

  });

}

// ===============================
// DOCENTES
// ===============================

async function cargarDocentes() {

  docentes =
    await obtenerDocentes();

}

// ===============================
// SELECT CARRERAS
// ===============================

function renderSelectCarreras() {

  const select =
    document.getElementById(
      "fCarrera"
    );

  select.innerHTML = `
    <option value="">
      Seleccionar...
    </option>
  `;

  Object.values(carreras)
    .forEach(c => {

      select.innerHTML += `
        <option value="${c.id}">
          ${c.nombre}
        </option>
      `;

    });

}

// ===============================
// SELECT NIVELES
// ===============================

function renderSelectNiveles() {

  const select =
    document.getElementById(
      "fNivel"
    );

  select.innerHTML = `
    <option value="">
      Seleccionar...
    </option>
  `;

  Object.values(niveles)
    .forEach(n => {

      select.innerHTML += `
        <option value="${n.id}">
          ${n.nombre}
        </option>
      `;

    });

}

// ===============================
// FILTRO CARRERAS
// ===============================

function renderSelectFiltroCarreras() {

  const select =
    document.getElementById(
      "filtroCarrera"
    );

  select.innerHTML = `
    <option value="">
      Todas las carreras
    </option>
  `;

  Object.values(carreras)
    .forEach(c => {

      select.innerHTML += `
        <option value="${c.id}">
          ${c.nombre}
        </option>
      `;

    });

}

// ===============================
// TABLA
// ===============================

window.renderTabla =
  function () {

    const filtroCarrera =
      document.getElementById(
        "filtroCarrera"
      ).value;

    const data =
      docentes.filter(
        d =>
          !filtroCarrera ||
          d.carreraId === filtroCarrera
      );

    const tbody =
      document.getElementById(
        "tbodyDoc"
      );

    if (!data.length) {

      tbody.innerHTML = `
        <tr>
          <td
            colspan="8"
            style="
              text-align:center;
              padding:40px;
              color:var(--txt-muted)
            ">
            Sin docentes
          </td>
        </tr>
      `;

      return;

    }

    tbody.innerHTML =
      data.map((d, i) => {

        const u =
          usuarios[d.usuarioId] || {};

        const c =
          carreras[d.carreraId] || {};

        const n =
          niveles[d.nivelId] || {};

        const activo =
          u.estado !== false;

        return `
          <tr>

            <td
              style="
                color:var(--txt-muted)
              ">
              ${i + 1}
            </td>

            <td class="td-name">

              <div
                style="
                  display:flex;
                  align-items:center;
                  gap:10px
                ">

                <div
                  style="
                    width:32px;
                    height:32px;
                    border-radius:50%;
                    background:
                      linear-gradient(
                        135deg,
                        var(--accent-3),
                        var(--accent)
                      );
                    display:grid;
                    place-items:center;
                    font-weight:700;
                    font-size:12px;
                    color:#fff
                  ">

                  ${(u.nombre || "?")[0]}

                </div>

                <div>

                  <div>
                    ${u.nombre || "—"}
                    ${u.ap_paterno || ""}
                  </div>

                  <div
                    style="
                      font-size:11px;
                      color:var(--txt-muted)
                    ">

                    Docente

                  </div>

                </div>

              </div>

            </td>

            <td>
              <span
                style="
                  font-family:var(--mono)
                ">
                ${u.ci || "—"}
              </span>
            </td>

            <td>
              ${u.nro_celular || "—"}
            </td>

            <td>

              <span
                class="
                  role-badge
                  rb-dir
                ">

                ${c.sigla || "—"}

              </span>

              ${c.nombre || "—"}

            </td>

            <td>
              ${n.nombre || "—"}
            </td>

            <td>

              <span
                class="
                  status-dot
                  ${activo
                    ? "active"
                    : "inactive"}
                ">

                ${activo
                  ? "Activo"
                  : "Inactivo"}

              </span>

            </td>

            <td>

              <div
                style="
                  display:flex;
                  gap:6px
                ">

                <button
                  class="
                    btn
                    btn-ghost
                    btn-sm
                  "
                  onclick="
                    editarDocente(
                      '${d.id}'
                    )
                  ">

                  <i
                    class="
                      bi
                      bi-pencil-fill
                    ">
                  </i>

                </button>

                <button
                  class="
                    btn
                    btn-danger
                    btn-sm
                  "
                  onclick="
                    eliminar(
                      '${d.id}'
                    )
                  ">

                  <i
                    class="
                      bi
                      bi-trash-fill
                    ">
                  </i>

                </button>

              </div>

            </td>

          </tr>
        `;

      }).join("");

  };

// ===============================
// STATS
// ===============================

function renderStats() {

  document.getElementById(
    "totalDoc"
  ).textContent =
    docentes.length;

  document.getElementById(
    "carrerasDoc"
  ).textContent =
    new Set(
      docentes.map(
        d => d.carreraId
      )
    ).size;

  document.getElementById(
    "nivelesDoc"
  ).textContent =
    new Set(
      docentes.map(
        d => d.nivelId
      )
    ).size;

}

// ===============================
// ABRIR MODAL
// ===============================

window.abrirModal =
  function (id = null) {

    editId = id;

    document
      .getElementById(
        "modalTitulo"
      ).textContent =
      id
        ? "Editar Docente"
        : "Nuevo Docente";

    renderSelectUsuarios();

    if (id) {

      const docente =
        docentes.find(
          d => d.id === id
        );

      if (docente) {

        document.getElementById(
          "fUsuarioId"
        ).value =
          docente.usuarioId;

        document.getElementById(
          "fCarrera"
        ).value =
          docente.carreraId;

        document.getElementById(
          "fNivel"
        ).value =
          docente.nivelId;

      }

    } else {

      document.getElementById(
        "fUsuarioId"
      ).value = "";

      document.getElementById(
        "fCarrera"
      ).value = "";

      document.getElementById(
        "fNivel"
      ).value = "";

    }

    document
      .getElementById(
        "modalDocente"
      )
      .classList
      .add("show");

  };

// ===============================
// USUARIOS DOCENTES
// ===============================

function renderSelectUsuarios() {

  const select =
    document.getElementById(
      "fUsuarioId"
    );

  select.innerHTML = `
    <option value="">
      Seleccionar docente
    </option>
  `;

  Object.values(usuarios)
    .forEach(u => {

      select.innerHTML += `
        <option value="${u.id}">
          ${u.nombre}
          ${u.ap_paterno}
          (${u.usuario})
        </option>
      `;

    });

}

// ===============================
// CERRAR MODAL
// ===============================

window.cerrarModal =
  function () {

    document
      .getElementById(
        "modalDocente"
      )
      .classList
      .remove("show");

  };

// ===============================
// EDITAR
// ===============================

window.editarDocente =
  function (id) {

    abrirModal(id);

  };

// ===============================
// GUARDAR
// ===============================

window.guardar =
  async function () {

    try {

      const data = {

        usuarioId:
          document
            .getElementById(
              "fUsuarioId"
            )
            .value,

        carreraId:
          document
            .getElementById(
              "fCarrera"
            )
            .value,

        nivelId:
          document
            .getElementById(
              "fNivel"
            )
            .value

      };

      if (
        !data.usuarioId ||
        !data.carreraId ||
        !data.nivelId
      ) {

        showToast(
          "Completa todos los campos",
          "error"
        );

        return;

      }

      if (editId) {

        await actualizarDocente(
          editId,
          data
        );

        showToast(
          "Docente actualizado"
        );

      } else {

        await crearDocente(
          data
        );

        showToast(
          "Docente registrado"
        );

      }

      cerrarModal();

      await cargarDocentes();

      renderStats();

      renderTabla();

    } catch (error) {

      console.error(error);

      showToast(
        "Error al guardar",
        "error"
      );

    }

  };

// ===============================
// ELIMINAR
// ===============================

window.eliminar =
  async function (id) {

    if (
      !confirm(
        "¿Eliminar docente?"
      )
    ) return;

    try {

      await eliminarDocente(id);

      showToast(
        "Docente eliminado",
        "info"
      );

      await cargarDocentes();

      renderStats();

      renderTabla();

    } catch (error) {

      console.error(error);

      showToast(
        "Error al eliminar",
        "error"
      );

    }

  };