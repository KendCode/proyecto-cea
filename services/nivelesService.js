import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  db
}
from "../firebase/firestore.js";

// ==========================
// OBTENER NIVELES
// ==========================

export async function obtenerNiveles() {

  const querySnapshot =
    await getDocs(
      collection(db, "niveles")
    );

  const niveles = [];

  querySnapshot.forEach(docSnap => {

    niveles.push({
      id: docSnap.id,
      ...docSnap.data()
    });

  });

  return niveles;

}

// ==========================
// CREAR NIVEL
// ==========================

export async function crearNivel(data) {

  await addDoc(
    collection(db, "niveles"),
    {
      nombre: data.nombre,
      sigla: data.sigla,
      orden: data.orden,
      estado: data.estado
    }
  );

}

// ==========================
// ACTUALIZAR NIVEL
// ==========================

export async function actualizarNivel(
  id,
  data
) {

  await updateDoc(
    doc(db, "niveles", id),
    data
  );

}

// ==========================
// CAMBIAR ESTADO
// ==========================

export async function cambiarEstadoNivel(
  id,
  estado
) {

  await updateDoc(
    doc(db, "niveles", id),
    {
      estado: !estado
    }
  );

}