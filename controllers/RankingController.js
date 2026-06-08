import {
  obtenerEstudiante,
  obtenerEstudiantesPorCarreraNivel,
  obtenerCalificacionesPorEstudiante,
  obtenerUsuario
} from "../services/EstudService.js";

import { auth } from "../firebase/auth.js";

import {
  onAuthStateChanged,
  signOut
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

          <div
            class="card mb-3 border-0 shadow-sm ranking-card"
            style="
              background:#1e293b;
              color:white;
              border-radius:16px;
            "
          >
              
            <div class="card-body">
              
              <div class="row align-items-center g-3">
              
                <!-- POSICION -->
                <div class="col-3 col-md-1 text-center">
              
                  <div
                    class="fw-bold fs-4"
                    style="color:#60a5fa;"
                  >
                    #${index + 1}
                  </div>
              
                </div>
              
                <!-- NOMBRE -->
                <div class="col-9 col-md-4">
              
                  <div
                    class="fw-bold"
                    style="font-size:15px;"
                  >
                    ${item.nombre}
                  </div>
              
                  <small style="color:#cbd5e1;">
                    ${item.porcentaje}%
                  </small>
              
                </div>
              
                <!-- BARRA -->
                <div class="col-12 col-md-5">
              
                  <div
                    class="progress"
                    style="
                      height:12px;
                      background:#334155;
                    "
                  >
              
                    <div
                      class="progress-bar"
                      style="
                        width:${item.porcentaje}%;
                        background:linear-gradient(
                          135deg,
                          #10b981,
                          #3b82f6
                        );
                      "
                    >
                    </div>
              
                  </div>
              
                </div>
              
                <!-- PUNTOS -->
                <div
                  class="col-12 col-md-2 text-md-end text-center"
                >
              
                  <span
                    class="badge rounded-pill fs-6"
                    style="
                      background:#0ea5e9;
                      color:white;
                    "
                  >
                    ${item.total} pts
                  </span>
              
                </div>
              
              </div>
              
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

