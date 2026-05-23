// services/EstudService.js
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
}
    from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { db } from "../firebase/firestore.js";

// 🔥 OBTENER DATOS DEL ESTUDIANTE
export async function obtenerDatosEstudiante(uid) {

  const q = query(
    collection(db, "estudiantes"),
    where("usuarioId", "==", uid)
  );

  const snapshot =
    await getDocs(q);

  if (snapshot.empty)
    return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data()
  };
}

// ========================================
// OBTENER ESTUDIANTE POR UID
// ========================================
export async function obtenerEstudiante(uid) {

    const q = query(
        collection(db, "estudiantes"),
        where("usuarioId", "==", uid)
    );

    const snap = await getDocs(q);

    if (snap.empty) return null;

    const docu = snap.docs[0];

    return {

        id: docu.id,

        ...docu.data()

    };

}
// ========================================
// OBTENER USUARIO
// ========================================

export async function obtenerUsuario(usuarioId) {

    const snap = await getDoc(
        doc(db, "usuarios", usuarioId)
    );

    if (!snap.exists()) return null;

    return {
        id: snap.id,
        ...snap.data()
    };

}

// ==========================
// OBTENER CARRERA
// ==========================

export async function obtenerCarrera(carreraRef) {

    if (!carreraRef) return null;

    // SI ES REFERENCE
    if (carreraRef.id) {

        const snap =
            await getDoc(carreraRef);

        if (!snap.exists()) return null;

        return {
            id: snap.id,
            ...snap.data()
        };

    }

    // SI ES STRING
    const id =
        carreraRef.includes("/")
            ? carreraRef.split("/").pop()
            : carreraRef;

    const snap =
        await getDoc(
            doc(db, "carreras", id)
        );

    if (!snap.exists()) return null;

    return {
        id: snap.id,
        ...snap.data()
    };

}
// ==========================
// OBTENER NIVEL
// ==========================

export async function obtenerNivel(nivelRef) {

    if (!nivelRef) return null;

    // SI ES REFERENCE
    if (nivelRef.id) {

        const snap =
            await getDoc(nivelRef);

        if (!snap.exists()) return null;

        return {
            id: snap.id,
            ...snap.data()
        };

    }

    // SI ES STRING
    const id =
        nivelRef.includes("/")
            ? nivelRef.split("/").pop()
            : nivelRef;

    const snap =
        await getDoc(
            doc(db, "niveles", id)
        );

    if (!snap.exists()) return null;

    return {
        id: snap.id,
        ...snap.data()
    };

}

// ========================================
// OBTENER MODULOS
// ========================================

export async function obtenerModulos(carreraId, nivelId) {

    const q = query(

        collection(db, "modulos"),

        where("carreraId", "==", carreraId),

        where("nivelId", "==", nivelId)

    );

    const snap = await getDocs(q);

    return snap.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}

// ========================================
// OBTENER CALIFICACIONES
// ========================================

export async function obtenerCalificaciones(estudianteId) {

    const q = query(
        collection(db, "calificaciones"),
        where("estudianteId", "==", estudianteId)
    );

    const snap = await getDocs(q);

    return snap.docs.map(d => ({
        id: d.id,
        ...d.data()
    }));

}


// ========================================
// OBTENER DOCENTE
// ========================================

export async function obtenerDocente(
    carreraId,
    nivelId
) {

    const q = query(
        collection(db, "docentes"),
        where("carreraId", "==", carreraId),
        where("nivelId", "==", nivelId)
    );

    const snap = await getDocs(q);

    if (snap.empty) return null;

    return {
        id: snap.docs[0].id,
        ...snap.docs[0].data()
    };

}


// ========================================
// OBTENER RANKING
// ========================================
export async function obtenerRanking() {

  const estSnap = await getDocs(collection(db, "estudiantes"));

  const ranking = [];

  for (const estDoc of estSnap.docs) {

    const est = estDoc.data();

    const usuario = await obtenerUsuario(est.usuarioId);
    if (!usuario) continue;

    const carrera = await obtenerCarrera(est.carreraId);
    const nivel = await obtenerNivel(est.nivelId);

    const notasSnap = await obtenerCalificaciones(estDoc.id);
    const notas = notasSnap.map(n => Number(n.nota || 0));

    const suma = notas.length
      ? notas.reduce((a, b) => a + b, 0)
      : 0;

    const porcentaje = notas.length
      ? (suma / (notas.length * 100)) * 100
      : 0;

    ranking.push({
      estId: estDoc.id,
      nombre: `${usuario.nombre || ""} ${usuario.ap_paterno || ""} ${usuario.ap_materno || ""}`,
      carreraId: est.carreraId,
      nivelId: est.nivelId,
      carreraNombre: carrera?.nombre || "",
      nivelNombre: nivel?.nombre || "",
      sumatoria: suma,
      porcentaje: Math.round(porcentaje)
    });
  }

  return ranking;
}