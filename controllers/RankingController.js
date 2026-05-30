import {
  obtenerEstudiante,
  obtenerEstudiantesPorCarreraNivel,
  obtenerCalificacionesPorEstudiante,
  obtenerUsuario
} from "../services/EstudService.js";

import { auth } from "../firebase/auth.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const rankingList =
  document.getElementById("rankingList");

const podium =
  document.getElementById("podiumContainer");

function getId(ref) {

  if (!ref) return null;

  if (typeof ref === "string") {

    return ref.includes("/")
      ? ref.split("/").pop()
      : ref;
  }

  return ref.id;
}

async function cargarRanking(uid) {

  try {

    // ESTUDIANTE LOGUEADO
    const estudiante =
      await obtenerEstudiante(uid);

    if (!estudiante) {

      rankingList.innerHTML =
        "<p>No existe estudiante</p>";

      return;
    }

    const carreraId =
      getId(estudiante.carreraId);

    const nivelId =
      getId(estudiante.nivelId);

    // TODOS LOS ESTUDIANTES DEL MISMO NIVEL
    const estudiantes =
      await obtenerEstudiantesPorCarreraNivel(
        carreraId,
        nivelId
      );

    const ranking = [];

    for (const est of estudiantes) {

      const notas =
        await obtenerCalificacionesPorEstudiante(
          est.id
        );

      let total = 0;

      notas.forEach(n => {
        total += Number(n.nota || 0);
      });

      const usuario =
        await obtenerUsuario(
          est.usuarioId
        );

      ranking.push({

        nombre: usuario
          ? `${usuario.nombre} ${usuario.ap_paterno}`
          : "Sin nombre",

        total,

        cantidad: notas.length,

        promedio:
          notas.length > 0
            ? (total / notas.length).toFixed(1)
            : 0,

        porcentaje:
          ((total / 500) * 100).toFixed(1)

      });
    }

    // ORDENAR
    ranking.sort(
      (a, b) => b.total - a.total
    );

    // TOP 3
    const primero = ranking[0];
    const segundo = ranking[1];
    const tercero = ranking[2];

    podium.innerHTML = `

      <div class="podium-card podium-2">
        <span class="podium-medal">🥈</span>
        <div class="podium-name">
          ${segundo?.nombre || "-"}
        </div>
        <div class="podium-pts">
          ${segundo?.total || 0} pts
        </div>
      </div>

      <div class="podium-card podium-1">
        <span class="podium-medal">🥇</span>
        <div class="podium-name">
          ${primero?.nombre || "-"}
        </div>
        <div class="podium-pts">
          ${primero?.total || 0} pts
        </div>
      </div>

      <div class="podium-card podium-3">
        <span class="podium-medal">🥉</span>
        <div class="podium-name">
          ${tercero?.nombre || "-"}
        </div>
        <div class="podium-pts">
          ${tercero?.total || 0} pts
        </div>
      </div>

    `;

    // LISTA
    rankingList.innerHTML = "";

    ranking.forEach((item, index) => {

      rankingList.innerHTML += `

        <div class="rank-row">

          <div style="width:40px">
            ${index + 1}
          </div>

          <div style="flex:1">
            ${item.nombre}
          </div>

          <div style="min-width:180px">
            Promedio:
            ${item.promedio}
          </div>

          <div style="width:80px;text-align:right">
            ${item.total}
          </div>

        </div>

      `;
    });

  }

  catch (error) {

    console.error(
      "Error ranking:",
      error
    );
  }
}

onAuthStateChanged(
  auth,
  (user) => {

    if (!user) {

      window.location.href =
        "../auth/login.html";

      return;
    }

    cargarRanking(user.uid);
  }
);