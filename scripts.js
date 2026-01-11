// Load Header from external file
function loadHeader() {
  const headerContainer = document.getElementById('header-container');
  
  fetch('header.html')
    .then(response => response.text())
    .then(html => {
      headerContainer.innerHTML = html;
      initHamburgerMenu();
    })
    .catch(error => console.error('Error loading header:', error));
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

// Load header on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
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

// Carousel for "What I Do" Section
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.services-carousel');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (!carousel || !prevBtn || !nextBtn) return;
  
  const cards = carousel.querySelectorAll('.service-card');
  let currentIndex = 0;
  let autoSlideInterval;
  
  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const gap = 20; // Gap between cards
    const offset = -(currentIndex * (cardWidth + gap));
    carousel.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
    
    // Update button states
    // prevBtn.disabled = currentIndex === 0;
    // nextBtn.disabled = currentIndex === cards.length - 1;
  }
  
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, cards.length - 1));
    updateCarousel();
    resetAutoSlide();
  }
  
  function nextSlide() {
    if (currentIndex < cards.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(0); // Loop back to start
    }
  }
  
  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else {
      goToSlide(cards.length - 1); // Loop to end
    }
  }
  
  // Auto slide functionality
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds
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
    dot.addEventListener('click', () => goToSlide(index));
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
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  });
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoSlide();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
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
  updateCarousel();
  startAutoSlide();
  
  // Update on window resize
  window.addEventListener('resize', updateCarousel);

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