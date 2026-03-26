<script setup>
import { RouterLink } from "vue-router"
</script>

<template>
  <section class="not-found-page">
    <div class="not-found-card">
      <p class="code">404</p>
      <h1>Page non trouvee</h1>
      <p class="message">
        La route que vous cherchez n'existe pas ou n'est plus disponible.
      </p>
      <RouterLink to="/" class="home-link">Retour a l'accueil</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 65px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f3f3f3;
}

.not-found-card {
  width: 100%;
  max-width: 520px;
  padding: 36px 28px;
  text-align: center;
  background: #f2f6ff;
  border-radius: 20px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.14);
}

.code {
  font-size: 52px;
  line-height: 1;
  font-weight: 700;
  color: #071635;
  margin-bottom: 12px;
}

h1 {
  font-size: 30px;
  color: #111;
  margin-bottom: 12px;
}

.message {
  font-size: 16px;
  color: #333;
  margin-bottom: 24px;
}

.home-link {
  display: inline-block;
  min-width: 180px;
  padding: 10px 16px;
  border-radius: 6px;
  background: #071635;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.home-link:hover {
  background: #0c2347;
}

@media (max-width: 600px) {
  .not-found-card {
    padding: 28px 18px;
  }

  .code {
    font-size: 44px;
  }

  h1 {
    font-size: 26px;
  }
}
</style>
