// controllers/HistorialController.js

import { auth }
    from "../firebase/auth.js";

import {
    onAuthStateChanged
}
    from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

    obtenerEstudiante,
    obtenerCalificaciones,
    obtenerModulos

}
    from "../services/EstudService.js";


onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            location.href =
                "../auth/login.html";

            return;

        }

        await cargarHistorial(
            user.uid
        );

    }
);


async function cargarHistorial(uid) {

    const est = await obtenerEstudiante(uid);

    if (!est) return;

    const notas = await obtenerCalificaciones(est.id);

    const modulos = await obtenerModulos(
        est.carreraId.id,
        est.nivelId.id
    );
    function calcularResumen(modulos, notas) {

        let suma = 0;
        let count = 0;

        let aprobados = 0;
        let reprobados = 0;
        let pendientes = 0;

        modulos.forEach(m => {

            const n = notas.find(x => x.moduloId === m.id);

            if (!n || n.nota === null || n.nota === undefined) {
                pendientes++;
                return;
            }

            const nota = Number(n.nota);

            suma += nota;
            count++;

            if (nota >= 51) {
                aprobados++;
            } else {
                reprobados++;
            }

        });

        const promedio = count > 0 ? (suma / count).toFixed(1) : "—";

        return {
            promedio,
            aprobados,
            reprobados,
            pendientes
        };
    }
    const resumen = calcularResumen(modulos, notas);

    // MOSTRAR BANNER
    document.getElementById("resumenBanner").style.display = "grid";

    document.getElementById("resPromedio").textContent = resumen.promedio;
    document.getElementById("resAprobados").textContent = resumen.aprobados;
    document.getElementById("resReprobados").textContent = resumen.reprobados;
    document.getElementById("resPendientes").textContent = resumen.pendientes;
    const container = document.getElementById("historialContainer");

    container.innerHTML = "";

    // =========================
    // ORDENAR MÓDULOS DEL 1 AL 5
    // =========================
    modulos.sort((a, b) => a.orden - b.orden);

    // =========================
    // SI NO HAY MÓDULOS
    // =========================
    if (!modulos || modulos.length === 0) {
        container.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            <i class="bi bi-journal-x"></i>
            <h3>Sin módulos</h3>
            <p>No existen módulos registrados</p>
          </div>
        </td>
      </tr>
    `;
        return;
    }

    // =========================
    // GENERAR TABLA (TODOS LOS MÓDULOS)
    // =========================

    modulos.forEach((m, i) => {

        // buscar nota del módulo
        const notaObj = notas.find(n => n.moduloId === m.id);

        const nota = notaObj ? notaObj.nota : null;

        let estado = "";
        let estadoClass = "";
        let notaClass = "";
        let icono = "";

        // =========================
        // SIN NOTA
        // =========================
        if (nota === null || nota === undefined) {

            estado = "Sin calificar";
            estadoClass = "estado-sin-nota";
            notaClass = "np-sin";
            icono = "bi-dash-circle";

        }

        // =========================
        // CON NOTA
        // =========================
        else if (nota >= 80) {
            estado = "Excelente";
            estadoClass = "estado-excelente";
            notaClass = "np-a";
            icono = "bi-stars";
        }

        else if (nota >= 51) {
            estado = "Aprobado";
            estadoClass = "estado-aprobado";
            notaClass = "np-b";
            icono = "bi-check-circle-fill";
        }

        else if (nota >= 40) {
            estado = "Regular";
            estadoClass = "estado-regular";
            notaClass = "np-c";
            icono = "bi-exclamation-circle-fill";
        }

        else {
            estado = "Reprobado";
            estadoClass = "estado-reprobado";
            notaClass = "np-r";
            icono = "bi-x-circle-fill";
        }

        // =========================
        // INSERTAR FILA
        // =========================

        container.innerHTML += `
      <tr class="fila-historial">

        <!-- NÚMERO DEL MÓDULO (1 AL 5) -->
        <td>
          <div class="numero-tabla">
            ${m.orden || (i + 1)}
          </div>
        </td>

        <!-- NOMBRE MÓDULO -->
        <td>
          <strong>${m.nombre}</strong>
        </td>

        <!-- NOTA -->
        <td>
          <span class="nota-pill ${notaClass}">
            ${nota !== null ? nota : "-"}
          </span>
        </td>

        <!-- ESTADO -->
        <td>
          <span class="estado-badge ${estadoClass}">
            <i class="bi ${icono}"></i>
            ${estado}
          </span>
        </td>

      </tr>
    `;
    });
}