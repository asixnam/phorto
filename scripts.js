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

  // Mobile menu is now always visible at bottom, no hamburger needed
  // Don't force-open the mobile menu on all viewports; let hamburger control it
  // (this keeps the menu hidden on desktop even if JS runs)

  if (hamburger && mobileMenu) {
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Don't close the mobile menu on small screens when user clicks links.
        if (window.innerWidth > 768) {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
        }
      });
    });

    // Only close menu on outside click for desktop sizes. On mobile we don't
    // close the menu when user clicks inside page content (per requirement).
    document.addEventListener('click', (e) => {
      if (window.innerWidth > 768 && !e.target.closest('header')) {
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

// Skills Grid - No carousel functionality needed
// Grid layout is handled by CSS

// Portfolio Filter System
document.addEventListener('DOMContentLoaded', function () {

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
    button.addEventListener('click', function () {
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
// Dynamic Project Images from Demo Links
function initDynamicProjectImages() {
  console.log('Initializing dynamic project images...');
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    const demoLink = card.querySelector('.btn-demo');
    const projectImage = card.querySelector('.project-image-wrapper img');

    if (demoLink && projectImage) {
      let url = demoLink.getAttribute('href');
      console.log('Found project card with link:', url);

      // Skip if href is empty or #
      if (!url || url === '#' || url === '') return;

      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
        // Update the href to be valid
        demoLink.setAttribute('href', url);
      }

      // Check if iframe already exists to prevent duplicates
      const wrapper = projectImage.parentElement;
      let iframe = wrapper.querySelector('iframe');

      if (!iframe) {
        // Create new iframe
        iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('loading', 'lazy');
        iframe.classList.add('desktop-view'); // Add mini desktop view class

        // Hide image or remove it
        projectImage.style.display = 'none';

        // Append iframe
        wrapper.appendChild(iframe);
      }

      // Set iframe src to the live URL
      // Note: Some sites deny iframe embedding (X-Frame-Options)
      iframe.src = url;
      console.log('Set iframe src to:', url);
    }
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initDynamicProjectImages();
});
