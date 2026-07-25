<template>
  <aside class="admin-sidebar" :class="{ 'is-open': isSidebarOpen }">
    <!-- Sidebar Branding -->
    <div class="sidebar-brand">
      <div class="brand-logo">
        <img src="/logo.png" alt="Logo">
      </div>
      <span class="brand-text">ASIXNAM ADMIN</span>
      <button class="close-sidebar-btn" @click="$emit('toggle-sidebar')" aria-label="Close Sidebar">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <NuxtLink to="/admin/dashboard" :class="['sidebar-nav-item', { active: isActive('/admin/dashboard') }]">
        <i class="fas fa-th-large"></i><span>Dashboard</span>
      </NuxtLink>
      <NuxtLink to="/admin/orders" :class="['sidebar-nav-item', { active: isActive('/admin/orders') }]">
        <i class="fas fa-shopping-bag"></i><span>Kelola Pesanan</span>
      </NuxtLink>
      <NuxtLink to="/admin/portfolio" :class="['sidebar-nav-item', { active: isActive('/admin/portfolio') }]">
        <i class="fas fa-images"></i><span>Kelola Portofolio</span>
      </NuxtLink>
      <NuxtLink to="/admin/testimonials" :class="['sidebar-nav-item', { active: isActive('/admin/testimonials') }]">
        <i class="fas fa-comments"></i><span>Kelola Testimoni</span>
      </NuxtLink>
      <NuxtLink to="/admin/resume" :class="['sidebar-nav-item', { active: isActive('/admin/resume') }]">
        <i class="fas fa-graduation-cap"></i><span>Kelola Resume</span>
      </NuxtLink>
      <NuxtLink to="/admin/about" :class="['sidebar-nav-item', { active: isActive('/admin/about') }]">
        <i class="fas fa-user-edit"></i><span>Kelola About</span>
      </NuxtLink>
      <NuxtLink to="/admin/hero" :class="['sidebar-nav-item', { active: isActive('/admin/hero') }]">
        <i class="fas fa-image"></i><span>Hero Banner</span>
      </NuxtLink>
      <NuxtLink to="/admin/settings" :class="['sidebar-nav-item', { active: isActive('/admin/settings') }]">
        <i class="fas fa-cog"></i><span>Pengaturan</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

defineProps({
  isSidebarOpen: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle-sidebar'])

const route = useRoute()
const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.admin-sidebar {
  width: 260px;
  background-color: var(--bg-secondary, #ffffff);
  border-right: 1px solid var(--border-color, #e5e7eb);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
  transform: translateX(0);
  box-shadow: var(--shadow-color, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
}

body.dark-mode .admin-sidebar {
  background-color: #161616;
  border-right: 1px solid rgba(197, 168, 128, 0.15);
}

.admin-sidebar:not(.is-open) {
  transform: translateX(-260px);
}

/* Sidebar branding section */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  transition: border-color 0.3s ease;
}

body.dark-mode .sidebar-brand {
  border-bottom: 1px solid rgba(197, 168, 128, 0.15);
}

.brand-logo {
  width: 40px;
  height: 40px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-logo img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.brand-text {
  font-family: 'SilverEditorial', 'August', serif;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--text-secondary, #1c1b18);
  transition: color 0.3s ease;
}

body.dark-mode .brand-text {
  color: #ffffff;
}

.close-sidebar-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary, #8a7051);
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: auto;
  padding: 4px;
  transition: color 0.2s ease;
}

body.dark-mode .close-sidebar-btn {
  color: rgba(255, 255, 255, 0.6);
}

/* Sidebar navigation links */
.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.sidebar-nav-item i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
  color: var(--text-primary, #8a7051);
  transition: color 0.2s ease;
}

.sidebar-nav-item:hover {
  background-color: rgba(138, 112, 81, 0.1);
  color: var(--text-secondary, #1c1b18);
}

.sidebar-nav-item:hover i {
  color: var(--text-primary, #8a7051);
}

/* Active sidebar nav item styled as gold-brown round card */
.sidebar-nav-item.active {
  background-color: #8a7051;
  color: #ffffff;
}

.sidebar-nav-item.active i {
  color: #ffffff;
}

/* Dark mode nav items */
body.dark-mode .sidebar-nav-item {
  color: rgba(255, 255, 255, 0.7);
}

body.dark-mode .sidebar-nav-item i {
  color: var(--text-primary, #c5a880);
}

body.dark-mode .sidebar-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

body.dark-mode .sidebar-nav-item:hover i {
  color: #ffffff;
}

body.dark-mode .sidebar-nav-item.active {
  background-color: #9f7615;
  color: #ffffff;
}

body.dark-mode .sidebar-nav-item.active i {
  color: #ffffff;
}

/* Mobile adjustments */
@media (max-width: 992px) {
  .close-sidebar-btn {
    display: block;
  }
}

/* Add padding to right content when sidebar is open in large screens */
@media (min-width: 993px) {
  :global(.admin-main-panel) {
    margin-left: 260px;
  }
  :global(.admin-main-panel.sidebar-closed) {
    margin-left: 0;
  }
}
</style>

