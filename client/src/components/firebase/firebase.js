// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  databaseURL: "https://area-potter-default-rtdb.europe-west1.firebasedatabase.app",
  apiKey: "AIzaSyAVoww1mBdbij4v3qrD0T-DdXCtdTeqSnQ",
  authDomain: "area-potter.firebaseapp.com",
  projectId: "area-potter",
  storageBucket: "area-potter.appspot.com",
  messagingSenderId: "851421718570",
  appId: "1:851421718570:web:7f42459ec708ebedc9bb53",
};

let appInit = initializeApp(firebaseConfig);

export const auth = getAuth(appInit);
const db = getFirestore(appInit);
export default db;
export const app = appInit;

