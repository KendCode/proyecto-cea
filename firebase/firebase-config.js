  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAoL8JmTqbR94PFe-o10sPhkK7LCvhpIHA",
    authDomain: "proyecto-cea-fe5cf.firebaseapp.com",
    projectId: "proyecto-cea-fe5cf",
    storageBucket: "proyecto-cea-fe5cf.firebasestorage.app",
    messagingSenderId: "132456848902",
    appId: "1:132456848902:web:0e335bfe3fbd3d1b8d6d87"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export { app };