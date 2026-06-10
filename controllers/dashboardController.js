import { obtenerUsuarios } from "../services/usuariosService.js";

document.addEventListener("DOMContentLoaded", async () => {
    await cargarDashboard();
});

async function cargarDashboard() {

    try {

        const usuarios = await obtenerUsuarios();

        // Total usuarios
        document.getElementById("statTotal").textContent =
            usuarios.length;

        // Estudiantes
        document.getElementById("statEstudiantes").textContent =
            usuarios.filter(
                u => u.rol === "estudiante"
            ).length;

        // Docentes
        document.getElementById("statDocentes").textContent =
            usuarios.filter(
                u => u.rol === "docente"
            ).length;

        // Usuarios recientes
        cargarUsuariosRecientes(usuarios);

    } catch (error) {

        console.error(error);

    }

}

function cargarUsuariosRecientes(usuarios) {

    const tbody =
        document.querySelector(
            ".data-table tbody"
        );

    if (!tbody) return;

    tbody.innerHTML = "";

    usuarios
        .slice(0, 5)
        .forEach(usuario => {

            tbody.innerHTML += `
                <tr>

                    <td>
                        <code>
                            ${usuario.usuario}
                        </code>
                    </td>

                    <td class="td-name">
                        ${usuario.nombre}
                        ${usuario.ap_paterno || ""}
                    </td>

                    <td>
                        <span class="role-badge">
                            ${usuario.rol}
                        </span>
                    </td>

                    <td>
                        ${usuario.ci}
                    </td>

                    <td>
                        <span class="
                            status-dot
                            ${usuario.estado ? "active" : "inactive"}
                        ">
                            ${usuario.estado ? "Activo" : "Inactivo"}
                        </span>
                    </td>

                    <td>
                        <i class="bi bi-three-dots"></i>
                    </td>

                </tr>
            `;

        });

}