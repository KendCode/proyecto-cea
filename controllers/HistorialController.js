// controllers/HistorialController.js

import { auth }
  from "../firebase/auth.js";

import {
  onAuthStateChanged,
  signOut
}
  from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

  obtenerEstudiante,
  obtenerNiveles,
  obtenerTodosModulos,
  obtenerTodasCalificaciones

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

  const nivelActualId =
    est.nivelId.id;

  const niveles =
    await obtenerNiveles();

  const nivelActual =
    niveles.find(
      n => n.id === nivelActualId
    );

  const modulos =
    await obtenerTodosModulos(
      carreraId
    );


  const notas =
    await obtenerTodasCalificaciones(
      est.id
    );



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

  niveles.forEach(nivel => {


    const modulosNivel =
      modulos.filter(
        m => m.nivelId === nivel.id
      );



    if (modulosNivel.length === 0)
      return;



    const estadoNivel =
      nivel.orden < nivelActual.orden
        ? "CURSADO"
        :
        nivel.orden === nivelActual.orden
          ? "ACTUAL"
          :
          "PROXIMO";



    container.innerHTML += `

<tr>

<td colspan="4">


<div class="nivel-card">


<div class="nivel-header"
onclick="toggleNivel('${nivel.id}', this)">


<div class="nivel-title">

<i class="bi bi-mortarboard-fill"></i>

${nivel.nombre}

</div>


<i class="bi bi-chevron-left icono-flecha"></i>


</div>



<div 
class="nivel-content"
id="nivel-${nivel.id}">


<table class="historial-table">


<thead>

<tr>

<th width="70">
#
</th>


<th>
Módulo
</th>


<th width="140">
Nota
</th>


<th width="180">
Estado
</th>


</tr>

</thead>



<tbody>

${modulosNivel.map((m, i) => {


      const notaObj =
        notas.find(
          n => n.moduloId === m.id
        );


      const nota =
        notaObj
          ? Number(notaObj.nota)
          : null;


      let estado;
      let estadoClass = "";
      let notaClass = "";
      let icono = "";


      if (estadoNivel === "CURSADO") {

        estado = "Cursado";
        estadoClass = "estado-cursado";
        notaClass = "nota-cursado";
        icono = "bi-check-circle";

      }

      else if (estadoNivel === "PROXIMO") {

        estado = "No iniciado";
        estadoClass = "estado-proximo";
        notaClass = "nota-proximo";
        icono = "bi-lock";

      }

      else if (nota === null) {

        estado = "Pendiente";
        estadoClass = "estado-pendiente";
        notaClass = "nota-pendiente";
        icono = "bi-clock";

      }

      else if (nota >= 51) {

        estado = "Aprobado";
        estadoClass = "estado-aprobado";
        notaClass = "nota-aprobado";
        icono = "bi-check-circle-fill";

      }

      else {

        estado = "Reprobado";
        estadoClass = "estado-reprobado";
        notaClass = "nota-reprobado";
        icono = "bi-x-circle-fill";

      }

      return `

<tr>

<td>
${i + 1}
</td>


<td>
${m.nombre}
</td>

<td class="centrado">

<span class="nota-resaltada ${notaClass}">
${nota !== null ? nota : "-"}

</span>

</td>

<td class="centrado">

<span class="estado-resaltado ${estadoClass}">
<i class="bi ${icono}"></i>
${estado}
</span>

</td>


</tr>

`;



    }).join("")}

</table>


</div>


</div>


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

  const modulosActuales =
    modulos.filter(
      m => m.nivelId === nivelActualId
    );


  const pendientes =
    modulosActuales.length -
    notasValidas.filter(
      n => modulosActuales.some(
        m => m.id === n.moduloId
      )
    ).length;


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


  // ==========================
  // CERRAR SESION
  // ==========================
  document
    .getElementById("btnLogout")
    .addEventListener(
      "click",
      async () => {

        const result =
          await Swal.fire({

            title:
              "¿Cerrar sesión?",

            text:
              "Tu sesión actual se cerrará.",

            icon:
              "question",

            showCancelButton:
              true,

            confirmButtonText:
              "Sí, cerrar",

            cancelButtonText:
              "Cancelar",

            confirmButtonColor:
              "#ef4444",

            cancelButtonColor:
              "#64748b",

            background:
              "#0f172a",

            color:
              "#fff"

          });

        // ==========================
        // CONFIRMAR
        // ==========================
        if (result.isConfirmed) {

          await signOut(auth);

          localStorage.removeItem(
            "usuario"
          );

          window.location.href =
            "../auth/login.html";

        }

      }
    );
}
