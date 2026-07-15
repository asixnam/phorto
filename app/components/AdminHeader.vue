<template>
  <header class="cyber-header">
    <div class="container navbar">
      <!-- Left: Logo & Title -->
      <div class="nav-profile">
        <div class="profile-avatar">
          <img src="/logo.png" alt="Logo">
        </div>
        <div class="profile-info">
          <div class="profile-name">ADMIN<br>ASIX</div>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="nav-right-cyber">
        <div class="cyber-actions" style="border-left: none; padding-left: 0;">
          <button id="refreshBtn" class="cyber-btn-mini" title="Refresh Data" @click="triggerRefresh">
            <i class="fas fa-sync"></i>
          </button>
          <button id="themeToggle" class="cyber-btn-mini" title="Toggle Theme" @click="toggleTheme">
            <i :class="['fas', isDark ? 'fa-moon' : 'fa-sun']"></i>
          </button>
          <button id="logoutBtn" class="cyber-btn-mini" style="color: #ff4d4d;" title="Logout" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const refreshTrigger = useState('admin-refresh-trigger', () => 0)
const isDark = ref(true)

const triggerRefresh = () => {
  refreshTrigger.value++
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (process.client) {
    if (isDark.value) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }
}

const handleLogout = async () => {
  const { $supabase } = useNuxtApp()
  await $supabase.auth.signOut()
  navigateTo('/admin')
}

onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    isDark.value = savedTheme === 'dark'
    if (isDark.value) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }
})
</script>
