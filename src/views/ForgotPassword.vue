<script>
import AuthContainer from "@/components/AuthContainer.vue"
import { RouterLink } from "vue-router"
import { resetPassword } from "@/services/auth"
import forgotPasswordImage from "@/assets/images/mot-de-passe-oublie.png"

export default {
  name: "ForgotPassword",
  components: {
    AuthContainer,
    RouterLink,
  },
  data() {
    return {
      email: "",
      message: "",
      errorMessage: "",
      loading: false,
      forgotPasswordImage,
    }
  },
  methods: {
    async sendResetEmail() {
      this.message = ""
      this.errorMessage = ""

      if (!this.email) {
        this.errorMessage = "Veuillez entrer votre email."
        return
      }

      try {
        this.loading = true
        await resetPassword(this.email)
        this.message =
          "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé."
      } catch (error) {
        this.errorMessage =
          "Impossible d'envoyer l'email de réinitialisation."
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <AuthContainer :image-src="forgotPasswordImage">
    <div class="login-content">
      <h1>Réinitialiser le mot de passe</h1>

      <p class="description-text">
        Ne t'inquiète pas ! Cela arrive. Veuillez entrer votre adresse email et
        vous recevrez un lien de création d'un nouveau mot de passe.
      </p>

      <form class="login-form" @submit.prevent="sendResetEmail">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="Veuillez entrer votre email"
          />
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? "Envoi..." : "Envoyer" }}
        </button>

        <p v-if="message" class="info-message">{{ message }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <p class="register-text">
          <RouterLink to="/login">Retour à la connexion</RouterLink>
        </p>
      </form>
    </div>
  </AuthContainer>
</template>

<style scoped>
.login-content h1 {
  text-align: center;
  font-size: 34px;
  font-weight: 700;
  color: #000;
  margin-bottom: 34px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.description-text {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.3;
  color: #111;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.login-btn {
  margin-top: 8px;
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

.login-btn:hover {
  background: #0c2347;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.info-message {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: #0b1c2d;
}

.error-message {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: #d32f2f;
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

/* Laptop */
@media (max-width: 1200px) {
  .login-content h1 {
    font-size: 30px;
  }
}

/* Tablet */
@media (max-width: 900px) {
  .login-content h1 {
    font-size: 28px;
    margin-bottom: 28px;
  }

  .input-group label {
    font-size: 16px;
  }

  .register-text {
    font-size: 14px;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .login-content h1 {
    font-size: 26px;
  }

  .login-btn {
    font-size: 16px;
  }
}
</style>