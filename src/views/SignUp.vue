<script setup>
import AuthContainer from "@/components/AuthContainer.vue"
import { ref, computed } from "vue"
import { useRouter, RouterLink } from "vue-router"
import { useAuthStore } from "@/stores/authStore"

import eyeOpen from "@/assets/icons/Icon-eye-open.png"
import eyeClosed from "@/assets/icons/Icon-eye-closed.png"

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref("")
const lastName = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const errorMessage = ref("")
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const motDePasseType = computed(() => {
  return showPassword.value ? "text" : "password"
})

const iconeMotDePasse = computed(() => {
  return showPassword.value ? eyeOpen : eyeClosed
})

const confirmationMotDePasseType = computed(() => {
  return showConfirmPassword.value ? "text" : "password"
})

const iconeConfirmationMotDePasse = computed(() => {
  return showConfirmPassword.value ? eyeOpen : eyeClosed
})

const handleSignup = async () => {
  errorMessage.value = ""

  if (
    !firstName.value ||
    !lastName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = "Veuillez remplir tous les champs."
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = "Le mot de passe doit contenir au moins 6 caractères."
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Les mots de passe ne correspondent pas."
    return
  }

  try {
    await authStore.signup(
      firstName.value,
      lastName.value,
      email.value,
      password.value
    )

    router.push("/generer")
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      errorMessage.value = "Cet email est déjà utilisé."
    } else if (error.code === "auth/invalid-email") {
      errorMessage.value = "Adresse email invalide."
    } else if (error.code === "auth/weak-password") {
      errorMessage.value = "Mot de passe trop faible."
    } else if (error.code === "auth/operation-not-allowed") {
      errorMessage.value = "Email/Password n'est pas activé dans Firebase."
    } else {
      errorMessage.value = error.code || error.message || "Impossible de créer le compte."
    }
  }
}

const loading = computed(() => authStore.loading)
</script>

<template>
  <AuthContainer>
    <div class="signup-content">
      <h1>S'inscrire</h1>

      <form class="signup-form" @submit.prevent="handleSignup">
        <div class="name-row">
          <div class="input-group half">
            <label for="firstName">Prénom</label>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              placeholder="Veuillez entrer votre prénom"
            />
          </div>

          <div class="input-group half">
            <label for="lastName">Nom</label>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              placeholder="Veuillez entrer votre nom"
            />
          </div>
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Veuillez entrer votre email"
          />
        </div>

        <div class="input-group">
          <label for="password">Mot de passe</label>
          <div class="password-field">
            <input
              id="password"
              v-model="password"
              :type="motDePasseType"
              placeholder="Veuillez entrer votre mot de passe"
            />
            <img
              :src="iconeMotDePasse"
              alt="Afficher ou masquer le mot de passe"
              class="eye-icon"
              @click="togglePassword"
            />
          </div>
        </div>

        <div class="input-group">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <div class="password-field">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="confirmationMotDePasseType"
              placeholder="Veuillez confirmer votre mot de passe"
            />
            <img
              :src="iconeConfirmationMotDePasse"
              alt="Afficher ou masquer le mot de passe"
              class="eye-icon"
              @click="toggleConfirmPassword"
            />
          </div>
        </div>

        <button type="submit" class="signup-btn" :disabled="loading">
          <span v-if="loading">Création...</span>
          <span v-else>S'inscrire</span>
        </button>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <p class="register-text">
          Vous avez déjà un compte ?
          <RouterLink to="/login">Connectez-vous ici.</RouterLink>
        </p>
      </form>
    </div>
  </AuthContainer>
</template>

<style scoped>
.signup-content h1 {
  text-align: center;
  font-size: 34px;
  font-weight: 700;
  color: #000;
  margin-bottom: 34px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.name-row {
  display: flex;
  gap: 22px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-group.half {
  flex: 1;
}

.input-group label {
  font-size: 18px;
  color: #111;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  height: 40px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  padding: 0 14px;
  background: #fffdfb;
  font-size: 14px;
  color: #333;
  outline: none;
}

.input-group input::placeholder {
  color: #9b9b9b;
}

.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.password-field input {
  padding-right: 42px;
}

.eye-icon {
  position: absolute;
  right: 12px;
  width: 18px;
  height: 18px;
  object-fit: contain;
  cursor: pointer;
}

.signup-btn {
  margin-top: 12px;
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 4px;
  background: #071635;
  color: white;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
}

.signup-btn:hover {
  background: #0c2347;
}

.signup-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  margin-top: 4px;
  text-align: center;
  font-size: 14px;
  color: #d32f2f;
  font-weight: 500;
}

.register-text {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: #222;
}

.register-text a {
  color: #0b1c2d;
  text-decoration: none;
  font-weight: 600;
}

.register-text a:hover {
  text-decoration: underline;
}

@media (max-width: 1200px) {
  .signup-content h1 {
    font-size: 30px;
  }
}

@media (max-width: 900px) {
  .signup-content h1 {
    font-size: 28px;
    margin-bottom: 28px;
  }

  .input-group label {
    font-size: 16px;
  }

  .name-row {
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .signup-content h1 {
    font-size: 26px;
  }

  .name-row {
    flex-direction: column;
    gap: 18px;
  }

  .signup-btn {
    font-size: 16px;
  }
}
</style>