import {

    obtenerCarreras,
    crearCarrera,
    editarCarrera,
    cambiarEstadoCarrera

}
from "../services/carrerasService.js";

// ==========================
// VARIABLES
// ==========================

let carreras = [];

// ==========================
// CARGAR DATOS
// ==========================

async function cargarDatos() {

    try {

        carreras =
            await obtenerCarreras();

        renderTabla();

        renderStats();

    } catch (error) {

        console.error(error);

    }

}

// ==========================
// TABLA
// ==========================

function renderTabla() {

    const tbody =
        document.getElementById(
            "tbodyCarreras"
        );

    tbody.innerHTML = "";

    if (carreras.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:40px;
                        color:var(--txt-muted)
                    ">

                    <i class="bi bi-inbox fs-2 d-block mb-2"></i>

                    No existen carreras registradas

                </td>

            </tr>

        `;

        return;

    }

    carreras.forEach(
        (
            carrera,
            index
        ) => {

            tbody.innerHTML += `

                <tr>

                    <td>

                        ${index + 1}

                    </td>

                    <td>

                        <div
                            style="
                                display:flex;
                                align-items:center;
                                gap:12px
                            ">

                            <div class="icon-wrap ic-blue">

                                <i class="bi bi-building"></i>

                            </div>

                            <div>

                                <div
                                    style="
                                        font-weight:700;
                                        color:var(--txt-primary)
                                    ">

                                    ${carrera.nombre}

                                </div>

                                <small
                                    style="
                                        color:var(--txt-muted)
                                    ">

                                    Carrera académica

                                </small>

                            </div>

                        </div>

                    </td>

                    <td>

                        <span class="badge badge-primary">

                            ${carrera.sigla}

                        </span>

                    </td>

                    <td>

                        <span class="
                            badge-status
                            ${carrera.estado
                                ? "active"
                                : "inactive"}
                        ">

                            ${carrera.estado
                                ? "Activo"
                                : "Inactivo"}

                        </span>

                    </td>

                    <td>

                        <div
                            style="
                                display:flex;
                                gap:8px;
                                justify-content:center
                            ">

                            <button
                                class="btn btn-sm btn-warning"
                                onclick="editar('${carrera.id}')">

                                <i class="bi bi-pencil-fill"></i>

                            </button>

                            <button
                                class="btn btn-sm btn-primary"
                                onclick="
                                    cambiarEstado(
                                        '${carrera.id}',
                                        ${carrera.estado}
                                    )
                                ">

                                <i class="bi bi-arrow-repeat"></i>

                            </button>

                        </div>

                    </td>

                </tr>

            `;

        });

}

// ==========================
// STATS
// ==========================

function renderStats() {

    document.getElementById(
        "totalCarreras"
    ).textContent =
        carreras.length;

    document.getElementById(
        "activas"
    ).textContent =
        carreras.filter(
            c => c.estado
        ).length;

    document.getElementById(
        "inactivas"
    ).textContent =
        carreras.filter(
            c => !c.estado
        ).length;

    document.getElementById(
        "siglasTotal"
    ).textContent =
        carreras.length;

}

// ==========================
// MODAL
// ==========================

window.abrirNuevo =
    function () {

        document.getElementById(
            "modalCarrera"
        ).style.display =
            "flex";

        document.getElementById(
            "tituloModal"
        ).textContent =
            "Nueva Carrera";

        document.getElementById(
            "idCarrera"
        ).value = "";

        document.getElementById(
            "fNombre"
        ).value = "";

        document.getElementById(
            "fSigla"
        ).value = "";

    };

// ==========================
// CERRAR MODAL
// ==========================

window.cerrarModal =
    function () {

        document.getElementById(
            "modalCarrera"
        ).style.display =
            "none";

    };

// ==========================
// EDITAR
// ==========================

window.editar =
    function (id) {

        const carrera =
            carreras.find(
                c => c.id === id
            );

        if (!carrera) return;

        document.getElementById(
            "modalCarrera"
        ).style.display =
            "flex";

        document.getElementById(
            "tituloModal"
        ).textContent =
            "Editar Carrera";

        document.getElementById(
            "idCarrera"
        ).value =
            carrera.id;

        document.getElementById(
            "fNombre"
        ).value =
            carrera.nombre;

        document.getElementById(
            "fSigla"
        ).value =
            carrera.sigla;

    };

// ==========================
// GUARDAR
// ==========================

window.guardarCarrera =
    async function () {

        const id =
            document.getElementById(
                "idCarrera"
            ).value;

        const nombre =
            document.getElementById(
                "fNombre"
            ).value
                .trim();

        const sigla =
            document.getElementById(
                "fSigla"
            ).value
                .trim()
                .toUpperCase();

        if (
            !nombre ||
            !sigla
        ) {

            alert(
                "Completa todos los campos"
            );

            return;

        }

        try {

            if (id) {

                await editarCarrera(
                    id,
                    {
                        nombre,
                        sigla
                    }
                );

            } else {

                await crearCarrera({
                    nombre,
                    sigla
                });

            }

            cerrarModal();

            cargarDatos();

        } catch (error) {

            console.error(error);

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

            await cambiarEstadoCarrera(
                id,
                estado
            );

            cargarDatos();

        } catch (error) {

            console.error(error);

        }

    };

// ==========================
// FILTRO
// ==========================

window.filtrarCarreras =
    function () {

        const texto =
            document.getElementById(
                "buscarCarrera"
            )
                .value
                .toLowerCase();

        const filas =
            document.querySelectorAll(
                "#tbodyCarreras tr"
            );

        filas.forEach(fila => {

            fila.style.display =
                fila.innerText
                    .toLowerCase()
                    .includes(texto)
                    ? ""
                    : "none";

        });

    };

// ==========================
// INIT
// ==========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarDatos();

    }
);