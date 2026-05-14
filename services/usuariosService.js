import {
  createUserWithEmailAndPassword
}
  from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
}
  from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { auth }
  from "../firebase/auth.js";

import { db }
  from "../firebase/firestore.js";

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

      carrera:
        data.carrera,

      nivel:
        data.nivel,

      sexo:
        data.sexo,

      fecha_nac:
        data.fecha_nac,

      fechaRegistro:
        serverTimestamp(),

      estado: true

    }
  );

}