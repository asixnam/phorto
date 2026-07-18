<template>
  <aside class="admin-sidebar" :class="{ 'is-open': isSidebarOpen }">
    <!-- Sidebar Branding -->
    <div class="sidebar-brand">
      <div class="brand-logo">
        <img src="/logo.png" alt="Logo">
      </div>
      <span class="brand-text">PORTFOLIO ADMIN</span>
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
  background-color: #000000; /* Pitch black sidebar */
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: transform 0.3s ease;
  transform: translateX(0);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-logo {
  width: 40px;
  height: 40px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.brand-text {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.close-sidebar-btn {
  display: none;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: auto;
  padding: 4px;
}

/* Sidebar navigation links */
.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
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
}

.sidebar-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

/* Active sidebar nav item styled as gold-brown round card */
.sidebar-nav-item.active {
  background-color: #9f7615; /* Matching the gold-brown background in the screenshot */
  color: #ffffff;
}

.sidebar-nav-item.active i {
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

