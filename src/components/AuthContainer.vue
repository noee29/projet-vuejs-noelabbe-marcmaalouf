<script setup>
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

.auth-page {
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f3f3;
}

.auth-container {
  width: 420px;
  background: #F2F6FF;
  padding: 40px;
  border-radius: 18px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
}

/* Laptop */
@media (max-width: 1200px) {
  .auth-container {
    width: 380px;
  }
}

/* Tablet */
@media (max-width: 900px) {
  .auth-container {
    width: 320px;
    padding: 30px;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .auth-page {
    padding: 20px;
  }

  .auth-container {
    width: 100%;
  }
}

</style>