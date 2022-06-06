// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/compat/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGs7WAcChw4hrmC68XUN6cGPacVLS1Ipw",
  authDomain: "test-67e78.firebaseapp.com",
  projectId: "test-67e78",
  storageBucket: "test-67e78.appspot.com",
  messagingSenderId: "697279054593",
  appId: "1:697279054593:web:0f3fe3bd7c4726f4db5100",
  measurementId: "G-XZ7RX1D4C7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const storage = firebase.storage();

export { storage, firebase as default};