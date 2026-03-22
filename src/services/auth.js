import { auth } from "../firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth"

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const signupUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email)
}

export const logoutUser = () => {
  return signOut(auth)
}