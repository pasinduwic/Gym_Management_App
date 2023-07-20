// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCzSD4946si5BTOQ22NE_Zb4tpm4lyiEg",
  authDomain: "react-cart-app-2f316.firebaseapp.com",
  projectId: "react-cart-app-2f316",
  storageBucket: "react-cart-app-2f316.appspot.com",
  messagingSenderId: "711001134690",
  appId: "1:711001134690:web:0a391a9f9e5a17fae6633b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
