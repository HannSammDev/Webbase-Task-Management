// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgu_PE2mlOE5HFrZk0IZzzxrQn4uN1V74",
  authDomain: "web-based-task-flow.firebaseapp.com",
  projectId: "web-based-task-flow",
  storageBucket: "web-based-task-flow.firebasestorage.app",
  messagingSenderId: "164924184336",
  appId: "1:164924184336:web:68e9f0f571147d2bdcf795",
  measurementId: "G-HC5D42TZTW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };