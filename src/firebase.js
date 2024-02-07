// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNURcyPcLGJp63i2B3gtNmk8122STKsVA",
  authDomain: "snap-match-6b16b.firebaseapp.com",
  projectId: "snap-match-6b16b",
  storageBucket: "snap-match-6b16b.appspot.com",
  messagingSenderId: "277477629555",
  appId: "1:277477629555:web:8fe6eebd97bdf6d4a11406"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDb=getStorage(app)
