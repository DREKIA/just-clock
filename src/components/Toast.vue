<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['success', 'error', 'info', 'warning'],
    default: 'info',
  },
  duration: {
    type: Number,
    default: 3000,
  },
})

const isVisible = ref(false)

watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      isVisible.value = true
      setTimeout(() => {
        isVisible.value = false
      }, props.duration)
    }
  }
)
</script>

<template>
  <transition name="toast-fade">
    <div v-if="isVisible" class="toast" :class="`toast-${type}`">
      <span class="toast-message">{{ message }}</span>
    </div>
  </transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}

.toast-success {
  background-color: #10b981;
  color: white;
}

.toast-error {
  background-color: #ef4444;
  color: white;
}

.toast-info {
  background-color: #3b82f6;
  color: white;
}

.toast-warning {
  background-color: #f59e0b;
  color: white;
}

.toast-message {
  flex: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  transform: translateX(400px);
  opacity: 0;
}
</style>
