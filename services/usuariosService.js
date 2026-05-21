import {
    createUserWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp,
    collection,
    getDocs,
    updateDoc,
    deleteDoc
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
    auth
}
from "../firebase/auth.js";

import {
    db
}
from "../firebase/firestore.js";

// ==========================
// CREAR USUARIO
// ==========================
export async function crearUsuario(
    data
) {

    const cred =
        await createUserWithEmailAndPassword(
            auth,
            data.correo,
            data.password
        );

    const uid =
        cred.user.uid;

    await setDoc(
        doc(db, "usuarios", uid),
        {

            uid,

            usuario:
                data.usuario,

            nombre:
                data.nombre,

            ap_paterno:
                data.ap_paterno,

            ap_materno:
                data.ap_materno,

            ci:
                data.ci,

            correo:
                data.correo,

            nro_celular:
                data.nro_celular,

            rol:
                data.rol,

            sexo:
                data.sexo,

            fecha_nac:
                data.fecha_nac,

            fechaRegistro:
                serverTimestamp(),

            estado:
                data.estado

        }
    );

}
// ==========================
// ACTUALIZAR USUARIO
// ==========================

export async function actualizarUsuario(
    id,
    data
) {

    await updateDoc(
        doc(db, "usuarios", id),
        data
    );

}
// ==========================
// OBTENER USUARIOS
// ==========================
export async function obtenerUsuarios() {

    const querySnapshot =
        await getDocs(
            collection(db, "usuarios")
        );

    const usuarios = [];

    querySnapshot.forEach(doc => {

        usuarios.push({
            id: doc.id,
            ...doc.data()
        });

    });

    return usuarios;

}
// ==========================
// ELIMINAR USUARIO
// ==========================
export async function eliminarUsuario(uid) {

    await deleteDoc(
        doc(db, "usuarios", uid)
    );

}