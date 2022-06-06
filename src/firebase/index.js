// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/compat/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_BTo9ukqq4Y0-hUvHzfrPAAwP95PyG0w",
  authDomain: "rent-a-car-f3018.firebaseapp.com",
  projectId: "rent-a-car-f3018",
  storageBucket: "rent-a-car-f3018.appspot.com",
  messagingSenderId: "774166748924",
  appId: "1:774166748924:web:ca473f33404537b5220179"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const storage = firebase.storage();

export { storage, firebase as default};