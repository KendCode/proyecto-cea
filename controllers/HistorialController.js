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

function getId(ref) {
  if (!ref) return null;
  return ref.includes("/") ? ref.split("/").pop() : ref;
}

async function cargarHistorial(uid) {

  const est = await obtenerEstudiante(uid);
  if (!est) return;

  const carreraId = est.carrera.includes("/")
    ? est.carrera.split("/").pop()
    : est.carrera;

  const nivelId = est.nivel.includes("/")
    ? est.nivel.split("/").pop()
    : est.nivel;

  const modulos = await obtenerModulos(carreraId, nivelId);
  const notas = await obtenerCalificaciones(est.id);

  const container = document.getElementById("historialContainer");
  container.innerHTML = "";

  if (!modulos.length) {
    container.innerHTML = `
      <tr>
        <td colspan="4">No hay módulos asignados</td>
      </tr>
    `;
    return;
  }

  modulos.sort((a, b) => a.orden - b.orden);

  modulos.forEach((m, i) => {

    const notaObj = notas.find(n => n.moduloId === m.id);
    const nota = notaObj ? Number(notaObj.nota) : null;

    let estado = "";
    let estadoClass = "";
    let notaClass = "";
    let icono = "";

    if (nota === null) {
      estado = "Sin calificar";
      estadoClass = "estado-sin-nota";
      notaClass = "np-sin";
      icono = "bi-dash-circle";
    }

    else if (nota >= 51) {
      estado = "Aprobado";
      estadoClass = "estado-aprobado";
      notaClass = "np-b";
      icono = "bi-check-circle-fill";
    }

    else {
      estado = "Reprobado";
      estadoClass = "estado-reprobado";
      notaClass = "np-r";
      icono = "bi-x-circle-fill";
    }

    container.innerHTML += `
      <tr>

        <td>${m.orden || i + 1}</td>

        <td>${m.nombre}</td>

        <td>
          <span class="nota-pill ${notaClass}">
            ${nota !== null ? nota : "-"}
          </span>
        </td>

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