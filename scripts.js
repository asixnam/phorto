// Load Header from external file
function loadHeader() {
  const headerContainer = document.getElementById('header-container');
  
  fetch('header.html')
    .then(response => response.text())
    .then(html => {
      headerContainer.innerHTML = html;
      initHamburgerMenu(); // Initialize hamburger menu after header is loaded
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

    // Close menu when clicking a link
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
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

      // Remove active from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      // Add active to clicked tab and respective content
      tab.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });
});
