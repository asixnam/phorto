// Initialize Hamburger Menu
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (hamburger && mobileMenu) {
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    
    // Toggle menu saat hamburger diklik
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Tutup menu saat link diklik
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    // Tutup menu saat klik di luar header
    document.addEventListener('click', (e) => {
      if (!e.target.closest('header')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  }
}

// Smooth Scroll untuk navigasi internal
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      // Skip jika hanya # tanpa id
      if (targetId === '#') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(targetId);
      
      if (target) {
        e.preventDefault();
        
        // Tutup mobile menu jika terbuka
        const hamburger = document.getElementById('hamburgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (hamburger && mobileMenu) {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
        }
        
        // Smooth scroll ke target
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Header scroll effect (optional - tambahkan shadow saat scroll)
function initScrollEffect() {
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Tambahkan shadow saat scroll > 0
    if (currentScroll > 0) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
  });
}

// Highlight active menu berdasarkan URL (optional)
function highlightActiveMenu() {
  const currentPath = window.location.pathname;
  const menuLinks = document.querySelectorAll('.menu-link, .mobile-menu a');

  menuLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    if (linkPath === currentPath) {
      link.style.background = '#FFBF00';
      link.style.color = '#fff';
    }
  });
}

// Initialize semua fungsi saat DOM ready
// Load header.html into #header-container, then initialize behaviors
async function loadHeader() {
  const container = document.getElementById('header-container');
  if (!container) return;

  try {
    const res = await fetch('header.html');
    if (res.ok) {
      const html = await res.text();
      container.innerHTML = html;
    }
  } catch (e) {
    // Fetch may fail on file:// protocol; silently ignore
    console.warn('Could not load header.html:', e);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeader();

  // initialize behaviors after header is present in the DOM
  initHamburgerMenu();
  initSmoothScroll();
  initScrollEffect();
  highlightActiveMenu();
});

// Handle resize window
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Tutup mobile menu saat resize ke desktop
    if (window.innerWidth > 768) {
      const hamburger = document.getElementById('hamburgerBtn');
      const mobileMenu = document.getElementById('mobileMenu');
      
      if (hamburger && mobileMenu) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    }
  }, 250);
});