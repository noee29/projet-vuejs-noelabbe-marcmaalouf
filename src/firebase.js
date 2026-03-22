import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOJM8ICK-Qg_6_zfhKLRuXe4TDEVBgtko",
  authDomain: "smartcv-eee2d.firebaseapp.com",
  projectId: "smartcv-eee2d",
  storageBucket: "smartcv-eee2d.firebasestorage.app",
  messagingSenderId: "696632675016",
  appId: "1:696632675016:web:75546194dfb68860b5f3fd",
}

// Initialisation
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

export { auth }