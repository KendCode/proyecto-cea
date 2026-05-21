import {

  obtenerNiveles,
  crearNivel,
  actualizarNivel,
  cambiarEstadoNivel

}
from "../services/nivelesService.js";

// ==========================
// VARIABLES
// ==========================

let niveles = [];

// ==========================
// INIT
// ==========================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    await cargarNiveles();

  }
);

// ==========================
// CARGAR DATOS
// ==========================

async function cargarNiveles() {

  try {

    niveles =
      await obtenerNiveles();

    renderTabla();

    renderStats();

  } catch (error) {

    console.error(error);

    showToast(
      "Error al cargar niveles",
      "error"
    );

  }

}

// ==========================
// RENDER TABLA
// ==========================

window.renderTabla =
  function () {

    const tbody =
      document.getElementById(
        "tbodyNiveles"
      );

    if (
      niveles.length === 0
    ) {

      tbody.innerHTML = `

        <tr>

          <td
            colspan="6"
            style="
              text-align:center;
              padding:40px;
              color:var(--txt-muted)
            ">

            No existen niveles registrados

          </td>

        </tr>

      `;

      return;

    }

    tbody.innerHTML =
      niveles.map(
        (
          nivel,
          index
        ) => `

        <tr>

          <td>

            ${index + 1}

          </td>

          <td class="td-name">

            ${nivel.nombre}

          </td>

          <td>

            <span class="role-badge rb-dir">

              ${nivel.sigla}

            </span>

          </td>

          <td>

            ${nivel.orden}

          </td>

          <td>

            <span class="
              status-dot
              ${nivel.estado
                ? "active"
                : "inactive"}
            ">

              ${nivel.estado
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
                class="btn btn-ghost btn-sm"
                onclick="editarNivel('${nivel.id}')">

                <i class="bi bi-pencil-fill"></i>

              </button>

              <button
                class="btn btn-danger btn-sm"
                onclick="
                  cambiarEstado(
                    '${nivel.id}',
                    ${nivel.estado}
                  )
                ">

                <i class="bi bi-arrow-repeat"></i>

              </button>

            </div>

          </td>

        </tr>

      `
      ).join("");

  };

// ==========================
// STATS
// ==========================

function renderStats() {

  document.getElementById(
    "totalNiveles"
  ).textContent =
    niveles.length;

  document.getElementById(
    "nivelesActivos"
  ).textContent =
    niveles.filter(
      n => n.estado
    ).length;

}

// ==========================
// ABRIR MODAL
// ==========================

window.abrirModal =
  function (
    id = null
  ) {

    document.getElementById(
      "modalNivel"
    ).classList.add(
      "show"
    );

    if (id) {

      const nivel =
        niveles.find(
          n => n.id === id
        );

      if (!nivel) return;

      document.getElementById(
        "modalTitulo"
      ).textContent =
        "Editar Nivel";

      document.getElementById(
        "editId"
      ).value =
        nivel.id;

      document.getElementById(
        "fNombre"
      ).value =
        nivel.nombre;

      document.getElementById(
        "fSigla"
      ).value =
        nivel.sigla;

      document.getElementById(
        "fOrden"
      ).value =
        nivel.orden;

      document.getElementById(
        "fEstado"
      ).value =
        nivel.estado;

    } else {

      document.getElementById(
        "modalTitulo"
      ).textContent =
        "Nuevo Nivel";

      document.getElementById(
        "editId"
      ).value = "";

      document.getElementById(
        "fNombre"
      ).value = "";

      document.getElementById(
        "fSigla"
      ).value = "";

      document.getElementById(
        "fOrden"
      ).value = "";

      document.getElementById(
        "fEstado"
      ).value = "true";

    }

  };

// ==========================
// CERRAR MODAL
// ==========================

window.cerrarModal =
  function () {

    document.getElementById(
      "modalNivel"
    ).classList.remove(
      "show"
    );

  };

// ==========================
// EDITAR
// ==========================

window.editarNivel =
  function (id) {

    abrirModal(id);

  };

// ==========================
// GUARDAR
// ==========================

window.guardarNivel =
  async function () {

    try {

      const id =
        document.getElementById(
          "editId"
        ).value;

      const nombre =
        document.getElementById(
          "fNombre"
        ).value.trim();

      const sigla =
        document.getElementById(
          "fSigla"
        ).value
          .trim()
          .toUpperCase();

      const orden =
        parseInt(
          document.getElementById(
            "fOrden"
          ).value
        );

      const estado =
        document.getElementById(
          "fEstado"
        ).value === "true";

      if (
        !nombre ||
        !sigla ||
        !orden
      ) {

        showToast(
          "Completa todos los campos",
          "error"
        );

        return;

      }

      const data = {

        nombre,
        sigla,
        orden,
        estado

      };

      if (id) {

        await actualizarNivel(
          id,
          data
        );

        showToast(
          "Nivel actualizado"
        );

      } else {

        await crearNivel(
          data
        );

        showToast(
          "Nivel creado"
        );

      }

      cerrarModal();

      await cargarNiveles();

    } catch (error) {

      console.error(error);

      showToast(
        "Error al guardar",
        "error"
      );

    }

  };

// ==========================
// CAMBIAR ESTADO
// ==========================

window.cambiarEstado =
  async function (
    id,
    estado
  ) {

    try {

      await cambiarEstadoNivel(
        id,
        estado
      );

      await cargarNiveles();

      showToast(
        "Estado actualizado",
        "info"
      );

    } catch (error) {

      console.error(error);

      showToast(
        "Error al cambiar estado",
        "error"
      );

    }

  };