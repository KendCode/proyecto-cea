import {
    crearUsuario,
    obtenerUsuarios,
    eliminarUsuario,
    actualizarUsuario
}
from "../services/usuariosService.js";

// ==========================
// VARIABLES GLOBALES
// ==========================
let usuariosGlobal = [];

let modoEdicion = false;

let uidEditar = null;

let uidEliminar = null;

// ==========================
// ELEMENTOS
// ==========================
const btnGuardar =
    document.getElementById(
        "btnGuardarUsuario"
    );

const tbody =
    document.getElementById(
        "tbodyUsuarios"
    );

// ==========================
// GUARDAR USUARIO
// ==========================
btnGuardar.addEventListener(
    "click",
    async () => {

        const nombre =
            document.getElementById(
                "fNombre"
            ).value.trim();

        const apPat =
            document.getElementById(
                "fApPat"
            ).value.trim();

        const apMat =
            document.getElementById(
                "fApMat"
            ).value.trim();

        const ci =
            document.getElementById(
                "fCi"
            ).value.trim();

        const celular =
            document.getElementById(
                "fCelular"
            ).value.trim();

        const rol =
            document.getElementById(
                "fRol"
            ).value;

        const sexo =
            document.getElementById(
                "fSexo"
            ).value;

        const fechaNac =
            document.getElementById(
                "fFechaNac"
            ).value;

        const estado =
            document.getElementById(
                "fEstado"
            ).value === "true";

        // ==========================
        // VALIDACIONES
        // ==========================
        if (
            !nombre ||
            !apPat ||
            !ci ||
            !rol
        ) {

            Swal.fire({
                icon: "warning",
                title: "Campos requeridos",
                text: "Completa los campos obligatorios"
            });

            return;

        }

        // ==========================
        // GENERAR USUARIO
        // ==========================
        const primerNombre =
            nombre
                .split(" ")[0]
                .toLowerCase();

        const usuario =
            `${primerNombre}_${ci}`;

        // ==========================
        // GENERAR CORREO
        // ==========================
        const correo =
            `${usuario}@sistema.com`;

        // ==========================
        // PASSWORD
        // ==========================
        let password = "";

        if (fechaNac) {

            const partes =
                fechaNac.split("-");

            password =
                `${partes[2]}-${partes[1]}-${partes[0]}`;

        } else {

            password = ci;

        }

        // ==========================
        // OBJETO
        // ==========================
        const data = {

            usuario,

            nombre,

            ap_paterno: apPat,

            ap_materno: apMat,

            ci,

            correo,

            nro_celular: celular,

            rol,

            sexo,

            fecha_nac: fechaNac,

            estado,

            password

        };

        try {

            btnGuardar.disabled = true;

            btnGuardar.innerHTML =
                "Guardando...";

            // ==========================
            // CREAR
            // ==========================
            if (!modoEdicion) {

                await crearUsuario(data);

                Swal.fire({
                    icon: "success",
                    title: "Usuario creado",
                    timer: 1500,
                    showConfirmButton: false
                });

            }

            // ==========================
            // EDITAR
            // ==========================
            else {

                await actualizarUsuario(
                    uidEditar,
                    data
                );

                Swal.fire({
                    icon: "success",
                    title: "Usuario actualizado",
                    timer: 1500,
                    showConfirmButton: false
                });

            }

            limpiarFormulario();

            bootstrap.Modal
                .getInstance(
                    document.getElementById(
                        "modalUsuario"
                    )
                )
                .hide();

            cargarUsuarios();

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message
            });

        } finally {

            btnGuardar.disabled = false;

            btnGuardar.innerHTML =
                "Guardar Usuario";

        }

    }
);

// ==========================
// CARGAR USUARIOS
// ==========================
async function cargarUsuarios() {

    try {

        usuariosGlobal =
            await obtenerUsuarios();

        renderUsuarios();

        document.getElementById(
            "statTotal"
        ).textContent =
            usuariosGlobal.length;

        document.getElementById(
            "statDocentes"
        ).textContent =
            usuariosGlobal.filter(
                u => u.rol === "docente"
            ).length;

        document.getElementById(
            "statEstudiantes"
        ).textContent =
            usuariosGlobal.filter(
                u => u.rol === "estudiante"
            ).length;

        document.getElementById(
            "statInactivos"
        ).textContent =
            usuariosGlobal.filter(
                u => !u.estado
            ).length;

    } catch (error) {

        console.error(
            "Error al cargar usuarios",
            error
        );

    }

}

