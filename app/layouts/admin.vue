<template>
  <div class="admin-layout-wrapper">
    <!-- Left Sidebar Menu -->
    <AdminHeader :is-sidebar-open="isSidebarOpen" @toggle-sidebar="toggleSidebar" />

    <!-- Right Content Area -->
    <div class="admin-main-panel" :class="{ 'sidebar-closed': !isSidebarOpen }">
      <!-- Top Navbar Header -->
      <header class="admin-top-navbar">
        <div class="navbar-left">
          <button class="menu-toggle-btn" @click="toggleSidebar" aria-label="Toggle Sidebar">
            <i class="fas fa-bars"></i>
          </button>
        </div>
        <div class="navbar-right">
          <span class="system-title">Sistem Informasi Pengelolaan Portofolio & Pesanan</span>
          <div class="top-nav-actions">
            <button class="navbar-btn" title="Refresh Data" @click="triggerRefresh">
              <i class="fas fa-sync"></i>
            </button>
            <button class="navbar-btn" title="Toggle Theme" @click="toggleTheme">
              <i :class="['fas', isDark ? 'fa-moon' : 'fa-sun']"></i>
            </button>
            <button class="navbar-btn logout-btn" title="Logout" @click="handleLogout">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Page Slot Content -->
      <main class="admin-content-viewport">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isSidebarOpen = ref(true)
const isDark = ref(true)
const refreshTrigger = useState('admin-refresh-trigger', () => 0)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

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
    
    // In mobile view, start with closed sidebar
    if (window.innerWidth < 992) {
      isSidebarOpen.value = false
    }
  }
})
</script>

<style>
/* Reset and global layout settings */
.admin-layout-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb; /* Clean light gray by default */
  color: #1f2937;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

body.dark-mode .admin-layout-wrapper {
  background-color: #0d0d0d;
  color: #c5a880;
}

.admin-main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: all 0.3s ease;
}

/* Top Navbar */
.admin-top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

body.dark-mode .admin-top-navbar {
  background-color: #161616;
  border-bottom: 1px solid rgba(197, 168, 128, 0.15);
}

.menu-toggle-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #4b5563;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.menu-toggle-btn:hover {
  background-color: #f3f4f6;
}

body.dark-mode .menu-toggle-btn {
  color: #c5a880;
}

body.dark-mode .menu-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.system-title {
  font-weight: 500;
  font-size: 0.95rem;
  color: #4b5563;
}

body.dark-mode .system-title {
  color: rgba(255, 255, 255, 0.7);
}

.top-nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar-btn {
  background: none;
  border: none;
  color: #4b5563;
  font-size: 1.05rem;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.navbar-btn:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.navbar-btn.logout-btn {
  color: #ff4d4d;
}

.navbar-btn.logout-btn:hover {
  background-color: rgba(255, 77, 77, 0.1);
}

body.dark-mode .navbar-btn {
  color: #c5a880;
}

body.dark-mode .navbar-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

body.dark-mode .navbar-btn.logout-btn:hover {
  background-color: rgba(255, 77, 77, 0.15);
}

/* Content Area */
.admin-content-viewport {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

@media (max-width: 992px) {
  .system-title {
    display: none;
  }
}
</style>

