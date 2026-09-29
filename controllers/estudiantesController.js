import {
    obtenerEstudiantes,
    obtenerUsuariosMapa,
    obtenerCarrerasMapa,
    obtenerNivelesMapa,
    obtenerUsuariosEstudiantes,
    crearEstudiante,
    actualizarEstudiante,
    eliminarEstudiante
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

// ID del estudiante que se está editando / eliminando
let estudianteEditandoId = null;
let estudianteEliminarId = null;

// ==========================
// CARGAR DATOS
// ==========================
async function cargarDatos() {

    try {

        estudiantes = await obtenerEstudiantes();
        usuariosEstudiantes = await obtenerUsuariosEstudiantes();
        usuarios = await obtenerUsuariosMapa();
        carreras = await obtenerCarrerasMapa();
        niveles = await obtenerNivelesMapa();

        // Primero los selects (los filtros conservan su valor actual)
        cargarSelectEstudiantes();
        cargarSelectCarreras();
        cargarSelectNiveles();
        cargarFiltroCarreras();
        cargarFiltroNiveles();

        // Luego la tabla respetando los filtros activos
        filtrarTabla();
        actualizarStats();

    } catch (error) {

        console.error(error);

    }

}

// ==========================
// GUARDAR ESTUDIANTE (CREAR / EDITAR)
// ==========================
window.guardarEstudiante = async function () {

    const usuarioId = document.getElementById("fUsuarioId").value;
    const carreraId = document.getElementById("fCarrera").value;
    const nivelId = document.getElementById("fNivel").value;
    const gestion = document.getElementById("fGestion").value.trim();

    if (!usuarioId || !carreraId || !nivelId || !gestion) {
        alert("Completa todos los campos");
        return;
    }

    try {

        if (estudianteEditandoId) {

            await actualizarEstudiante(estudianteEditandoId, {
                carreraId: `carreras/${carreraId}`,
                nivelId: `niveles/${nivelId}`,
                gestion
            });

            alert("Estudiante actualizado correctamente");

        } else {

            await crearEstudiante({
                usuarioId,
                carreraId: `carreras/${carreraId}`,
                nivelId: `niveles/${nivelId}`,
                gestion
            });

            alert("Estudiante asignado correctamente");

        }

        cerrarModal();
        cargarDatos();

    } catch (error) {

        console.error(error);
        alert("Error al guardar");

    }

};

// ==========================
// TABLA
// ==========================
function renderTabla(lista = estudiantes) {

    const tbody = document.getElementById("tbodyEst");

    if (lista.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;padding:30px;color:var(--txt-muted)">
                    No hay estudiantes
                </td>
            </tr>`;

        return;

    }

    tbody.innerHTML = lista.map((est, index) => {

        const usuario = usuarios[est.usuarioId] || {};
        const carrera = carreras[est.carreraId?.id] || {};
        const nivel = niveles[est.nivelId?.id] || {};

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${usuario.nombre || ""} ${usuario.ap_paterno || ""}</td>
                <td>${usuario.ci || ""}</td>
                <td>${usuario.usuario || ""}</td>
                <td>${carrera.nombre || ""}</td>
                <td>${nivel.nombre || ""}</td>
                <td>${est.gestion}</td>
                <td>${usuario.estado ? "Activo" : "Inactivo"}</td>
                <td>
                    <div style="display:flex;gap:6px">
                        <button class="btn btn-ghost" title="Editar"
                            onclick="editarEstudiante('${est.id}')">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-ghost" title="Eliminar" style="color:#ef4444"
                            onclick="abrirModalEliminar('${est.id}')">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </td>
            </tr>`;

    }).join("");

}

// ==========================
// STATS
// ==========================
function actualizarStats() {

    document.getElementById("totalEst").textContent = estudiantes.length;

    document.getElementById("activos").textContent =
        estudiantes.filter(est => usuarios[est.usuarioId]?.estado).length;

    document.getElementById("carreras").textContent =
        Object.keys(carreras).length;

    document.getElementById("niveles").textContent =
        Object.keys(niveles).length;

}

// ==========================
// FILTRAR TABLA
// ==========================
window.filtrarTabla = function () {

    const carreraFiltro = document.getElementById("filtroCarrera").value;
    const nivelFiltro = document.getElementById("filtroNivel").value;
    const gestionFiltro = document.getElementById("filtroGestion").value;

    const filtrados = estudiantes.filter(est =>
        (!carreraFiltro || est.carreraId?.id === carreraFiltro) &&
        (!nivelFiltro || est.nivelId?.id === nivelFiltro) &&
        (!gestionFiltro || est.gestion === gestionFiltro)
    );

    renderTabla(filtrados);

};

// ==========================
// ABRIR MODAL (NUEVO)
// ==========================
window.abrirModal = function () {

    estudianteEditandoId = null;

    document.getElementById("modalTitulo").textContent = "Nuevo Estudiante";

    cargarSelectEstudiantes();
    document.getElementById("fUsuarioId").disabled = false;
    document.getElementById("fCarrera").value = "";
    document.getElementById("fNivel").value = "";
    document.getElementById("fGestion").value = "2026";

    document.getElementById("modalEstudiante").classList.add("show");

};

