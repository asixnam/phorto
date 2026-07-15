<template>
  <div class="login-container-page">
    <!-- ================= LOGIN SECTION ================= -->
    <div class="login-container">
      <div class="about-card" style="max-width: 400px; width: 100%; text-align: center;">
        <div class="section-tag">// SECURE_UPLINK_REQUIRED</div>
        <h1 class="service-title">ADMIN LOGIN</h1>
        <form id="loginForm" class="modal-form" @submit.prevent="handleLogin">
          <div class="form-group" style="position: relative;">
            <label>ACCESS_KEY</label>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="adminPassword" 
              v-model="password"
              placeholder="Enter security key" 
              required
              style="background: rgba(255,255,255,0.05); border: 1px solid var(--text-primary); text-align: center; letter-spacing: 5px; color: var(--text-secondary); width: 100%;"
            >
            <i 
              id="togglePassword" 
              :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']"
              @click="showPassword = !showPassword"
              style="position: absolute; right: 15px; top: 35px; cursor: pointer; opacity: 0.5;"
            ></i>
          </div>
          <button type="submit" class="service-cta" :disabled="isLoggingIn" style="width: 100%; border: none; cursor: pointer; margin-top: 20px;">
            <span v-if="isLoggingIn"><i class="fas fa-spinner fa-spin"></i> AUTHENTICATING...</span>
            <span v-else><i class="fas fa-unlock"></i> AUTHORIZE</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Avoid rendering default layout (which contains public header/footer)
definePageMeta({
  layout: false
})

const password = ref('')
const showPassword = ref(false)
const isLoggingIn = ref(false)

onMounted(async () => {
  if (process.client) {
    document.body.classList.add('dark-mode')
    
    // Check if session already exists
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
    if (session) {
      navigateTo('/admin/dashboard')
    }
  }
})

const handleLogin = async () => {
  isLoggingIn.value = true
  const email = "admin@asixnam.com"

  try {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase.auth.signInWithPassword({
      email: email,
      password: password.value.trim()
    })

    if (error) throw error

    navigateTo('/admin/dashboard')
  } catch (err) {
    let msg = err.message
    if (msg === "Invalid login credentials") {
      msg = "Password Salah. Silakan cek kembali."
    }
    alert('LOGIN GAGAL: ' + msg)
  } finally {
    isLoggingIn.value = false
  }
}
</script>

<style scoped>
.login-container-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
}
</style>
