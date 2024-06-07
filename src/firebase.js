// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getAuth } from "@firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAkj-T0uFxLBhBvaFe2-yeZx61Aq7gxrbs",
//   authDomain: "tera-fd6c3.firebaseapp.com",
//   projectId: "tera-fd6c3",
//   storageBucket: "tera-fd6c3.appspot.com",
//   messagingSenderId: "986738653194",
//   appId: "1:986738653194:web:10c0b7b566ddba68a007f3",
//   measurementId: "G-4BN68KZ2LS",
// };

// // login Credential
// // admin@gmail.com
// // Admin#123!

// // Initialize Firebase
// const Firebase = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);
// export const auth = getAuth(Firebase);
// export const fireStore = getFirestore(Firebase); // database
// export const fireStorage = getStorage(Firebase); // storage
// export default Firebase;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "AIzaSyDiyvsmexCczW6a0H4IBov7kPIBSzWmPZw",
  // authDomain: "gallery-7fdd8.firebaseapp.com",
  // projectId: "gallery-7fdd8",
  // storageBucket: "gallery-7fdd8.appspot.com",
  // messagingSenderId: "705535563705",
  // appId: "1:705535563705:web:aad591d225cb6b04a84868",
  // measurementId: "G-B0BD3ZKYLK",

  // Latest firebase config
  apiKey: "AIzaSyBRA7kWEpUHx-m9DInzbipgFyvEP_F_zYo",
  authDomain: "photo-gallery-vault.firebaseapp.com",
  projectId: "photo-gallery-vault",
  storageBucket: "photo-gallery-vault.appspot.com",
  messagingSenderId: "205133928065",
  appId: "1:205133928065:web:3e377f5cf20c0ed72b9f80",
  measurementId: "G-RW5MHJS8Y9",
};

// Initialize Firebase
const Firebase = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(Firebase);
export const fireStore = getFirestore(Firebase); // database
export const fireStorage = getStorage(Firebase); // storage
export default Firebase;
