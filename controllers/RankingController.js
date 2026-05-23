import {
  obtenerRanking,
  obtenerDatosEstudiante
} from "../services/EstudService.js";

import {
  auth
} from "../firebase/auth.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const rankingList =
  document.getElementById("rankingList");

const podium =
  document.getElementById("podiumContainer");


// 🔥 CARGAR RANKING
async function cargarRanking(uid) {

  try {

    // 🔥 DATOS DEL ESTUDIANTE
    const estudiante =
      await obtenerDatosEstudiante(uid);

    if (!estudiante) {

      rankingList.innerHTML =
        "No existe estudiante";

      return;
    }

    // 🔥 CARRERA Y NIVEL
    const carreraId =
      estudiante.carreraId;

    const nivelId =
      estudiante.nivelId;

    // 🔥 TODOS LOS DATOS
    const data =
      await obtenerRanking();

    // 🔥 FILTRAR
    const filtrados =
      data.filter(est =>

        est.carreraId === carreraId &&
        est.nivelId === nivelId

      );

    // 🔥 ORDENAR
    filtrados.sort((a, b) =>

      b.sumatoria - a.sumatoria

    );

    // 🔥 TOP 3
    const top3 =
      filtrados.slice(0, 3);

    const [first, second, third] =
      top3;

    // 🔥 PODIUM
    podium.innerHTML = `
    
      <div class="podium-card podium-2">
        <div>${second?.nombre || "-"}</div>
        <div>${second?.sumatoria || 0}</div>
      </div>

      <div class="podium-card podium-1">
        <div>${first?.nombre || "-"}</div>
        <div>${first?.sumatoria || 0}</div>
      </div>

      <div class="podium-card podium-3">
        <div>${third?.nombre || "-"}</div>
        <div>${third?.sumatoria || 0}</div>
      </div>

    `;

    // 🔥 LISTA
    rankingList.innerHTML =
      filtrados.map((e, i) => `
      
        <div class="rank-row">

          <div>${i + 1}</div>

          <div>${e.nombre}</div>

          <div>${e.sumatoria} pts</div>

          <div>${e.porcentaje}%</div>

        </div>
      
      `).join("");

  } catch (error) {

    console.error(
      "Error ranking:",
      error
    );

  }
}


// 🔥 ESPERAR LOGIN
onAuthStateChanged(auth, (user) => {

  if (user) {

    cargarRanking(user.uid);

  } else {

    console.log(
      "No hay sesión"
    );

    window.location.href =
      "../../index.html";
  }

});