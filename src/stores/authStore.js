import { defineStore } from "pinia"
import { auth } from "@/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { loginUser, signupUser, logoutUser, resetPassword } from "@/services/auth"
import { creerUtilisateur } from "@/services/firestore"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isReady: false,
    loading: false,
    error: "",
    unsubscribeAuth: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.uid || null,
    userEmail: (state) => state.user?.email || "",
  },

  actions: {
    initAuth() {
      if (this.unsubscribeAuth) {
        return
      }

      this.unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
        this.user = firebaseUser
        this.isReady = true
      })
    },

    waitUntilReady() {
      if (this.isReady) {
        return Promise.resolve(this.user)
      }

      return new Promise((resolve) => {
        const stop = onAuthStateChanged(auth, (firebaseUser) => {
          this.user = firebaseUser
          this.isReady = true
          stop()
          resolve(firebaseUser)
        })
      })
    },

    async login(email, password) {
      this.loading = true
      this.error = ""

      try {
        const userCredential = await loginUser(email, password)
        this.user = userCredential.user
        return userCredential
      } catch (error) {
        this.error = error.code || error.message || "Erreur de connexion."
        throw error
      } finally {
        this.loading = false
      }
    },

    async signup(firstName, lastName, email, password) {
      this.loading = true
      this.error = ""

      try {
        const userCredential = await signupUser(email, password)

        await creerUtilisateur(
          userCredential.user.uid,
          firstName,
          lastName,
          email
        )

        this.user = userCredential.user
        return userCredential
      } catch (error) {
        this.error = error.code || error.message || "Erreur lors de l'inscription."
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = ""

      try {
        await logoutUser()
        this.user = null
      } catch (error) {
        this.error = error.code || error.message || "Erreur lors de la déconnexion."
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendResetPassword(email) {
      this.loading = true
      this.error = ""

      try {
        await resetPassword(email)
      } catch (error) {
        this.error = error.code || error.message || "Erreur de réinitialisation."
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = ""
    },
  },
})