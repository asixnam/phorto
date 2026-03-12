// Load Header from external file
function loadHeader() {
  const headerContainer = document.getElementById('header-container');

  fetch('header.html')
    .then(response => response.text())
    .then(html => {
      headerContainer.innerHTML = html;
      initHamburgerMenu();
      initDarkModeToggle();
      setActiveNavLink();
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

// Set Active Navigation Link based on current URL
function setActiveNavLink() {
  let path = window.location.pathname;
  let page = path.split("/").pop();

  if (page === '' || page === '/') {
    page = 'index.html';
  }

  const navLinks = document.querySelectorAll('.nav-center-icons a, .mobile-menu a');

  navLinks.forEach(link => link.classList.remove('active'));

  let found = false;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) {
      link.classList.add('active');
      found = true;
    }
  });

  if (!found && (!page.includes('.html') || page === 'index.html')) {
    document.querySelectorAll('a[href="index.html"]').forEach(link => {
      link.classList.add('active');
    });
  }
}

// Initialize Dark Mode Toggle
function initDarkModeToggle() {
  const toggle = document.getElementById('darkModeToggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  if (!toggle) return;

  // Check for saved theme preference or default to dark mode (cyberpunk default)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const isDark = savedTheme === 'dark';

  if (isDark) {
    document.body.classList.add('dark-mode');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  } else {
    document.body.classList.remove('dark-mode');
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
  }

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkModeNow = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkModeNow ? 'dark' : 'light');

    if (sunIcon && moonIcon) {
      if (isDarkModeNow) {
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

// Initialize Typewriter Effect
function initTypewriterEffect() {
  const elements = document.querySelectorAll('h1, h2, h3, h4, p:not(.signal-text), .section-tag, .hero-tag, .card-tag, .stat-label, .tech-tag');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeElement(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => {
    // Only apply if it doesn't have nested complex structures or is already handled
    if (!el.classList.contains('typewriter-done')) {
      el.classList.add('typewriter-text');
      observer.observe(el);
    }
  });
}

function typeElement(element) {
  const originalHTML = element.innerHTML;
  const textContent = element.textContent.trim();

  // If no text, just show it
  if (!textContent) {
    element.classList.add('typing');
    return;
  }

  // Clear and prepare
  element.innerHTML = '';
  element.classList.add('typing');

  let i = 0;
  const speed = 15; // ms per character (increased speed for smoother feeling)
  const initialDelay = 100; // small delay before starting

  // Advanced approach: Walk the nodes
  const nodes = [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = originalHTML;

  function collectNodes(parent) {
    parent.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const chars = node.textContent.split('');
        chars.forEach(char => nodes.push({ type: 'text', val: char }));
      } else {
        const clone = node.cloneNode(false);
        nodes.push({ type: 'element-start', val: clone });
        collectNodes(node);
        nodes.push({ type: 'element-end' });
      }
    });
  }

  collectNodes(tempDiv);

  let nodeIndex = 0;
  let currentParent = element;
  const parentStack = [element];

  function typeNext() {
    if (nodeIndex < nodes.length) {
      const node = nodes[nodeIndex];

      if (node.type === 'text') {
        currentParent.append(node.val);
      } else if (node.type === 'element-start') {
        const newEl = node.val;
        currentParent.appendChild(newEl);
        currentParent = newEl;
        parentStack.push(newEl);
      } else if (node.type === 'element-end') {
        parentStack.pop();
        currentParent = parentStack[parentStack.length - 1];
      }

      nodeIndex++;
      setTimeout(typeNext, speed);
    } else {
      element.classList.add('typewriter-done');
    }
  }

  setTimeout(typeNext, initialDelay);
}

// Scroll Progress Tracker for Header HUD
function initScrollProgress() {
  const progressBar = document.querySelector('.progress-fill');
  const progressVal = document.querySelector('.stat-val');

  if (!progressBar || !progressVal) return;

  function updateScrollProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;

    if (totalHeight <= 0) return;

    const percentage = Math.min(Math.round((scrollPosition / totalHeight) * 100), 100);

    progressBar.style.width = `${percentage}%`;
    progressVal.textContent = `${percentage}%`;
  }

  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress(); // Initial call
}

// Lazy Load Instagram Feed
function initInstagramLazyLoad() {
  const instagramFeedContainer = document.querySelector('.portfolio-grid.grid-instagram');

  if (!instagramFeedContainer) return;

  console.log('Initializing Instagram lazy load observer...');

  const observerOptions = {
    root: null,
    rootMargin: '200px 0px', // Load it slightly before it comes into view
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Instagram feed in view, loading script...');

        // Create and inject the Instagram embed script
        const script = document.createElement('script');
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);

        // Stop observing once loaded
        observer.unobserve(instagramFeedContainer);
        observer.disconnect();
      }
    });
  }, observerOptions);

  observer.observe(instagramFeedContainer);
}

