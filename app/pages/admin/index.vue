<template>
  <div class="admin-login-wrapper">
    <!-- Left Pane: Branding & Graphics -->
    <div class="login-brand-side">
      <!-- Concentric Decorative Arc Lines -->
      <div class="deco-lines">
        <div class="line line-1"></div>
        <div class="line line-2"></div>
        <div class="line line-3"></div>
        <div class="line line-4"></div>
        <div class="line line-5"></div>
      </div>

      <div class="brand-header">
        <img src="/logo.png" alt="asixnam logo" class="brand-logo">
      </div>

      <div class="brand-content">
        <div class="brand-asterisk">✶</div>
        <h1 class="brand-title">Hello<br><span class="brand-highlight">asixnam! 👋</span></h1>
        <p class="brand-subtitle">
          Manage your portfolio, update services, track incoming orders, and control your digital workspace. Empowering your creative showcase.
        </p>
      </div>

      <div class="brand-footer">
        <p class="copyright">© 2026 asixnam. All rights reserved.</p>
      </div>
    </div>

    <!-- Right Pane: Login Form -->
    <div class="login-form-side">
      <div class="form-content-wrapper">
        <div class="mobile-logo-header">
          <img src="/logo.png" alt="asixnam logo" class="mobile-brand-logo">
        </div>

        <div class="form-header">
          <div class="section-tag">// SECURE_UPLINK_REQUIRED</div>
          <h2 class="form-title">Welcome Back!</h2>
          <p class="form-subtitle">Please enter your access key to authorize session.</p>
        </div>

        <form id="loginForm" class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="asixnam" class="input-label">ACCESS_KEY</label>
            <div class="input-container">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="asixnam" 
                v-model="password"
                placeholder="Enter security key" 
                required
                class="custom-input"
              >
              <button 
                type="button"
                class="toggle-password-btn"
                @click="showPassword = !showPassword"
                aria-label="Toggle Password Visibility"
              >
                <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="auth-btn" :disabled="isLoggingIn">
            <span v-if="isLoggingIn" class="btn-content">
              <i class="fas fa-spinner fa-spin"></i> AUTHENTICATING...
            </span>
            <span v-else class="btn-content">
              <i class="fas fa-unlock"></i> AUTHORIZE
            </span>
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
  const enteredPassword = password.value.trim()

  try {
    const { $supabase } = useNuxtApp()
    
    // Query database for admin_password
    const { data, error } = await $supabase
      .from('admin_config')
      .select('value')
      .eq('key', 'admin_password')
      .single()

    if (error) {
      throw new Error("Gagal mengambil data autentikasi dari database. Silakan pastikan tabel 'admin_config' telah dibuat.")
    }

    if (data && data.value === enteredPassword) {
      // Successful login
      if (process.client) {
        localStorage.setItem('admin_session_token', 'authenticated')
      }
      navigateTo('/admin/dashboard')
    } else {
      throw new Error("Password Salah. Silakan cek kembali.")
    }
  } catch (err) {
    alert('LOGIN GAGAL: ' + err.message)
  } finally {
    isLoggingIn.value = false
  }
}
</script>

<style scoped>
.admin-login-wrapper {
  min-height: 100vh;
  display: flex;
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  overflow: hidden;
}

/* ================= LEFT SIDE (BRANDING) ================= */
.login-brand-side {
  position: relative;
  flex: 1.2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 60px;
  background: linear-gradient(135deg, #090909 0%, #1c150e 100%);
  border-right: 1px solid var(--border-color);
  overflow: hidden;
}

.deco-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.line {
  position: absolute;
  border: 1px solid rgba(197, 168, 128, 0.04);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.line-1 { width: 500px; height: 500px; top: 50%; left: 115%; }
.line-2 { width: 700px; height: 700px; top: 50%; left: 115%; }
.line-3 { width: 900px; height: 900px; top: 50%; left: 115%; }
.line-4 { width: 1100px; height: 1100px; top: 50%; left: 115%; }
.line-5 { width: 1300px; height: 1300px; top: 50%; left: 115%; }

.brand-header {
  position: relative;
  z-index: 2;
}

.brand-logo {
  height: 48px;
  object-fit: contain;
}

.brand-content {
  position: relative;
  z-index: 2;
  margin-bottom: 40px;
}

.brand-asterisk {
  font-size: 3.5rem;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 20px;
}

.brand-title {
  font-family: 'SilverEditorial', 'August', serif;
  font-size: clamp(2.5rem, 4vw, 4rem);
  line-height: 1.15;
  color: var(--text-primary);
  margin-bottom: 20px;
  font-weight: 400;
}

.brand-highlight {
  color: var(--text-secondary);
  font-weight: 400;
}

.brand-subtitle {
  font-family: var(--font-main);
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.6;
  color: var(--text-secondary);
  opacity: 0.75;
  max-width: 420px;
}

.brand-footer {
  position: relative;
  z-index: 2;
}

.copyright {
  font-family: var(--font-main);
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.5;
}

/* ================= RIGHT SIDE (FORM) ================= */
.login-form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  background-color: var(--bg-primary);
}

.form-content-wrapper {
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.mobile-logo-header {
  display: none;
}

.mobile-brand-logo {
  height: 36px;
  object-fit: contain;
}

.form-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-primary);
  letter-spacing: 1px;
}

.form-title {
  font-family: 'SilverEditorial', 'August', serif;
  font-size: 2.5rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.2;
  font-weight: 400;
}

.form-subtitle {
  font-family: var(--font-main);
  font-size: 0.95rem;
  color: var(--text-secondary);
  opacity: 0.6;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 2px;
  color: var(--text-primary);
  font-weight: 600;
}

.input-container {
  position: relative;
  width: 100%;
}

.custom-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--border-color);
  padding: 12px 40px 12px 0;
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-family: var(--font-main);
  letter-spacing: 4px;
  transition: all 0.3s ease;
}

.custom-input::placeholder {
  letter-spacing: normal;
  color: var(--text-secondary);
  opacity: 0.25;
  font-size: 0.95rem;
}

.custom-input:focus {
  outline: none;
  border-bottom-color: var(--text-primary);
  box-shadow: 0 1px 0 var(--text-primary);
}

.toggle-password-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  opacity: 0.5;
  cursor: pointer;
  padding: 8px 0;
  transition: opacity 0.2s ease;
}

.toggle-password-btn:hover {
  opacity: 0.9;
}

.auth-btn {
  width: 100%;
  background-color: var(--text-primary);
  color: var(--bg-primary);
  border: 1px solid var(--text-primary);
  padding: 14px 20px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;
  margin-top: 10px;
}

.auth-btn:hover:not(:disabled) {
  background-color: transparent;
  color: var(--text-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(197, 168, 128, 0.25);
}

.auth-btn:active:not(:disabled) {
  transform: translateY(0);
}

.auth-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 900px) {
  .login-brand-side {
    display: none;
  }
  .login-form-side {
    flex: 1;
    padding: 60px 24px;
  }
  .mobile-logo-header {
    display: block;
  }
}
</style>
