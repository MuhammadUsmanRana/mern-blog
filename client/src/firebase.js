import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAYRb1bYHZ0ann9k70oIGDAJGyyBgAbi2M",
    authDomain: "mern-blogs-3c7f1.firebaseapp.com",
    projectId: "mern-blogs-3c7f1",
    storageBucket: "mern-blogs-3c7f1.appspot.com",
    messagingSenderId: "91809185454",
    appId: "1:91809185454:web:a44d2906e2a9b8fd29b73f",
    measurementId: "G-JK54R2VTQ3"
  };

export const app = initializeApp(firebaseConfig);