// Initialize Click Sound Effect
function initClickSound() {
  // Pre-load audio
  const clickAudio = new Audio('public/efek-klik.mp3');
  clickAudio.volume = 0.5; // Sesuaikan volume agar tidak terlalu keras

  // Set global event listener on document
  document.body.addEventListener('click', function (e) {
    // Determine if the clicked element or its parent is an interactive element
    // Mencakup: <a>, <button>, navbar icons, tab buttons, hero buttons, signal buttons, 
    // filter buttons, portfolio grid items, action buttons, dan elemen dengan class 'button'
    const interactiveEl = e.target.closest('button, a, .tab-button, .btn-hud, .btn-signal, .nav-icon, .filter-btn, .portfolio-item, .project-card, .btn-project, .social-icon, .social-btn-mini');

    if (interactiveEl) {
      // Clone node to allow rapid successive clicks
      const soundClone = clickAudio.cloneNode();
      soundClone.volume = 0.5;
      soundClone.play().catch(err => {
        // Browser autoplay/interaction policies might block initial sounds
        console.log('Audio playback prevented by browser policy');
      });

      // Special handling for links that navigate away from the current page
      if (interactiveEl.tagName.toLowerCase() === 'a' && interactiveEl.hasAttribute('href')) {
        const href = interactiveEl.getAttribute('href');
        const target = interactiveEl.getAttribute('target');
        
        // Don't delay if it's an anchor link (starts with #), empty link, or opens in new tab
        if (href && !href.startsWith('#') && target !== '_blank' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault(); // Stop immediate navigation
          
          // Wait briefly for sound to play, then navigate
          setTimeout(() => {
            window.location.href = href;
          }, 150);
        }
      }
    }
  });
}

// --- Starry Cursor Trail Effect (Optimized) ---
function initStarCursor() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: true }); // optimize compositing
  
  canvas.id = 'star-cursor-canvas';
  document.body.appendChild(canvas);
  
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }, 200);
  }, { passive: true });

  const stars = [];
  let mouseX = -100;
  let mouseY = -100;
  let isMoving = false;
  let inactivityTimer = null;
  let animationFrameId = null;

  class Star {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2 + 1;
      this.opacity = 1;
      
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      
      this.rotation = Math.random() * Math.PI;
      this.spinSpeed = (Math.random() - 0.5) * 0.2;
      
      const colors = ['#05df72', '#00d9ff', '#ffffff'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= 0.03; // Faster fadeout for better performance
      this.rotation += this.spinSpeed;
      this.size -= 0.06;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      ctx.beginPath();
      const spikes = 4;
      const outerRadius = this.size;
      const innerRadius = this.size / 2.5;

      let rot = Math.PI / 2 * 3;
      const step = Math.PI / spikes;

      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(Math.cos(rot) * outerRadius, Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(Math.cos(rot) * innerRadius, Math.sin(rot) * innerRadius);
        rot += step;
      }
      ctx.closePath();
      // Removed ctx.shadowBlur as it is extremely expensive on GPU
      ctx.fill();

      ctx.restore();
    }
  }

  function startAnimation() {
    if (!animationFrameId) {
      animate();
    }
  }

  // Use passive listener for better scroll/mouse performance
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Spawn fewer stars to save CPU/GPU cycles
    if (Math.random() > 0.6) {
      stars.push(new Star(mouseX, mouseY));
      startAnimation();
    }

    isMoving = true;
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => { isMoving = false; }, 50);
  }, { passive: true });

  document.addEventListener('click', () => {
    // Fewer explosion particles
    for (let i = 0; i < 5; i++) {
      let star = new Star(mouseX, mouseY);
      star.vx *= 3;
      star.vy *= 3;
      star.size *= 1.5;
      stars.push(star);
    }
    startAnimation();
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    if (isMoving && Math.random() > 0.9) {
       stars.push(new Star(mouseX + (Math.random()-0.5)*10, mouseY + (Math.random()-0.5)*10));
    }

    let activeStars = false;
    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw(ctx);
      
      if (stars[i].opacity <= 0 || stars[i].size <= 0) {
        stars.splice(i, 1);
        i--;
      } else {
        activeStars = true;
      }
    }

    // Stop the animation loop entirely if there are no stars to draw (Saves huge battery/CPU)
    if (activeStars) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      animationFrameId = null;
    }
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initDynamicProjectImages();
  initTypewriterEffect();
  initInstagramLazyLoad();
  initClickSound(); // Initialize sound effect
  initStarCursor(); // Initialize starry cursor trail

  // Check if header is already loaded or wait for it
  const checkHeader = setInterval(() => {
    if (document.querySelector('.cyber-header')) {
      clearInterval(checkHeader);
      initScrollProgress();
    }
  }, 100);
});
