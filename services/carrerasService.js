import {

    db

}
from "../firebase/firestore.js";

import {

    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ==========================
// OBTENER CARRERAS
// ==========================
export async function obtenerCarreras() {

    const querySnapshot =
        await getDocs(
            collection(
                db,
                "carreras"
            )
        );

    const carreras = [];

    querySnapshot.forEach(docSnap => {

        carreras.push({

            id: docSnap.id,

            ...docSnap.data()

        });

    });

    return carreras;

}

// ==========================
// CREAR CARRERA
// ==========================
export async function crearCarrera(data) {

    await addDoc(
        collection(
            db,
            "carreras"
        ),
        {

            nombre:
                data.nombre,

            sigla:
                data.sigla,

            estado:
                true

        }
    );

}

// ==========================
// EDITAR CARRERA
// ==========================
export async function editarCarrera(
    id,
    data
) {

    await updateDoc(
        doc(
            db,
            "carreras",
            id
        ),
        {

            nombre:
                data.nombre,

            sigla:
                data.sigla

        }
    );

}

// ==========================
// CAMBIAR ESTADO
// ==========================
export async function cambiarEstadoCarrera(
    id,
    estado
) {

    await updateDoc(
        doc(
            db,
            "carreras",
            id
        ),
        {

            estado:
                !estado

        }
    );

}