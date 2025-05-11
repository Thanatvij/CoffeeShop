// Document Ready Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('PTT Élan Café website loaded successfully!');
    
    // Initialize all event listeners and components
    initializeMobileMenu();
    initializeMenuCategories();
    initializeSmoothScrolling();
    initializeNewsletterForm();
    initializeHeroSlider();
    initializeScrollAnimation();
    
    // Make sure logo is clickable
    initializeLogoClickHandler();
  });
  
  // Logo Click Handler
  function initializeLogoClickHandler() {
    const logoLinks = document.querySelectorAll('.logo a, .footer-column h3 a');
    logoLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // If we're on the homepage already, just scroll to top
        if (window.location.pathname.endsWith('index.html') || 
            window.location.pathname === '/' || 
            window.location.pathname === '') {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
        // Otherwise, the default link behavior will navigate to index.html
      });
    });
  }
  
  // Mobile Menu Toggle
  function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('show');
      });
    }
  }
  
  // Menu Category Switch
  function initializeMenuCategories() {
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuCategories.forEach(category => {
      category.addEventListener('click', function() {
        // Remove active class from all categories
        menuCategories.forEach(cat => cat.classList.remove('active'));
        
        // Add active class to clicked category
        this.classList.add('active');
        
        // Get selected category for filtering
        const selectedCategory = this.getAttribute('data-category');
        console.log(`Selected category: ${selectedCategory}`);
        
        // Filter menu items based on category
        menuItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (selectedCategory === 'all' || !selectedCategory || itemCategory === selectedCategory) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
  
  // Smooth Scrolling for Anchor Links
  function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = 80; // Account for fixed header
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if it's open
          const mobileMenu = document.querySelector('.mobile-menu');
          const navMenu = document.querySelector('nav ul');
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('show');
          }
        }
      });
    });
  }
  
  // Newsletter Form Submission
  function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        alert(`Thank you! ${email} has been subscribed to our newsletter.`);
        this.reset();
      });
    }
  }
  
  // Hero Image Slider
  function initializeHeroSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    
    if (slides.length > 1) {
      function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }
      
      setInterval(showNextSlide, 5000); // Change image every 5 seconds
    }
  }
  
  // Scroll Animation
  function initializeScrollAnimation() {
    const header = document.querySelector('header');
    
    if (header) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
          header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
          header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
      });
    }
  }