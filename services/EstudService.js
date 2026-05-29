
// services/EstudService.js

import {
  db
} from "../firebase/firestore.js";

import {

  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// =========================
// ESTUDIANTE
// =========================

export async function obtenerEstudiante(uid) {

  const q = query(
    collection(db, "estudiantes"),
    where("usuarioId", "==", uid)
  );

  const snap =
    await getDocs(q);

  if (snap.empty) return null;

  return {
    id: snap.docs[0].id,
    ...snap.docs[0].data()
  };

}


// =========================
// CARRERA
// =========================

export async function obtenerCarrera(id) {

  const ref =
    doc(db, "carreras", id);

  const snap =
    await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };

}


// =========================
// NIVEL
// =========================

export async function obtenerNivel(id) {

  const ref =
    doc(db, "niveles", id);

  const snap =
    await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };

}


// =========================
// MODULOS
// =========================

export async function obtenerModulos(
  carreraId,
  nivelId
) {

  const q =
    query(
      collection(db, "modulos"),
      where("carreraId", "==", carreraId),
      where("nivelId", "==", nivelId)
    );

  const snap =
    await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}


// =========================
// CALIFICACIONES
// =========================

export async function obtenerCalificaciones(uid) {

  const q =
    query(
      collection(db, "calificaciones"),
      where("estudianteId", "==", uid)
    );

  const snap =
    await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}


// =========================
// DOCENTE
// =========================

export async function obtenerDocente(
  carreraId,
  nivelId
) {

  const q =
    query(
      collection(db, "docentes"),
      where("carreraId", "==", carreraId),
      where("nivelId", "==", nivelId)
    );

  const snap =
    await getDocs(q);

  if (snap.empty) return null;

  return {
    id: snap.docs[0].id,
    ...snap.docs[0].data()
  };

}


// =========================
// USUARIO
// =========================

export async function obtenerUsuario(uid) {

  const ref =
    doc(db, "usuarios", uid);

  const snap =
    await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };

}
