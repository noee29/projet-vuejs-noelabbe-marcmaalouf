import { db } from "../firebase"
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore"


// Crée le profil utilisateur dans Firestore après inscription
export const creerUtilisateur = (uid, prenom, nom, email) => {
  return setDoc(doc(db, "users", uid), {
    prenom,
    nom,
    email,
    dateInscription: serverTimestamp(),
  })
}

// Récupère le profil d'un utilisateur
export const getUtilisateur = (uid) => {
  return getDoc(doc(db, "users", uid))
}

// Sauvegarde un nouveau CV (retourne l'id généré)
export const sauvegarderCV = (uid, type, titre, donnees) => {
  return addDoc(collection(db, "users", uid, "cv"), {
    type,       // "ats" ou "colorful"
    titre,      // ex: "Mon CV développeur"
    donnees,    // objet contenant tout le formulaire
    dateCreation: serverTimestamp(),
    dateMiseAJour: serverTimestamp(),
  })
}

// Récupère tous les CV d'un utilisateur
export const getCVs = (uid) => {
  return getDocs(collection(db, "users", uid, "cv"))
}

// Récupère un CV précis
export const getCV = (uid, cvId) => {
  return getDoc(doc(db, "users", uid, "cv", cvId))
}

// Met à jour un CV existant
export const mettreAJourCV = (uid, cvId, donnees) => {
  return updateDoc(doc(db, "users", uid, "cv", cvId), {
    donnees,
    dateMiseAJour: serverTimestamp(),
  })
}

// Supprime un CV
export const supprimerCV = (uid, cvId) => {
  return deleteDoc(doc(db, "users", uid, "cv", cvId))
}