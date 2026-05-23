import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "../firebase/auth.js";
import { obtenerUsuarios } from "../services/usuariosService.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  cargarSidebar(user.uid);
});

async function cargarSidebar(uid) {

  const usuarios = await obtenerUsuarios(); // 👈 ARRAY

  

  // 🔥 buscar el usuario logueado dentro del array
  const usuario = usuarios.find(u => u.id === uid);

  // console.log("USUARIO LOGUEADO:", usuario);

  if (!usuario) return;

  document.getElementById("sidebarNombre").textContent =
    `${usuario.nombre || ""} ${usuario.ap_paterno || ""}`.trim();

  document.getElementById("sidebarCarrera").textContent =
    usuario.rol || "ESTUDIANTE";
}