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
  const currentHash = window.location.hash;
  const menuLinks = document.querySelectorAll('.menu-link');

  menuLinks.forEach(link => {
    const linkUrl = new URL(link.href);
    const linkPath = linkUrl.pathname;
    const linkHash = linkUrl.hash;
    
    // Check jika path dan hash cocok
    if (linkPath === currentPath && linkHash === currentHash) {
      link.classList.add('active');
    } else if (linkPath === currentPath && !currentHash && !linkHash) {
      link.classList.add('active');
    }
  });
  
  // Tambahkan event listener untuk update active state saat menu diklik
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// Initialize semua fungsi saat DOM ready
document.addEventListener('DOMContentLoaded', () => {
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