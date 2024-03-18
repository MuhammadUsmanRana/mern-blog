import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIRE_BASE_API_KEY,
    authDomain: "mern-blogs-3c7f1.firebaseapp.com",
    projectId: "mern-blogs-3c7f1",
    storageBucket: "mern-blogs-3c7f1.appspot.com",
    messagingSenderId: "91809185454",
    appId: "1:91809185454:web:a44d2906e2a9b8fd29b73f",
};

export const app = initializeApp(firebaseConfig);