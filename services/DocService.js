
// services/DocService.js

import {

  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  db
}
from "../firebase/firestore.js";


// ==========================
// DOCENTE
// ==========================

export async function obtenerAsignaciones(uid) {

  const q = query(
    collection(db, "docentes"),
    where("usuarioId", "==", uid)
  );

  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

}

// ==========================
// OBTENER NIVEL
// ==========================

export async function obtenerNivel(
  nivelId
) {

  const snap =
    await getDoc(
      doc(
        db,
        "niveles",
        nivelId
      )
    );

  if (!snap.exists())
    return null;

  return {

    id: snap.id,

    ...snap.data()

  };

}


// ==========================
// OBTENER CARRERA
// ==========================

export async function obtenerCarrera(
  carreraId
) {

  const snap =
    await getDoc(
      doc(
        db,
        "carreras",
        carreraId
      )
    );

  if (!snap.exists())
    return null;

  return {

    id: snap.id,

    ...snap.data()

  };

}



// ==========================
// MODULOS
// ==========================

export async function obtenerModulos(
  carreraId,
  nivelId
) {

  const q = query(

    collection(db, "modulos"),

    where(
      "carreraId",
      "==",
      carreraId
    ),

    where(
      "nivelId",
      "==",
      nivelId
    )

  );

  const snap =
    await getDocs(q);

  return snap.docs.map(d => ({

    id: d.id,

    ...d.data()

  }));

}


// ==========================
// ESTUDIANTES
// ==========================
export async function obtenerEstudiantes(

  carreraId,
  nivelId

) {

  // ==========================
  // QUERY FIREBASE
  // ==========================

  const q =
    query(

      collection(
        db,
        "estudiantes"
      ),

      where(
        "carreraId",
        "==",
        doc(
          db,
          "carreras",
          carreraId
        )
      ),

      where(
        "nivelId",
        "==",
        doc(
          db,
          "niveles",
          nivelId
        )
      )

    );

  const snapshot =
    await getDocs(q);

  const lista = [];

  snapshot.forEach(docSnap => {

    lista.push({

      id: docSnap.id,

      ...docSnap.data()

    });

  });

  return lista;

}
// ==========================
// USUARIOS MAPA
// ==========================

export async function obtenerUsuariosMapa() {

  const snap =
    await getDocs(
      collection(db, "usuarios")
    );

  const usuarios = {};

  snap.forEach(d => {

    usuarios[d.id] = {

      id: d.id,

      ...d.data()

    };

  });

  return usuarios;

}


// ==========================
// GUARDAR NOTA
// ==========================

export async function guardarNota(data) {

  const id =

    `${data.estudianteId}_${data.moduloId}_${data.gestion}`;

  await setDoc(

    doc(db, "calificaciones", id),

    {

      estudianteId:
        data.estudianteId,

      moduloId:
        data.moduloId,

      docenteId:
        data.docenteId,

      nota:
        data.nota,

      gestion:
        data.gestion,

      timestamp:
        serverTimestamp()

    }

  );

}

