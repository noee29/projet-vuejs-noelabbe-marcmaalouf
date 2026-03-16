<script setup>
import defaultAuthImage from "@/assets/images/Authentification.png"

const props = defineProps({
  imageSrc: {
    type: String,
    default: defaultAuthImage,
  },
})
</script>

<template>
  <div class="auth-page">
    <div class="auth-wrapper">
      <div class="auth-illustration">
        <img :src="props.imageSrc" alt="Illustration authentification" />
      </div>

      <div class="auth-card">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 80px);
  background: #f3f3f3;
  padding: 60px 120px;
}

.auth-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
}

.auth-illustration {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-illustration img {
  width: 100%;
  max-width: 520px;
  height: auto;
  object-fit: contain;
  display: block;
}

.auth-card {
  width: 100%;
  max-width: 490px;
  background: #f2f6ff;
  border-radius: 34px;
  padding: 40px 40px 32px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.16);
}

/* Laptop */
@media (max-width: 1200px) {
  .auth-page {
    padding: 50px 80px;
  }

  .auth-wrapper {
    gap: 50px;
  }

  .auth-card {
    max-width: 460px;
  }
}

/* Tablet */
@media (max-width: 900px) {
  .auth-page {
    padding: 40px;
  }

  .auth-wrapper {
    flex-direction: column;
    gap: 32px;
  }

  .auth-illustration img {
    max-width: 380px;
  }

  .auth-card {
    max-width: 100%;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .auth-page {
    padding: 24px;
  }

  .auth-card {
    padding: 28px 20px 24px;
    border-radius: 24px;
  }

  .auth-illustration img {
    max-width: 280px;
  }
}
</style>