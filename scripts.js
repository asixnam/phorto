// Load Header from external file
function loadHeader() {
  const headerContainer = document.getElementById('header-container');
  
  fetch('header.html')
    .then(response => response.text())
    .then(html => {
      headerContainer.innerHTML = html;
      initHamburgerMenu();
      initDarkModeToggle();
    })
    .catch(error => console.error('Error loading header:', error));
}

// Load Footer from external file
function loadFooter() {
  const footerContainer = document.getElementById('footer-container');
  
  if (footerContainer) {
    fetch('footer.html')
      .then(response => response.text())
      .then(html => {
        footerContainer.innerHTML = html;
      })
      .catch(error => console.error('Error loading footer:', error));
  }
}

// Initialize Dark Mode Toggle
function initDarkModeToggle() {
  const toggle = document.getElementById('darkModeToggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  
  if (!toggle) return;
  
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  }
  
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Toggle icon visibility
    if (sunIcon && moonIcon) {
      if (isDarkMode) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  });
}

// Initialize Hamburger Menu
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (hamburger && mobileMenu) {
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('header')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  }
}

// Load header and footer on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  loadFooter();
});

// Tab switching logic for Resume Section
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      let target = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });
});

// Smooth Carousel for "What I Do" Section with Infinite Loop
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.services-carousel');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (!carousel || !prevBtn || !nextBtn) return;
  
  const cards = Array.from(carousel.querySelectorAll('.service-card'));
  const totalCards = cards.length;
  let currentIndex = 0;
  let autoSlideInterval;
  let isTransitioning = false;
  
  // Clone first and last cards for infinite loop effect
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[totalCards - 1].cloneNode(true);
  
  carousel.appendChild(firstClone);
  carousel.insertBefore(lastClone, cards[0]);
  
  // Update cards array to include clones
  const allCards = carousel.querySelectorAll('.service-card');
  currentIndex = 1; // Start at first real card (after last clone)
  
  function getCardWidth() {
    return allCards[0].offsetWidth;
  }
  
  function updateCarousel(smooth = true) {
    const cardWidth = getCardWidth();
    const offset = -(currentIndex * cardWidth);
    
    if (smooth) {
      carousel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      carousel.style.transition = 'none';
    }
    
    carousel.style.transform = `translateX(${offset}px)`;
    
    // Update dots (only for real cards, not clones)
    const realIndex = ((currentIndex - 1) % totalCards + totalCards) % totalCards;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === realIndex);
    });
  }
  
  function goToSlide(index, smooth = true) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    currentIndex = index;
    updateCarousel(smooth);
    
    setTimeout(() => {
      isTransitioning = false;
    }, 600);
    
    resetAutoSlide();
  }
  
  function nextSlide() {
    if (isTransitioning) return;
    
    currentIndex++;
    updateCarousel(true);
    
    // Check if we're at the first clone (after last real card)
    if (currentIndex === totalCards + 1) {
      setTimeout(() => {
        currentIndex = 1; // Jump to first real card
        updateCarousel(false);
      }, 600);
    }
    
    isTransitioning = true;
    setTimeout(() => {
      isTransitioning = false;
    }, 600);
    
    resetAutoSlide();
  }
  
  function prevSlide() {
    if (isTransitioning) return;
    
    currentIndex--;
    updateCarousel(true);
    
    // Check if we're at the last clone (before first real card)
    if (currentIndex === 0) {
      setTimeout(() => {
        currentIndex = totalCards; // Jump to last real card
        updateCarousel(false);
      }, 600);
    }
    
    isTransitioning = true;
    setTimeout(() => {
      isTransitioning = false;
    }, 600);
    
    resetAutoSlide();
  }
  
  // Auto slide functionality
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, 4500); // Change slide every 4.5 seconds
  }
  
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }
  
  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }
  
  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (isTransitioning) return;
      goToSlide(index + 1, true); // +1 because of the cloned card at start
    });
  });
  
  // Pause auto-slide on hover
  const carouselContainer = document.querySelector('.services-carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
  }
  
  // Touch/Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartTime = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartTime = Date.now();
    stopAutoSlide();
  }, { passive: true });
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoSlide();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 75;
    const diff = touchStartX - touchEndX;
    const timeDiff = Date.now() - touchStartTime;
    
    // Only register as swipe if it's fast enough (less than 300ms)
    if (Math.abs(diff) > swipeThreshold && timeDiff < 300) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  
  // Initialize
  updateCarousel(false);
  startAutoSlide();
  
  // Update on window resize with debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateCarousel(false);
    }, 250);
  })

// Portfolio Filter System
document.addEventListener('DOMContentLoaded', function() {
  
  // Ambil semua tombol filter dan portfolio items
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  // Fungsi untuk filter portfolio
  function filterPortfolio(category) {
    portfolioItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      
      if (category === 'all') {
        // Tampilkan semua item
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 10);
      } else if (itemCategory === category) {
        // Tampilkan item yang sesuai kategori
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 10);
      } else {
        // Sembunyikan item yang tidak sesuai
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }

  // Tambahkan event listener pada setiap tombol filter
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Hapus class 'active' dari semua tombol
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Tambahkan class 'active' pada tombol yang diklik
      this.classList.add('active');
      
      // Ambil kategori dari data-filter
      const filterValue = this.getAttribute('data-filter');
      
      // Jalankan fungsi filter
      filterPortfolio(filterValue);
    });
  });

  // Tampilkan semua item saat halaman pertama kali dimuat
  filterPortfolio('all');
});

// Optional: Smooth scroll for navigation (if you add internal links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Optional: Smooth scroll for navigation (if you add internal links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
});