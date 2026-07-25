<template>
  <header class="cyber-header">
    <div class="container navbar">
      <!-- Left: Profile -->
      <div class="nav-profile">
        <div class="profile-avatar">
          <img src="/logo.png" alt="Logo">
        </div>
        <div class="profile-info">
          <div class="profile-name">ASIX NAM</div>
        </div>
      </div>

      <!-- Center: Icons Navigation -->
      <nav class="nav-center-icons">
        <NuxtLink to="/" class="nav-icon" exact-active-class="active" title="Home">
          <i class="fas fa-gamepad"></i><span>HOME</span>
        </NuxtLink>
        <NuxtLink to="/cv" class="nav-icon" active-class="active" title="Resume">
          <i class="fas fa-khanda"></i><span>CV</span>
        </NuxtLink>
        <!-- <NuxtLink to="/#services" class="nav-icon" title="Lore">
          <i class="fas fa-scroll"></i><span>SKILLS</span>
        </NuxtLink> -->
        <NuxtLink to="/portfolio" class="nav-icon" active-class="active" title="Portfolio">
          <i class="fas fa-bolt"></i><span>PORTFOLIO</span>
        </NuxtLink>
        <NuxtLink to="/shop" class="nav-icon" active-class="active" title="Shop">
          <i class="fas fa-shopping-bag"></i><span>SHOP</span>
        </NuxtLink>
      </nav>

      <!-- Right: Stats & Actions -->
      <div class="nav-right-cyber">
        <div class="cyber-actions">
          <button id="darkModeToggle" class="cyber-btn-mini" aria-label="Toggle dark mode" @click="toggleDarkMode">
            <i v-show="!isDarkMode" class="fas fa-sun sun-icon"></i>
            <i v-show="isDarkMode" class="fas fa-moon moon-icon"></i>
          </button>
          <a href="https://github.com/asixnam" target="_blank" rel="noopener noreferrer" class="cyber-btn-mini">
            <i class="fab fa-github"></i>
          </a>
        </div>
        
        <!-- Hamburger Button (visible on mobile/tablet) -->
        <!-- <button 
          id="hamburgerBtn" 
          class="cyber-btn-mini hamburger-btn" 
          :class="{ active: isMenuOpen }"
          @click="toggleMenu"
          aria-label="Toggle menu"
          style="display: none;"
        >
          <i class="fas fa-bars"></i>
        </button> -->
      </div>
    </div>
  </header>

  <!-- Mobile Menu -->
  <ul class="mobile-menu" id="mobileMenu" :class="{ active: isMenuOpen }">
    <li>
      <NuxtLink to="/" exact-active-class="active" @click="closeMenu">
        <i class="fas fa-gamepad"></i>
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/#services" @click="closeMenu">
        <i class="fas fa-scroll"></i>
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/cv" active-class="active" @click="closeMenu">
        <i class="fas fa-khanda"></i>
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/portfolio" active-class="active" @click="closeMenu">
        <i class="fas fa-bolt"></i>
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/shop" active-class="active" @click="closeMenu">
        <i class="fas fa-shopping-bag"></i>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDarkMode = ref(true)
const isMenuOpen = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (process.client) {
    if (isDarkMode.value) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    isDarkMode.value = savedTheme === 'dark'
    if (isDarkMode.value) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }
})
</script>

<style scoped>
/* Scoped overrides to handle mobile display */
@media (max-width: 768px) {
  .hamburger-btn {
    display: block !important;
  }
}
</style>
