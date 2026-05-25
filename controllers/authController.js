import {
  signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { auth } from "../firebase/auth.js";
import { db } from "../firebase/firestore.js";

// ==========================
// FORM LOGIN
// ==========================

const formLogin =
  document.getElementById(
    "formLogin"
  );

// ==========================
// ALERTA BOOTSTRAP
// ==========================

function mostrarAlerta(
  mensaje,
  tipo = "danger"
) {

  const container =
    document.getElementById(
      "alertContainer"
    );

  const alerta =
    document.createElement("div");

  alerta.className =
    `alert alert-${tipo} alert-dismissible fade show shadow`;

  alerta.role = "alert";

  alerta.innerHTML = `

    <div
      style="
        display:flex;
        align-items:center;
        gap:10px;
      "
    >

      <i class="bi ${
        tipo === "success"
          ? "bi-check-circle-fill"
          : tipo === "warning"
          ? "bi-exclamation-triangle-fill"
          : "bi-x-circle-fill"
      }"></i>

      <span>${mensaje}</span>

    </div>

    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
    ></button>

  `;

  container.appendChild(alerta);

  // AUTO CERRAR
  setTimeout(() => {

    alerta.classList.remove("show");

    alerta.classList.add("hide");

    setTimeout(() => {

      alerta.remove();

    }, 300);

  }, 4000);

}

// ==========================
// LOGIN
// ==========================

formLogin.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const usuario =
      document.getElementById(
        "usuario"
      ).value.trim();

    const password =
      document.getElementById(
        "password"
      ).value.trim();

    try {

      // ==========================
      // BUSCAR USUARIO
      // ==========================

      const q = query(

        collection(
          db,
          "usuarios"
        ),

        where(
          "usuario",
          "==",
          usuario
        )

      );

      const querySnapshot =
        await getDocs(q);

      // ==========================
      // NO EXISTE
      // ==========================

      if (
        querySnapshot.empty
      ) {

        mostrarAlerta(
          "Usuario no encontrado",
          "warning"
        );

        return;

      }

      let datosUsuario;

      querySnapshot.forEach(
        (doc) => {

          datosUsuario =
            doc.data();

        }
      );

      // ==========================
      // VALIDAR ESTADO
      // ==========================

      if (
        !datosUsuario.estado
      ) {

        mostrarAlerta(
          "Usuario inactivo. Contacte al administrador.",
          "danger"
        );

        return;

      }

      // ==========================
      // LOGIN FIREBASE
      // ==========================

      await signInWithEmailAndPassword(

        auth,

        datosUsuario.correo,

        password

      );

      // ==========================
      // GUARDAR LOCAL
      // ==========================

      localStorage.setItem(

        "usuario",

        JSON.stringify(
          datosUsuario
        )

      );

      mostrarAlerta(
        "Inicio de sesión exitoso",
        "success"
      );

      // ==========================
      // REDIRECCION
      // ==========================

      setTimeout(() => {

        switch (
          datosUsuario.rol
        ) {

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

      }, 1000);

    }

    catch (error) {

      console.error(error);

      let mensaje =
        "Error al iniciar sesión";

      // ==========================
      // MENSAJES FIREBASE
      // ==========================

      switch(error.code){

        case "auth/wrong-password":

          mensaje =
            "Contraseña incorrecta";

        break;

        case "auth/invalid-credential":

          mensaje =
            "Usuario o contraseña incorrectos";

        break;

        case "auth/too-many-requests":

          mensaje =
            "Demasiados intentos. Intente más tarde";

        break;

      }

      mostrarAlerta(
        mensaje,
        "danger"
      );

    }

  }
);