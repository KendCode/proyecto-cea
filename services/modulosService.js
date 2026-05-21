import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { db } from "../firebase/firestore.js";

// ==============================
// CREAR MODULO
// ==============================
export async function crearModulo(data) {

  const docRef = await addDoc(
    collection(db, "modulos"),
    data
  );

  return docRef.id;

}

// ==============================
// OBTENER MODULOS
// ==============================
export async function obtenerModulos() {

  const querySnapshot =
    await getDocs(
      collection(db, "modulos")
    );

  const modulos = [];

  querySnapshot.forEach((docItem) => {

    modulos.push({
      id: docItem.id,
      ...docItem.data()
    });

  });

  return modulos;

}

// ==============================
// ACTUALIZAR MODULO
// ==============================
export async function actualizarModulo(
  id,
  data
) {

  await updateDoc(
    doc(db, "modulos", id),
    data
  );

}

// ==============================
// ELIMINAR MODULO
// ==============================
export async function eliminarModulo(id) {

  await deleteDoc(
    doc(db, "modulos", id)
  );

}