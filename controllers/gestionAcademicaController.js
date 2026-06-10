import {
    abrirGestion,
    cerrarGestion,
    procesarPromociones,
    cargarDashboardGestion,
    cargarSiguienteGestion
}
from "../services/promocionService.js";

/* ===========================
   INICIO
=========================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await cargarDashboardGestion();

    }
);

/* ===========================
   ABRIR MODAL GESTIÓN
=========================== */

document
.getElementById(
    "btnAbrirGestion"
)
.addEventListener(
    "click",
    async () => {

        await cargarSiguienteGestion();

        document
        .getElementById(
            "modalAbrir"
        )
        .classList
        .add("show");

    }
);

/* ===========================
   CONFIRMAR ABRIR
=========================== */

document
.getElementById(
    "confirmarAbrir"
)
.addEventListener(
    "click",
    async () => {

        try {

            const gestion =
                document
                .getElementById(
                    "gestionNueva"
                )
                .value;

            await abrirGestion(
                gestion
            );

            alert(
                "Gestión abierta correctamente"
            );

            location.reload();

        } catch (error) {

            console.error(
                error
            );

        }

    }
);

/* ===========================
   CONFIRMAR CERRAR
=========================== */

document
.getElementById(
    "confirmarCerrar"
)
.addEventListener(
    "click",
    async () => {

        try {

            await cerrarGestion();

            alert(
                "Gestión cerrada correctamente"
            );

            location.reload();

        } catch (error) {

            console.error(
                error
            );

        }

    }
);

/* ===========================
   PROCESAR PROMOCIONES
=========================== */

document
.getElementById(
    "confirmarProcesar"
)
.addEventListener(
    "click",
    async () => {

        try {

            await procesarPromociones();

            alert(
                "Promociones procesadas correctamente"
            );

            location.reload();

        } catch (error) {

            console.error(
                error
            );

        }

    }
);