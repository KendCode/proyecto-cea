import { db } from "../firebase/firestore.js";

import {
    collection,
    getDocs,
    getDoc,
    query,
    where,
    doc,
    updateDoc,
    addDoc
} 
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import {
    auth
}
from "../firebase/auth.js";

/* ===========================
   DASHBOARD
=========================== */

export async function cargarDashboardGestion() {

    await cargarGestionActiva();
    await cargarContadores();
    await cargarHistorial();

}

/* ===========================
   GESTIÓN ACTIVA
=========================== */

export async function cargarGestionActiva() {

    const q = query(
        collection(db, "periodos"),
        where("estado", "==", "ACTIVO")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const periodo = snapshot.docs[0].data();

    const lbl = document.getElementById("gestionActual");

    if (lbl) {
        lbl.textContent = periodo.nombre;
    }

}

/* ===========================
   ABRIR GESTIÓN
=========================== */

export async function abrirGestion(gestion) {

    await addDoc(
        collection(db, "periodos"),
        {
            nombre: gestion,
            estado: "ACTIVO",
            fechaInicio: new Date()
        }
    );

}

/* ===========================
   CERRAR GESTIÓN
=========================== */

export async function cerrarGestion() {

    const q = query(
        collection(db, "periodos"),
        where("estado", "==", "ACTIVO")
    );

    const snapshot = await getDocs(q);

    for (const periodo of snapshot.docs) {

        await updateDoc(
            periodo.ref,
            {
                estado: "CERRADO",
                fechaFin: new Date()
            }
        );

    }

}

/* ===========================
   SIGUIENTE GESTIÓN
=========================== */

export async function cargarSiguienteGestion() {

    const q = query(
        collection(db, "periodos"),
        where("estado", "==", "ACTIVO")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const periodo = snapshot.docs[0].data();

    const siguiente =
        obtenerSiguienteGestion(periodo.nombre);

    const select =
        document.getElementById("gestionNueva");

    if (select) {

        select.innerHTML = `
            <option value="${siguiente}">
                ${siguiente}
            </option>
        `;

    }

}

function obtenerSiguienteGestion(gestionActual) {

    const [periodo, anio] =
        gestionActual.split("-");

    const anioNumero =
        Number(anio);

    if (periodo === "I") {

        return `II-${anioNumero}`;

    }

    return `I-${anioNumero + 1}`;

}

/* ===========================
   PROCESAR PROMOCIONES
=========================== */

export async function procesarPromociones() {

    const q = query(
        collection(db, "estudiantes"),
        where("estado", "==", "ACTIVO")
    );

    const snapshot =
        await getDocs(q);

    for (const estudianteDoc of snapshot.docs) {

        const estudiante = {
            id: estudianteDoc.id,
            ...estudianteDoc.data()
        };

        await evaluarEstudiante(
            estudiante
        );

    }

}

/* ===========================
   EVALUAR
=========================== */

async function evaluarEstudiante(
    estudiante
) {

    const total =
        await obtenerTotalNotas(
            estudiante.id
        );

    if (total >= 255) {

        await promoverEstudiante(
            estudiante
        );

    } else {

        await reprobarEstudiante(
            estudiante
        );

    }

}

/* ===========================
   TOTAL NOTAS
=========================== */

async function obtenerTotalNotas(
    estudianteId
) {

    const q = query(
        collection(
            db,
            "calificaciones"
        ),
        where(
            "estudianteId",
            "==",
            estudianteId
        )
    );

    const snapshot =
        await getDocs(q);

    let total = 0;

    snapshot.forEach(docu => {

        total += Number(
            docu.data().nota || 0
        );

    });

    return total;

}

/* ===========================
   PROMOVER
=========================== */

async function promoverEstudiante(
    estudiante
) {

    const nivelActual =
        await obtenerNivel(
            estudiante.nivelId
        );

    const siguienteNivel =
        await obtenerSiguienteNivel(
            nivelActual.orden
        );

    if (!siguienteNivel) {

        await marcarComoEgresado(
            estudiante.id
        );

        return;

    }

    await updateDoc(
        doc(
            db,
            "estudiantes",
            estudiante.id
        ),
        {
            nivelId:
                siguienteNivel.id
        }
    );

    await addDoc(
        collection(
            db,
            "promociones"
        ),
        {
            estudianteId:
                estudiante.id,

            estudianteNombre:
                estudiante.nombre || "",

            nivelAnterior:
                nivelActual.sigla,

            nivelNuevo:
                siguienteNivel.sigla,

            fecha:
                new Date(),

            promovido:
                true
        }
    );

}

/* ===========================
   REPROBAR
=========================== */

async function reprobarEstudiante(
    estudiante
) {

    await updateDoc(
        doc(
            db,
            "estudiantes",
            estudiante.id
        ),
        {
            estado:
                "REPROBADO"
        }
    );

}

/* ===========================
   EGRESADO
=========================== */

async function marcarComoEgresado(
    estudianteId
) {

    await updateDoc(
        doc(
            db,
            "estudiantes",
            estudianteId
        ),
        {
            estado:
                "EGRESADO",

            egresado:
                true
        }
    );

}

/* ===========================
   NIVEL ACTUAL
=========================== */

async function obtenerNivel(
    nivelId
) {

    const nivelSnap =
        await getDoc(
            doc(
                db,
                "niveles",
                nivelId
            )
        );

    return {
        id: nivelSnap.id,
        ...nivelSnap.data()
    };

}

/* ===========================
   SIGUIENTE NIVEL
=========================== */

async function obtenerSiguienteNivel(
    ordenActual
) {

    const q = query(
        collection(
            db,
            "niveles"
        ),
        where(
            "orden",
            "==",
            ordenActual + 1
        )
    );

    const snapshot =
        await getDocs(q);

    if (snapshot.empty) {

        return null;

    }

    return {

        id:
            snapshot.docs[0].id,

        ...snapshot.docs[0].data()

    };

}

/* ===========================
   CONTADORES
=========================== */

async function cargarContadores() {

    const promovidos =
        await getDocs(
            collection(
                db,
                "promociones"
            )
        );

    const reprobados =
        await getDocs(
            query(
                collection(
                    db,
                    "estudiantes"
                ),
                where(
                    "estado",
                    "==",
                    "REPROBADO"
                )
            )
        );

    const egresados =
        await getDocs(
            query(
                collection(
                    db,
                    "estudiantes"
                ),
                where(
                    "estado",
                    "==",
                    "EGRESADO"
                )
            )
        );

    document.getElementById(
        "promovidos"
    ).textContent =
        promovidos.size;

    document.getElementById(
        "reprobados"
    ).textContent =
        reprobados.size;

    document.getElementById(
        "egresados"
    ).textContent =
        egresados.size;

}

/* ===========================
   HISTORIAL
=========================== */

async function cargarHistorial() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "promociones"
            )
        );

    const tbody =
        document.getElementById(
            "tablaPromociones"
        );

    if (!tbody) return;

    let html = "";

    snapshot.forEach(docu => {

        const p =
            docu.data();

        html += `
        <tr>
            <td>${p.estudianteNombre || ""}</td>
            <td>${p.nivelAnterior || ""}</td>
            <td>${p.nivelNuevo || ""}</td>
            <td>Promovido</td>
            <td>${new Date(p.fecha.seconds * 1000).toLocaleDateString()}</td>
        </tr>
        `;

    });

    tbody.innerHTML =
        html;

}