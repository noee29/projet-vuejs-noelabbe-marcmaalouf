<script setup>
import AuthContainer from "@/components/AuthContainer.vue"
import { RouterLink } from "vue-router"
import { ref } from "vue"

import eyeOpen from "@/assets/icons/Icon-eye-open.png"
import eyeClosed from "@/assets/icons/Icon-eye-closed.png"

const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <AuthContainer>
    <div class="login-content">
      <h1>Se connecter</h1>

      <form class="login-form">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Veuillez entrer votre email"
          />
        </div>

        <div class="input-group">
          <label for="password">Mot de passe</label>
          <div class="password-field">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Veuillez entrer votre mot de passe"
            />

            <img
              :src="showPassword ? eyeOpen : eyeClosed"
              alt="Afficher ou masquer le mot de passe"
              class="eye-icon"
              @click="togglePassword"
            />
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" />
            <span>Se souvenir de moi</span>
          </label>

          <RouterLink to="/forgot-password" class="forgot-password">
            Mot de passe oublié ?
          </RouterLink>
        </div>

        <button type="submit" class="login-btn">Se connecter</button>

        <p class="register-text">
          Vous n’avez pas de compte ?
          <RouterLink to="/signup">
            Inscrivez-vous ici.
          </RouterLink>
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

.form-options {
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #111;
  cursor: pointer;
}

.remember-me input {
  width: 18px;
  height: 18px;
  accent-color: #1b9cf0;
}

.forgot-password {
  font-size: 15px;
  font-weight: 600;
  color: #0b1c2d;
  text-decoration: none;
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

  .forgot-password,
  .remember-me,
  .register-text {
    font-size: 14px;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .login-content h1 {
    font-size: 26px;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
  }

  .login-btn {
    font-size: 16px;
  }
}
</style>