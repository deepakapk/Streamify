// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf4hHOSZmOUMMwQy78Fi_OoIx_qANSJyo",
  authDomain: "videosharing-44675.firebaseapp.com",
  projectId: "videosharing-44675",
  storageBucket: "videosharing-44675.firebasestorage.app",
  messagingSenderId: "532799121802",
  appId: "1:532799121802:web:e7d385cc16e234213e8073"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const provider = new GoogleAuthProvider()
export default app