console.log("CONTROLADOR CARGADO");

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { auth } from "../firebase/auth.js";
import { db } from "../firebase/firestore.js";

const formLogin =
  document.getElementById("formLogin");

console.log(formLogin);

formLogin.addEventListener("submit", async (e) => {

  e.preventDefault();

  console.log("FORMULARIO ENVIADO");

  const usuario =
    document.getElementById("usuario").value;

  const password =
    document.getElementById("password").value;

  console.log(usuario);
  console.log(password);

  try {

    const q = query(
      collection(db, "usuarios"),
      where("usuario", "==", usuario)
    );

    const querySnapshot =
      await getDocs(q);

    console.log(querySnapshot);

    if(querySnapshot.empty){

      alert("Usuario no encontrado");
      return;

    }

    let datosUsuario;

    querySnapshot.forEach((doc) => {

      datosUsuario = doc.data();

    });

    console.log(datosUsuario);

    const correo =
      datosUsuario.correo;

    await signInWithEmailAndPassword(
      auth,
      correo,
      password
    );

    //alert("Bienvenido");

    localStorage.setItem(
      "usuario",
      JSON.stringify(datosUsuario)
    );

    switch(datosUsuario.rol){

      case "administrador":

        window.location.href =
          "../admin/dashboard.html";

      break;

      case "docente":

        window.location.href =
          "../docente/dashboard.html";

      break;

      case "estudiante":

        window.location.href =
          "../estudiante/dashboard.html";

      break;

    }

  } catch(error){

    console.log(error);

    alert(error.message);

  }

});