// ==========================
// RENDER TABLA
// ==========================
function renderUsuarios() {

    const texto =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();

    const rolFiltro =
        document.getElementById(
            "filterRol"
        ).value;

    const estadoFiltro =
        document.getElementById(
            "filterEstado"
        ).value;

    const usuariosFiltrados =
        usuariosGlobal.filter(usuario => {

            const coincideTexto =

                usuario.nombre
                    .toLowerCase()
                    .includes(texto)

                ||

                usuario.ci
                    .includes(texto);

            const coincideRol =

                !rolFiltro ||

                usuario.rol === rolFiltro;

            const coincideEstado =

                estadoFiltro === ""

                ||

                usuario.estado.toString()
                === estadoFiltro;

            return (
                coincideTexto &&
                coincideRol &&
                coincideEstado
            );

        });

    tbody.innerHTML = "";

    // ==========================
    // TABLA VACÍA
    // ==========================
    if (
        usuariosFiltrados.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7">

                    <div class="empty-state">

                        <i class="bi bi-people"></i>

                        <p>
                            No se encontraron usuarios
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;

    }

    // ==========================
    // TABLA
    // ==========================
    usuariosFiltrados.forEach(
        (
            usuario,
            index
        ) => {

            tbody.innerHTML += `
                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${usuario.nombre}
                        ${usuario.ap_paterno}
                        ${usuario.ap_materno || ""}
                    </td>

                    <td>
                        ${usuario.ci}
                    </td>

                    <td>
                        ${usuario.nro_celular || "-"}
                    </td>

                    <td>

                        <span class="
                            badge-rol
                            badge-${usuario.rol}
                        ">
                            ${usuario.rol}
                        </span>

                    </td>

                    <td>

                        <span class="
                            badge-estado
                            ${usuario.estado
                                ? "badge-activo"
                                : "badge-inactivo"
                            }
                        ">

                            ${usuario.estado
                                ? "Activo"
                                : "Inactivo"
                            }

                        </span>

                    </td>

                    <td>

                        <div class="action-btns">

                            <button
                                class="btn-action btn-edit"
                                onclick="editarUsuario('${usuario.uid}')"
                            >

                                <i class="bi bi-pencil-square"></i>

                            </button>

                            <button
                                class="btn-action btn-delete"
                                onclick="abrirEliminar('${usuario.uid}')"
                            >

                                <i class="bi bi-trash-fill"></i>

                            </button>

                        </div>

                    </td>

                </tr>
            `;

        });

    document.getElementById(
        "paginationInfo"
    ).textContent =
        `Mostrando ${usuariosFiltrados.length} de ${usuariosGlobal.length}`;

}

// ==========================
// EDITAR USUARIO
// ==========================
window.editarUsuario = (uid) => {

    const usuario =
        usuariosGlobal.find(
            u => u.uid === uid
        );

    if (!usuario) return;

    modoEdicion = true;

    uidEditar = uid;

    document.getElementById(
        "modalUsuarioTitle"
    ).textContent =
        "EDITAR USUARIO";

    document.getElementById(
        "fNombre"
    ).value =
        usuario.nombre;

    document.getElementById(
        "fApPat"
    ).value =
        usuario.ap_paterno;

    document.getElementById(
        "fApMat"
    ).value =
        usuario.ap_materno || "";

    document.getElementById(
        "fCi"
    ).value =
        usuario.ci;

    document.getElementById(
        "fCelular"
    ).value =
        usuario.nro_celular || "";

    document.getElementById(
        "fRol"
    ).value =
        usuario.rol;

    document.getElementById(
        "fSexo"
    ).value =
        usuario.sexo || "";

    document.getElementById(
        "fFechaNac"
    ).value =
        usuario.fecha_nac || "";

    document.getElementById(
        "fEstado"
    ).value =
        usuario.estado.toString();

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "modalUsuario"
            )
        );

    modal.show();

};

// ==========================
// ELIMINAR
// ==========================
window.abrirEliminar = (uid) => {

    uidEliminar = uid;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "modalEliminar"
            )
        );

    modal.show();

};

// ==========================
// CONFIRMAR ELIMINAR
// ==========================
document
    .getElementById(
        "btnConfirmarEliminar"
    )
    .addEventListener(
        "click",
        async () => {

            try {

                await eliminarUsuario(
                    uidEliminar
                );

                Swal.fire({
                    icon: "success",
                    title: "Usuario eliminado",
                    timer: 1500,
                    showConfirmButton: false
                });

                bootstrap.Modal
                    .getInstance(
                        document.getElementById(
                            "modalEliminar"
                        )
                    )
                    .hide();

                cargarUsuarios();

            } catch (error) {

                console.error(error);

            }

        }
    );

// ==========================
// LIMPIAR FORMULARIO
// ==========================
function limpiarFormulario() {

    modoEdicion = false;

    uidEditar = null;

    document.getElementById(
        "modalUsuarioTitle"
    ).textContent =
        "NUEVO USUARIO";

    document.getElementById(
        "fNombre"
    ).value = "";

    document.getElementById(
        "fApPat"
    ).value = "";

    document.getElementById(
        "fApMat"
    ).value = "";

    document.getElementById(
        "fCi"
    ).value = "";

    document.getElementById(
        "fCelular"
    ).value = "";

    document.getElementById(
        "fRol"
    ).value = "";

    document.getElementById(
        "fSexo"
    ).value = "";

    document.getElementById(
        "fFechaNac"
    ).value = "";

    document.getElementById(
        "fEstado"
    ).value = "true";

}

// ==========================
// FILTROS
// ==========================
document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        renderUsuarios
    );

document
    .getElementById(
        "filterRol"
    )
    .addEventListener(
        "change",
        renderUsuarios
    );

document
    .getElementById(
        "filterEstado"
    )
    .addEventListener(
        "change",
        renderUsuarios
    );

// ==========================
// INICIAR
// ==========================
cargarUsuarios();