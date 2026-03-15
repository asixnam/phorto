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
  canvas.style.pointerEvents = 'none'; canvas.style.zIndex = '10';

  let config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 0.98,
    VELOCITY_DISSIPATION: 0.99,
    PRESSURE: 0.1,
    PRESSURE_ITERATIONS: 20,
    CURL: 3,
    SPLAT_RADIUS: 0.002,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLOR_UPDATE_SPEED: 10,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: true,
  };

  const params = { alpha: true, depth: false, stencil: false, antialias: false };
  let gl = canvas.getContext('webgl2', params);
  const isWebGL2 = !!gl;
  if (!gl) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
  if (!gl) return;

  let halfFloat = isWebGL2 ? gl.HALF_FLOAT : gl.getExtension('OES_texture_half_float')?.HALF_FLOAT_OES;
  let supportLinearFiltering = isWebGL2 ? gl.getExtension('OES_texture_float_linear') : gl.getExtension('OES_texture_half_float_linear');

  function compileShader(type, source, keywords) {
    source = (keywords || []).map(k => `#define ${k}\n`).join('') + source;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const baseVS = compileShader(gl.VERTEX_SHADER, `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform vec2 texelSize;
    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `);

  const splatFS = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
    }
  `);

  const advectFS = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uVelocity, uSource;
    uniform vec2 texelSize;
    uniform float dt, dissipation;
    void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
    }
  `);

  const divFS = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying highp vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).x, R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y, B = texture2D(uVelocity, vB).y;
        gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }
  `);

  const curlFS = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying highp vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).y, R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x, B = texture2D(uVelocity, vB).x;
        gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
    }
  `);

  const vortFS = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D uVelocity, uCurl;
    uniform float curl, dt;
    void main () {
        float L = texture2D(uCurl, vL).x, R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x, B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        gl_FragColor = vec4(texture2D(uVelocity, vUv).xy + force * curl * C * dt * vec2(1, -1), 0.0, 1.0);
    }
  `);

  const pressureFS = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying highp vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D uPressure, uDivergence;
    void main () {
        float L = texture2D(uPressure, vL).x, R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x, B = texture2D(uPressure, vB).x;
        gl_FragColor = vec4((L + R + B + T - texture2D(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0);
    }
  `);

  const gradGradFS = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying highp vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D uPressure, uVelocity;
    void main () {
        float L = texture2D(uPressure, vL).x, R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x, B = texture2D(uPressure, vB).x;
        gl_FragColor = vec4(texture2D(uVelocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0);
    }
  `);

  const displayFS = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        gl_FragColor = vec4(c, smoothstep(0.0, 0.5, max(c.r, max(c.g, c.b))) * 0.7);
    }
  `);

  class Program {
    constructor(vs, fs) {
      this.program = gl.createProgram();
      gl.attachShader(this.program, vs); gl.attachShader(this.program, fs);
      gl.bindAttribLocation(this.program, 0, "aPosition");
      gl.linkProgram(this.program);
      this.uniforms = {};
      let n = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { let info = gl.getActiveUniform(this.program, i); this.uniforms[info.name] = gl.getUniformLocation(this.program, info.name); }
    }
    bind() { gl.useProgram(this.program); }
  }

  const programs = {
    splat: new Program(baseVS, splatFS), advect: new Program(baseVS, advectFS), divergence: new Program(baseVS, divFS),
    curl: new Program(baseVS, curlFS), vorticity: new Program(baseVS, vortFS), pressure: new Program(baseVS, pressureFS),
    gradSub: new Program(baseVS, gradGradFS), display: new Program(baseVS, displayFS)
  };

  function createFBO(w, h, internalFormat, format, type, param) {
    let tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
    let fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo, width: w, height: h, texelSizeX: 1 / w, texelSizeY: 1 / h, attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; } };
  }

  function createDoubleFBO(w, h, internalFormat, format, type, param) {
    let f1 = createFBO(w, h, internalFormat, format, type, param), f2 = createFBO(w, h, internalFormat, format, type, param);
    return { width: w, height: h, texelSizeX: f1.texelSizeX, texelSizeY: f1.texelSizeY, read: f1, write: f2, swap() { let t = this.read; this.read = this.write; this.write = t; } };
  }

  const quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  
  let dye, velocity, divergence, curl, pressure;
  function initFramebuffers() {
    let w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
    let simW = config.SIM_RESOLUTION, simH = Math.round(simW * h / w), dyeW = config.DYE_RESOLUTION, dyeH = Math.round(dyeW * h / w);
    const rgba = isWebGL2 ? [gl.RGBA16F, gl.RGBA] : [gl.RGBA, gl.RGBA], rg = isWebGL2 ? [gl.RG16F, gl.RG] : rgba, r = isWebGL2 ? [gl.R16F, gl.RED] : rgba;
    const filter = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    dye = createDoubleFBO(dyeW, dyeH, rgba[0], rgba[1], halfFloat, filter);
    velocity = createDoubleFBO(simW, simH, rg[0], rg[1], halfFloat, filter);
    divergence = createFBO(simW, simH, r[0], r[1], halfFloat, gl.NEAREST);
    curl = createFBO(simW, simH, r[0], r[1], halfFloat, gl.NEAREST);
    pressure = createDoubleFBO(simW, simH, r[0], r[1], halfFloat, gl.NEAREST);
  }
  
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  initFramebuffers();

  let mouse = { x: 0.5, y: 0.5, dx: 0, dy: 0, moved: false, color: { r: 0, g: 0, b: 0 } };
  let colorTimer = 0;
  window.addEventListener('mousemove', e => {
    let nx = e.clientX / window.innerWidth, ny = 1 - e.clientY / window.innerHeight;
    mouse.dx = (nx - mouse.x) * config.SPLAT_FORCE; mouse.dy = (ny - mouse.y) * config.SPLAT_FORCE;
    mouse.x = nx; mouse.y = ny; mouse.moved = true;
    colorTimer += 0.05;
    if (colorTimer > 1) colorTimer = 0;
    let h = colorTimer, s = 1, v = 1, i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
    let r, g, b; switch (i % 6) { case 0: r = v, g = t, b = p; break; case 1: r = q, g = v, b = p; break; case 2: r = p, g = v, b = t; break; case 3: r = p, g = q, b = v; break; case 4: r = t, g = p, b = v; break; case 5: r = v, g = p, b = q; break; }
    mouse.color = { r: r * 0.5, g: g * 0.5, b: b * 0.5 };
  });

  function render() {
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
    gl.disable(gl.BLEND);
    const blit = (t) => { if (t) { gl.viewport(0, 0, t.width, t.height); gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo); } else { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); } gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
    
    programs.curl.bind(); gl.uniform2f(programs.curl.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(programs.curl.uniforms.uVelocity, velocity.read.attach(0)); blit(curl);
    programs.vorticity.bind(); gl.uniform2f(programs.vorticity.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(programs.vorticity.uniforms.uVelocity, velocity.read.attach(0)); gl.uniform1i(programs.vorticity.uniforms.uCurl, curl.attach(1)); gl.uniform1f(programs.vorticity.uniforms.curl, config.CURL); gl.uniform1f(programs.vorticity.uniforms.dt, 0.016); blit(velocity.write); velocity.swap();
    programs.divergence.bind(); gl.uniform2f(programs.divergence.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(programs.divergence.uniforms.uVelocity, velocity.read.attach(0)); blit(divergence);
    programs.pressure.bind(); gl.uniform2f(programs.pressure.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(programs.pressure.uniforms.uDivergence, divergence.attach(0)); for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) { gl.uniform1i(programs.pressure.uniforms.uPressure, pressure.read.attach(1)); blit(pressure.write); pressure.swap(); }
    programs.gradSub.bind(); gl.uniform2f(programs.gradSub.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(programs.gradSub.uniforms.uPressure, pressure.read.attach(0)); gl.uniform1i(programs.gradSub.uniforms.uVelocity, velocity.read.attach(1)); blit(velocity.write); velocity.swap();
    programs.advect.bind(); gl.uniform2f(programs.advect.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(programs.advect.uniforms.uVelocity, velocity.read.attach(0)); gl.uniform1i(programs.advect.uniforms.uSource, velocity.read.attach(0)); gl.uniform1f(programs.advect.uniforms.dt, 0.016); gl.uniform1f(programs.advect.uniforms.dissipation, config.VELOCITY_DISSIPATION); blit(velocity.write); velocity.swap();
    gl.uniform1i(programs.advect.uniforms.uSource, dye.read.attach(1)); gl.uniform1f(programs.advect.uniforms.dissipation, config.DENSITY_DISSIPATION); blit(dye.write); dye.swap();

    if (mouse.moved) {
      programs.splat.bind(); gl.uniform1f(programs.splat.uniforms.aspectRatio, canvas.width / canvas.height); gl.uniform2f(programs.splat.uniforms.point, mouse.x, mouse.y); gl.uniform1f(programs.splat.uniforms.radius, config.SPLAT_RADIUS);
      gl.uniform3f(programs.splat.uniforms.color, mouse.dx, mouse.dy, 0); gl.uniform1i(programs.splat.uniforms.uTarget, velocity.read.attach(0)); blit(velocity.write); velocity.swap();
      gl.uniform3f(programs.splat.uniforms.color, mouse.color.r, mouse.color.g, mouse.color.b); gl.uniform1i(programs.splat.uniforms.uTarget, dye.read.attach(0)); blit(dye.write); dye.swap();
      mouse.moved = false;
    }
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND);
    programs.display.bind(); gl.uniform1i(programs.display.uniforms.uTexture, dye.read.attach(0)); blit(null);
    requestAnimationFrame(render);
  }
  window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initFramebuffers(); });
  render();
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
