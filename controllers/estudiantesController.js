import {
    obtenerEstudiantes,
    obtenerUsuariosMapa,
    obtenerCarrerasMapa,
    obtenerNivelesMapa,
    obtenerUsuariosEstudiantes,
    crearEstudiante
}
    from "../services/estudiantesService.js";

// ==========================
// VARIABLES
// ==========================
let estudiantes = [];

let usuarios = {};

let carreras = {};

let niveles = {};

let usuariosEstudiantes = [];

// ==========================
// CARGAR DATOS
// ==========================
async function cargarDatos() {

    try {

        estudiantes =
            await obtenerEstudiantes();

        usuariosEstudiantes =
            await obtenerUsuariosEstudiantes();

        usuarios =
            await obtenerUsuariosMapa();

        carreras =
            await obtenerCarrerasMapa();

        niveles =
            await obtenerNivelesMapa();

        renderTabla();

        actualizarStats();

        cargarSelectEstudiantes();

        cargarSelectCarreras();

        cargarSelectNiveles();

    } catch (error) {

        console.error(error);

    }

}
// ==========================
// GUARDAR ESTUDIANTE
// ==========================
window.guardarEstudiante =
    async function () {

        const usuarioId =
            document.getElementById(
                "fUsuarioId"
            ).value;

        const carreraId =
            document.getElementById(
                "fCarrera"
            ).value;

        const nivelId =
            document.getElementById(
                "fNivel"
            ).value;

        const gestion =
            document.getElementById(
                "fGestion"
            ).value;

        if (
            !usuarioId ||
            !carreraId ||
            !nivelId ||
            !gestion
        ) {

            alert(
                "Completa todos los campos"
            );

            return;

        }

        try {

            await crearEstudiante({

                usuarioId,

                carreraId:
                    `carreras/${carreraId}`,

                nivelId:
                    `niveles/${nivelId}`,

                gestion

            });

            alert(
                "Estudiante asignado correctamente"
            );

            cerrarModal();

            cargarDatos();

        } catch (error) {

            console.error(error);

            alert(
                "Error al guardar"
            );

        }

    };
// ==========================
// TABLA
// ==========================
function renderTabla() {

    const tbody =
        document.getElementById(
            "tbodyEst"
        );

    tbody.innerHTML = "";

    if (estudiantes.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="9">
                    No hay estudiantes
                </td>
            </tr>
        `;

        return;

    }

    estudiantes.forEach(
        (
            est,
            index
        ) => {

            const usuario =
                usuarios[est.usuarioId] || {};

            const carrera =
                carreras[est.carreraId.id] || {};

            const nivel =
                niveles[est.nivelId.id] || {};

            tbody.innerHTML += `
                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${usuario.nombre || ""}
                        ${usuario.ap_paterno || ""}
                    </td>

                    <td>
                        ${usuario.ci || ""}
                    </td>

                    <td>
                        ${usuario.usuario || ""}
                    </td>

                    <td>
                        ${carrera.nombre || ""}
                    </td>

                    <td>
                        ${nivel.nombre || ""}
                    </td>

                    <td>
                        ${est.gestion}
                    </td>

                    <td>
                        ${usuario.estado
                    ? "Activo"
                    : "Inactivo"}
                    </td>


                </tr>
            `;

        });

}

// ==========================
// STATS
// ==========================
function actualizarStats() {

    document.getElementById(
        "totalEst"
    ).textContent =
        estudiantes.length;

    document.getElementById(
        "activos"
    ).textContent =
        estudiantes.filter(
            est =>
                usuarios[
                    est.usuarioId
                ]?.estado
        ).length;

    document.getElementById(
        "carreras"
    ).textContent =
        Object.keys(
            carreras
        ).length;

    document.getElementById(
        "niveles"
    ).textContent =
        Object.keys(
            niveles
        ).length;

}
function cargarCarrerasSelect() {

    const select =
        document.getElementById(
            "fCarrera"
        );

    select.innerHTML =
        `<option value="">
            Seleccionar carrera
        </option>`;

    Object.values(carreras)
        .forEach(carrera => {

            select.innerHTML += `
                <option value="${carrera.id}">
                    ${carrera.nombre}
                </option>
            `;

        });

}
function cargarNivelesSelect() {

    const select =
        document.getElementById(
            "fNivel"
        );

    select.innerHTML =
        `<option value="">
            Seleccionar nivel
        </option>`;

    Object.values(niveles)
        .forEach(nivel => {

            select.innerHTML += `
                <option value="${nivel.id}">
                    ${nivel.nombre}
                </option>
            `;

        });

}
// ==========================
// ABRIR MODAL
// ==========================
window.abrirModal = function () {

    document
        .getElementById(
            "modalEstudiante"
        )
        .classList.add(
            "show"
        );

};

// ==========================
// CERRAR MODAL
// ==========================
window.cerrarModal = function () {

    document
        .getElementById(
            "modalEstudiante"
        )
        .classList.remove(
            "show"
        );

};
// ==========================
// CARGAR SELECT ESTUDIANTES
// ==========================
function cargarSelectEstudiantes() {

    const select =
        document.getElementById(
            "fUsuarioId"
        );

    select.innerHTML = `
        <option value="">
            Seleccionar estudiante...
        </option>
    `;

    // ==========================
    // IDS YA ASIGNADOS
    // ==========================
    const asignados =
        estudiantes.map(
            est => est.usuarioId
        );

    // ==========================
    // SOLO NO ASIGNADOS
    // ==========================
    const disponibles =
        usuariosEstudiantes.filter(
            usuario =>
                !asignados.includes(
                    usuario.uid
                )
        );

    disponibles.forEach(usuario => {

        select.innerHTML += `
            <option value="${usuario.uid}">

                ${usuario.nombre}
                ${usuario.ap_paterno}

                - CI:
                ${usuario.ci}

            </option>
        `;

    });

}
// ==========================
// CARGAR SELECT CARRERAS
// ==========================
function cargarSelectCarreras() {

    const select =
        document.getElementById(
            "fCarrera"
        );

    select.innerHTML = `
        <option value="">
            Seleccionar carrera...
        </option>
    `;

    Object.values(carreras)
        .forEach(carrera => {

            select.innerHTML += `
                <option value="${carrera.id}">

                    ${carrera.nombre}

                </option>
            `;

        });

}

// ==========================
// CARGAR SELECT NIVELES
// ==========================
function cargarSelectNiveles() {

    const select =
        document.getElementById(
            "fNivel"
        );

    select.innerHTML = `
        <option value="">
            Seleccionar nivel...
        </option>
    `;

    Object.values(niveles)
        .forEach(nivel => {

            select.innerHTML += `
                <option value="${nivel.id}">

                    ${nivel.nombre}

                </option>
            `;

        });

}


// ==========================
// INICIAR
// ==========================
cargarDatos();