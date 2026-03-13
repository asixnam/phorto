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

    if (demoLink && projectImage && !card.classList.contains('no-iframe')) {
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

// --- WebGL "Smokey Cursor" Fluid Simulation ---
function initWebGLFluid() {
  const canvas = document.createElement('canvas');
  canvas.id = 'fluid-canvas';
  document.body.appendChild(canvas);
  canvas.style.position = 'fixed';
  canvas.style.top = '0'; canvas.style.left = '0';
  canvas.style.width = '100%'; canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none'; canvas.style.zIndex = '9999';

  const gl = canvas.getContext('webgl', { alpha: true });
  if (!gl) return;

  const shaders = {
    vertex: `precision highp float; attribute vec2 a_pos; varying vec2 v_uv; void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0, 1); }`,
    splat: `precision highp float; varying vec2 v_uv; uniform sampler2D u_tex; uniform vec3 u_color; uniform vec2 u_point; uniform float u_radius; uniform float u_aspect; void main() { vec2 p = v_uv - u_point; p.x *= u_aspect; vec3 splat = exp(-dot(p, p) / u_radius) * u_color; gl_FragColor = vec4(texture2D(u_tex, v_uv).rgb + splat, 1); }`,
    advect: `precision highp float; varying vec2 v_uv; uniform sampler2D u_vel; uniform sampler2D u_src; uniform float u_dt; uniform float u_diss; void main() { vec2 coord = v_uv - u_dt * texture2D(u_vel, v_uv).xy; gl_FragColor = u_diss * texture2D(u_src, coord); }`,
    display: `precision highp float; varying vec2 v_uv; uniform sampler2D u_tex; void main() { vec4 c = texture2D(u_tex, v_uv); float a = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(c.rgb, a * 0.8); }`
  };

  const createProg = (vs, fs) => {
    const s = (t, src) => { const sh = gl.createShader(t); gl.shaderSource(sh, src); gl.compileShader(sh); return sh; };
    const p = gl.createProgram(); gl.attachShader(p, s(gl.VERTEX_SHADER, vs)); gl.attachShader(p, s(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p); return p;
  };

  const progs = { splat: createProg(shaders.vertex, shaders.splat), advect: createProg(shaders.vertex, shaders.advect), display: createProg(shaders.vertex, shaders.display) };
  const createFBO = (w, h) => {
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, w, h, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo, w, h };
  };

  let density = [createFBO(512, 512), createFBO(512, 512)];
  let velocity = [createFBO(128, 128), createFBO(128, 128)];
  const quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

  let mouse = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, moved: false };
  window.addEventListener('mousemove', e => { 
    mouse.px = mouse.x; mouse.py = mouse.y;
    mouse.x = e.clientX / window.innerWidth; mouse.y = 1 - e.clientY / window.innerHeight;
    mouse.moved = true;
  });

  const render = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
    
    // Advect Velocity
    gl.useProgram(progs.advect); gl.viewport(0, 0, 128, 128);
    gl.uniform1f(gl.getUniformLocation(progs.advect, 'u_dt'), 0.016); gl.uniform1f(gl.getUniformLocation(progs.advect, 'u_diss'), 0.98);
    gl.uniform1i(gl.getUniformLocation(progs.advect, 'u_vel'), 0); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity[0].tex);
    gl.uniform1i(gl.getUniformLocation(progs.advect, 'u_src'), 0); gl.bindFramebuffer(gl.FRAMEBUFFER, velocity[1].fbo); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    velocity.reverse();

    // Advect Density
    gl.viewport(0, 0, 512, 512); gl.uniform1f(gl.getUniformLocation(progs.advect, 'u_diss'), 0.97);
    gl.uniform1i(gl.getUniformLocation(progs.advect, 'u_vel'), 0); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity[0].tex);
    gl.uniform1i(gl.getUniformLocation(progs.advect, 'u_src'), 1); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, density[0].tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, density[1].fbo); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    density.reverse();

    if (mouse.moved) {
      gl.useProgram(progs.splat); gl.uniform1f(gl.getUniformLocation(progs.splat, 'u_aspect'), window.innerWidth / window.innerHeight);
      gl.uniform2f(gl.getUniformLocation(progs.splat, 'u_point'), mouse.x, mouse.y); gl.uniform1f(gl.getUniformLocation(progs.splat, 'u_radius'), 0.001);
      
      // Splat Velocity
      gl.uniform3f(gl.getUniformLocation(progs.splat, 'u_color'), (mouse.x - mouse.px) * 50, (mouse.y - mouse.py) * 50, 0);
      gl.viewport(0,0,128,128); gl.bindFramebuffer(gl.FRAMEBUFFER, velocity[1].fbo);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, velocity[0].tex); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); velocity.reverse();

      // Splat Density
      const time = Date.now() * 0.002;
      gl.uniform3f(gl.getUniformLocation(progs.splat, 'u_color'), Math.sin(time)*0.5+0.5, Math.sin(time+2)*0.5+0.5, Math.sin(time+4)*0.5+0.5);
      gl.viewport(0,0,512,512); gl.bindFramebuffer(gl.FRAMEBUFFER, density[1].fbo);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, density[0].tex); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); density.reverse();
      mouse.moved = false;
    }

    gl.useProgram(progs.display); gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, density[0].tex);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  };

  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  window.addEventListener('resize', resize); resize(); render();
}


// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initDynamicProjectImages();
  initTypewriterEffect();
  initInstagramLazyLoad();
  initClickSound(); // Initialize sound effect
  initWebGLFluid(); // Initialize high-performance WebGL fluid cursor

  // Check if header is already loaded or wait for it
  const checkHeader = setInterval(() => {
    if (document.querySelector('.cyber-header')) {
      clearInterval(checkHeader);
      initScrollProgress();
    }
  }, 100);
});
