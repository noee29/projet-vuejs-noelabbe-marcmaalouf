<script setup>
const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(["select"])

const handleSelect = () => {
  emit("select", props.type)
}
</script>

<template>
  <div class="cv-container">
    <div class="cv-preview">
      <img :src="props.imageSrc" :alt="props.label" />
    </div>

    <button class="cv-btn" @click="handleSelect">
      {{ props.label }}
    </button>
  </div>
</template>

<style scoped>
.cv-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  flex: 1;
}

.cv-preview {
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.14);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cv-preview:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
}

.cv-preview img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.cv-btn {
  width: 100%;
  background: #0b1c2d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 18px 0;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cv-btn:hover {
  background: #122a44;
}
</style>