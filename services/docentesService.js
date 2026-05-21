// services/docentesService.js

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  db
}
from "../firebase/firestore.js";

// ==========================
// OBTENER DOCENTES
// ==========================

export async function obtenerDocentes() {

  const querySnapshot =
    await getDocs(
      collection(db, "docentes")
    );

  const docentes = [];

  querySnapshot.forEach(docSnap => {

    docentes.push({
      id: docSnap.id,
      ...docSnap.data()
    });

  });

  return docentes;

}

// ==========================
// CREAR DOCENTE
// ==========================

export async function crearDocente(data) {

  await addDoc(
    collection(db, "docentes"),
    {
      usuarioId: data.usuarioId,
      carreraId: data.carreraId,
      nivelId: data.nivelId
    }
  );

}

// ==========================
// ACTUALIZAR DOCENTE
// ==========================

export async function actualizarDocente(id, data) {

  await updateDoc(
    doc(db, "docentes", id),
    {
      usuarioId: data.usuarioId,
      carreraId: data.carreraId,
      nivelId: data.nivelId
    }
  );

}

// ==========================
// ELIMINAR DOCENTE
// ==========================

export async function eliminarDocente(id) {

  await deleteDoc(
    doc(db, "docentes", id)
  );

}