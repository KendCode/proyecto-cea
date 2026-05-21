import {
    
    collection,
    getDocs,
    query,
    where,
    addDoc,
    doc

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import {
    db
}
from "../firebase/firestore.js";


// ==========================
// CREAR ESTUDIANTE
// ==========================
export async function crearEstudiante(data) {

    await addDoc(
        collection(db, "estudiantes"),
        {

            usuarioId:
                data.usuarioId,

            carreraId:
                doc(
                    db,
                    data.carreraId
                ),

            nivelId:
                doc(
                    db,
                    data.nivelId
                ),

            gestion:
                data.gestion

        }
    );

}
// ==========================
// OBTENER ESTUDIANTES
// ==========================
export async function obtenerEstudiantes() {

    const querySnapshot =
        await getDocs(
            collection(
                db,
                "estudiantes"
            )
        );

    const estudiantes = [];

    querySnapshot.forEach(doc => {

        estudiantes.push({

            id: doc.id,

            ...doc.data()

        });

    });

    return estudiantes;

}
// ==========================
// USUARIOS ESTUDIANTES
// ==========================
export async function obtenerUsuariosEstudiantes() {

    const q = query(
        collection(db, "usuarios"),
        where("rol", "==", "estudiante")
    );

    const querySnapshot =
        await getDocs(q);

    const usuarios = [];

    querySnapshot.forEach(doc => {

        usuarios.push({

            uid: doc.id,

            ...doc.data()

        });

    });

    return usuarios;

}
// ==========================
// USUARIOS MAPA
// ==========================
export async function obtenerUsuariosMapa() {

    const querySnapshot =
        await getDocs(
            collection(
                db,
                "usuarios"
            )
        );

    const usuarios = {};

    querySnapshot.forEach(doc => {

        usuarios[doc.id] = {

            id: doc.id,

            ...doc.data()

        };

    });

    return usuarios;

}

// ==========================
// CARRERAS MAPA
// ==========================
export async function obtenerCarrerasMapa() {

    const querySnapshot =
        await getDocs(
            collection(
                db,
                "carreras"
            )
        );

    const carreras = {};

    querySnapshot.forEach(doc => {

        carreras[doc.id] = {

            id: doc.id,

            ...doc.data()

        };

    });

    return carreras;

}

// ==========================
// NIVELES MAPA
// ==========================
export async function obtenerNivelesMapa() {

    const querySnapshot =
        await getDocs(
            collection(
                db,
                "niveles"
            )
        );

    const niveles = {};

    querySnapshot.forEach(doc => {

        niveles[doc.id] = {

            id: doc.id,

            ...doc.data()

        };

    });

    return niveles;

}