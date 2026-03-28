import { defineStore } from "pinia"
import {
  getCVsUtilisateur,
  getCV,
  sauvegarderCV,
  mettreAJourCV,
  supprimerCV,
} from "@/services/firestore"

export const useCvStore = defineStore("cv", {
  state: () => ({
    cvs: [],
    currentCv: null,
    loading: false,
    error: "",
    successMessage: "",
  }),

  getters: {
    totalCV: (state) => state.cvs.length,

    cvsComplets: (state) => {
      return state.cvs.filter((cv) => cv.complet)
    },

    cvsIncomplets: (state) => {
      return state.cvs.filter((cv) => !cv.complet)
    },

    cvParId: (state) => {
      return (id) => state.cvs.find((cv) => cv.id === id) || null
    },

    texteCompteur: (state) => {
      const total = state.cvs.length
      return total <= 1 ? `Vous avez ${total} CV` : `Vous avez ${total} CV`
    },
  },

  actions: {
    clearMessages() {
      this.error = ""
      this.successMessage = ""
    },

    async fetchCVs(uid) {
      this.loading = true
      this.error = ""
      this.successMessage = ""

      try {
        const data = await getCVsUtilisateur(uid)
        this.cvs = data
        return data
      } catch (error) {
        this.error = error.code || error.message || "Erreur lors du chargement des CV."
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCV(uid, cvId) {
      this.loading = true
      this.error = ""
      this.successMessage = ""

      try {
        const snapshot = await getCV(uid, cvId)

        if (!snapshot.exists()) {
          throw new Error("CV introuvable.")
        }

        this.currentCv = {
          id: snapshot.id,
          ...snapshot.data(),
        }

        return this.currentCv
      } catch (error) {
        this.error = error.code || error.message || "Erreur lors du chargement du CV."
        throw error
      } finally {
        this.loading = false
      }
    },

    async addCV(uid, email, type, titre, donnees, apercuImage = "") {
      this.loading = true
      this.error = ""
      this.successMessage = ""

      try {
        const docRef = await sauvegarderCV(uid, email, type, titre, donnees, apercuImage)

        await this.fetchCVs(uid)

        this.successMessage = "CV sauvegardé avec succès."
        return docRef
      } catch (error) {
        this.error = error.code || error.message || "Erreur lors de la sauvegarde."
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCV(uid, email, cvId, titre, donnees, apercuImage = "") {
      this.loading = true
      this.error = ""
      this.successMessage = ""

      try {
        await mettreAJourCV(uid, email, cvId, titre, donnees, apercuImage)

        await this.fetchCVs(uid)

        if (this.currentCv && this.currentCv.id === cvId) {
          this.currentCv = {
            ...this.currentCv,
            titre,
            email,
            donnees,
            apercuImage,
          }
        }

        this.successMessage = "CV mis à jour avec succès."
      } catch (error) {
        this.error = error.code || error.message || "Erreur lors de la mise à jour."
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCV(uid, cvId) {
      this.loading = true
      this.error = ""
      this.successMessage = ""

      try {
        await supprimerCV(uid, cvId)

        this.cvs = this.cvs.filter((cv) => cv.id !== cvId)

        if (this.currentCv && this.currentCv.id === cvId) {
          this.currentCv = null
        }

        this.successMessage = "CV supprimé avec succès."
      } catch (error) {
        this.error = error.code || error.message || "Erreur lors de la suppression."
        throw error
      } finally {
        this.loading = false
      }
    },

    resetCurrentCv() {
      this.currentCv = null
    },
  },
})