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

  const est =
    await obtenerEstudiante(uid);

  if (!est) return;

  const carreraId =
    est.carreraId.id;

  const nivelId =
    est.nivelId.id;

  const modulos =
    await obtenerModulos(
      carreraId,
      nivelId
    );

  const notas =
    await obtenerCalificaciones(est.id);

  const container =
    document.getElementById(
      "historialContainer"
    );

  container.innerHTML = "";

  if (!modulos.length) {

    container.innerHTML = `
      <tr>
        <td colspan="4">
          No hay módulos asignados
        </td>
      </tr>
    `;

    return;

  }

  modulos.sort(
    (a, b) => a.orden - b.orden
  );

  modulos.forEach((m, i) => {

    const notaObj =
      notas.find(
        n => n.moduloId === m.id
      );

    const nota =
      notaObj
        ? Number(notaObj.nota)
        : null;

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

        <td>
          ${m.orden || i + 1}
        </td>

        <td>
          ${m.nombre}
        </td>

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
  // =========================
  // RESUMEN GENERAL
  // =========================

  const notasValidas =
    notas.filter(
      n => n.nota !== undefined
    );

  let promedio = 0;

  if (notasValidas.length > 0) {

    const total =
      notasValidas.reduce(
        (acc, n) =>
          acc + Number(n.nota),
        0
      );

    promedio =
      (
        total /
        notasValidas.length
      ).toFixed(1);

  }

  const aprobados =
    notasValidas.filter(
      n => Number(n.nota) >= 51
    ).length;

  const reprobados =
    notasValidas.filter(
      n => Number(n.nota) < 51
    ).length;

  const pendientes =
    modulos.length -
    notasValidas.length;


  // =========================
  // INSERTAR EN HTML
  // =========================

  document.getElementById(
    "resPromedio"
  ).textContent = promedio;

  document.getElementById(
    "resAprobados"
  ).textContent = aprobados;

  document.getElementById(
    "resReprobados"
  ).textContent = reprobados;

  document.getElementById(
    "resPendientes"
  ).textContent = pendientes;


  // =========================
  // MOSTRAR BANNER
  // =========================

  document.getElementById(
    "resumenBanner"
  ).style.display = "grid";
}