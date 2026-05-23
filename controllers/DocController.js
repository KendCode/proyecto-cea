
// services/DocService.js

import {

  db

}
from "../firebase/firestore.js";

import {

  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ==========================
// ASIGNACIONES DOCENTE
// ==========================

export async function obtenerAsignaciones(uid) {

  const q =
    query(
      collection(db, "docentes"),
      where("usuarioId", "==", uid)
    );

  const snap =
    await getDocs(q);

  return snap.docs.map(d => ({

    id: d.id,
    ...d.data()

  }));

}


// ==========================
// CARRERA
// ==========================

export async function obtenerCarrera(id) {

  const snap =
    await getDoc(
      doc(db, "carreras", id)
    );

  return snap.exists()
    ? {
        id: snap.id,
        ...snap.data()
      }
    : null;

}


// ==========================
// NIVEL
// ==========================

export async function obtenerNivel(id) {

  const snap =
    await getDoc(
      doc(db, "niveles", id)
    );

  return snap.exists()
    ? {
        id: snap.id,
        ...snap.data()
      }
    : null;

}


// ==========================
// MODULOS
// ==========================

export async function obtenerModulos(

  carreraId,
  nivelId

) {

  const q =
    query(

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
      ),

      where(
        "estado",
        "==",
        true
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

  const q =
    query(

      collection(db, "estudiantes"),

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