// ==========================
// ABRIR MODAL (EDITAR)
// ==========================
window.editarEstudiante = function (id) {

    const est = estudiantes.find(e => e.id === id);
    if (!est) return;

    estudianteEditandoId = id;

    document.getElementById("modalTitulo").textContent = "Editar Estudiante";

    // El usuario no se puede cambiar: solo se muestra el actual
    const usuario = usuarios[est.usuarioId] || {};
    const selectUsuario = document.getElementById("fUsuarioId");

    selectUsuario.innerHTML = `
        <option value="${est.usuarioId}">
            ${usuario.nombre || ""} ${usuario.ap_paterno || ""} - CI: ${usuario.ci || ""}
        </option>`;
    selectUsuario.value = est.usuarioId;
    selectUsuario.disabled = true;

    document.getElementById("fCarrera").value = est.carreraId?.id || "";
    document.getElementById("fNivel").value = est.nivelId?.id || "";
    document.getElementById("fGestion").value = est.gestion;

    document.getElementById("modalEstudiante").classList.add("show");

};

// ==========================
// CERRAR MODAL
// ==========================
window.cerrarModal = function () {

    document.getElementById("modalEstudiante").classList.remove("show");
    document.getElementById("fUsuarioId").disabled = false;
    estudianteEditandoId = null;

};

// ==========================
// ELIMINAR
// ==========================
window.abrirModalEliminar = function (id) {

    const est = estudiantes.find(e => e.id === id);
    if (!est) return;

    const usuario = usuarios[est.usuarioId] || {};

    estudianteEliminarId = id;

    document.getElementById("nombreEliminar").textContent =
        `${usuario.nombre || ""} ${usuario.ap_paterno || ""}`;

    document.getElementById("modalEliminar").classList.add("show");

};

window.cerrarModalEliminar = function () {

    document.getElementById("modalEliminar").classList.remove("show");
    estudianteEliminarId = null;

};

window.confirmarEliminar = async function () {

    if (!estudianteEliminarId) return;

    try {

        await eliminarEstudiante(estudianteEliminarId);
        cerrarModalEliminar();
        cargarDatos();

    } catch (error) {

        console.error(error);
        alert("Error al eliminar");

    }

};

// ==========================
// SELECT: USUARIOS DISPONIBLES
// ==========================
function cargarSelectEstudiantes() {

    const select = document.getElementById("fUsuarioId");

    // IDs ya asignados
    const asignados = estudiantes.map(est => est.usuarioId);

    // Solo usuarios estudiantes que aún no tienen asignación
    const disponibles = usuariosEstudiantes.filter(
        usuario => !asignados.includes(usuario.uid)
    );

    select.innerHTML = `<option value="">Seleccionar estudiante...</option>`;

    disponibles.forEach(usuario => {

        select.innerHTML += `
            <option value="${usuario.uid}">
                ${usuario.nombre} ${usuario.ap_paterno} - CI: ${usuario.ci}
            </option>`;

    });

}

// ==========================
// SELECT: CARRERAS (MODAL)
// ==========================
function cargarSelectCarreras() {

    const select = document.getElementById("fCarrera");

    select.innerHTML = `<option value="">Seleccionar carrera...</option>`;

    Object.values(carreras).forEach(carrera => {

        select.innerHTML += `
            <option value="${carrera.id}">${carrera.nombre}</option>`;

    });

}

// ==========================
// SELECT: NIVELES (MODAL)
// ==========================
function cargarSelectNiveles() {

    const select = document.getElementById("fNivel");

    select.innerHTML = `<option value="">Seleccionar nivel...</option>`;

    Object.values(niveles).forEach(nivel => {

        select.innerHTML += `
            <option value="${nivel.id}">${nivel.nombre}</option>`;

    });

}

// ==========================
// FILTRO: CARRERAS
// ==========================
function cargarFiltroCarreras() {

    const select = document.getElementById("filtroCarrera");
    const valorActual = select.value;

    select.innerHTML = `<option value="">Todas las carreras</option>`;

    Object.values(carreras).forEach(carrera => {

        select.innerHTML += `
            <option value="${carrera.id}">${carrera.nombre}</option>`;

    });

    select.value = valorActual;

}

// ==========================
// FILTRO: NIVELES
// ==========================
function cargarFiltroNiveles() {

    const select = document.getElementById("filtroNivel");
    const valorActual = select.value;

    select.innerHTML = `<option value="">Todos los niveles</option>`;

    Object.values(niveles).forEach(nivel => {

        select.innerHTML += `
            <option value="${nivel.id}">${nivel.nombre}</option>`;

    });

    select.value = valorActual;

}

// ==========================
// INICIAR
// ==========================
cargarDatos();