import { obtenerRanking } from "../services/EstudService.js";



const rankingList = document.getElementById("rankingList");

async function cargarRanking() {

  try {

    const rankingList = document.getElementById("rankingList");
    const podium = document.getElementById("podiumContainer");

    const data = await obtenerRanking();

    if (!data || data.length === 0) {
      rankingList.innerHTML = "No hay datos";
      return;
    }

    // 🔥 ORDENAR (IMPORTANTE)
    data.sort((a, b) => b.porcentaje - a.porcentaje);

    const top3 = data.slice(0, 3);

    const [first, second, third] = top3;

    // 🔥 PODIUM seguro
    if (podium) {
      podium.innerHTML = `
        <div class="podium-card podium-2">
          <div>${second?.nombre || "-"}</div>
          <div>${second?.porcentaje || 0}%</div>
        </div>

        <div class="podium-card podium-1">
          <div>${first?.nombre || "-"}</div>
          <div>${first?.porcentaje || 0}%</div>
        </div>

        <div class="podium-card podium-3">
          <div>${third?.nombre || "-"}</div>
          <div>${third?.porcentaje || 0}%</div>
        </div>
      `;
    }

    // 🔥 LISTA
    rankingList.innerHTML = top3.map((e, i) => `
      <div class="rank-row">
        <div>${i + 1}</div>
        <div>${e.nombre}</div>
        <div>${e.porcentaje}%</div>
        <div>${e.sumatoria}</div>
      </div>
    `).join("");

  } catch (error) {
    console.error("Error ranking:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarRanking);

