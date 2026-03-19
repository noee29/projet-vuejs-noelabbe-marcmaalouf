<script setup>
import { useRouter } from "vue-router"
import CVContainer from "@/components/CVContainer.vue"
import cvAts from "@/assets/images/cv-ats.jpg"
import cvMain from "@/assets/images/cv-template-colorfiul.jpg"

const router = useRouter()

const handleSelect = (type) => {
  router.push("/generer/" + type)
}
</script>

<template>
  <div class="generer-page">
    <section class="generer-hero">
      <h1>Choisissez votre CV</h1>
      <p>Sélectionnez le modèle qui correspond le mieux à votre profil</p>
    </section>

    <section class="cv-grid">
      <CVContainer
        :imageSrc="cvAts"
        label="CV ATS"
        type="ats"
        @select="handleSelect"
      />

      <CVContainer
        :imageSrc="cvMain"
        label="CV À LA MAIN"
        type="main"
        @select="handleSelect"
      />
    </section>


  </div>
</template>

<style scoped>
.generer-page {
  min-height: calc(100vh - 80px);
  background: #f3f3f3;
}

.generer-hero {
  background: #2f89e5;
  text-align: center;
  padding: 60px 120px 80px;
  position: relative;
  overflow: hidden;
}

.generer-hero::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 80px;
  background: #f3f3f3;
  clip-path: polygon(0 100%, 100% 0, 100% 100%);
}

.generer-hero h1 {
  color: white;
  font-size: 38px;
  font-weight: 700;
  margin-bottom: 12px;
}

.generer-hero p {
  color: white;
  font-size: 16px;
  opacity: 0.88;
}

.cv-grid {
  display: flex;
  gap: 48px;
  max-width: 1000px;
  margin: 40px auto 48px;
  padding: 0 60px;
}

/* Laptop */
@media (max-width: 1200px) {
  .generer-hero {
    padding: 50px 80px 70px;
  }

  .cv-grid {
    padding: 0 40px;
    gap: 36px;
  }

  .info-section {
    padding: 0 40px;
  }
}

/* Tablet */
@media (max-width: 900px) {
  .generer-hero {
    padding: 40px 40px 60px;
  }

  .generer-hero h1 {
    font-size: 30px;
  }

  .cv-grid {
    padding: 0 30px;
    gap: 24px;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .generer-hero {
    padding: 36px 24px 56px;
  }

  .generer-hero h1 {
    font-size: 26px;
  }

  .generer-hero p {
    font-size: 14px;
  }

  .cv-grid {
    flex-direction: column;
    padding: 0 24px;
    gap: 32px;
    margin: 30px auto 36px;
  }
}
</style>