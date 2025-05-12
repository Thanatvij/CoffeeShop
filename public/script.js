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
  
  // Hero Image Slider - Professional Version
function initializeHeroSlider() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  let slideInterval;
  
  // Only initialize if we have slides
  if (slides.length > 1) {
    
    // Function to update the active slide
    function updateSlide(newIndex) {
      // Remove active class from current slide and dot
      slides[currentSlide].classList.remove('active');
      if (dots.length > 0) {
        dots[currentSlide].classList.remove('active');
      }
      
      // Update current slide index
      currentSlide = newIndex;
      
      // Handle edge cases
      if (currentSlide < 0) {
        currentSlide = slides.length - 1;
      } else if (currentSlide >= slides.length) {
        currentSlide = 0;
      }
      
      // Add active class to new slide and dot
      slides[currentSlide].classList.add('active');
      if (dots.length > 0) {
        dots[currentSlide].classList.add('active');
      }
    }
    
    // Function to show next slide
    function showNextSlide() {
      updateSlide((currentSlide + 1) % slides.length);
    }
    
    // Function to show previous slide
    function showPrevSlide() {
      updateSlide((currentSlide - 1 + slides.length) % slides.length);
    }
    
    // Function to start automatic slideshow
    function startSlideshow() {
      // Clear any existing interval
      if (slideInterval) {
        clearInterval(slideInterval);
      }
      
      // Set new interval
      slideInterval = setInterval(showNextSlide, 5000);
    }
    
    // Function to reset the slideshow timer
    // (called after manual navigation to prevent rapid transitions)
    function resetSlideshow() {
      // Clear and restart the interval
      clearInterval(slideInterval);
      startSlideshow();
    }
    
    // Add event listeners for controls
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        showNextSlide();
        resetSlideshow();
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        showPrevSlide();
        resetSlideshow();
      });
    }
    
    // Add click handlers for dots
    if (dots.length > 0) {
      dots.forEach(dot => {
        dot.addEventListener('click', function() {
          const dotIndex = parseInt(this.getAttribute('data-index'));
          
          // Only change if it's a different slide
          if (dotIndex !== currentSlide) {
            updateSlide(dotIndex);
            resetSlideshow();
          }
        });
      });
    }
    
    // Pause slideshow when hovering over controls
    const controls = document.querySelector('.hero-controls');
    if (controls) {
      controls.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
      });
      
      controls.addEventListener('mouseleave', function() {
        startSlideshow();
      });
    }
    
    // Initialize slideshow
    startSlideshow();
    
    // Add keyboard support for accessibility
    document.addEventListener('keydown', function(e) {
      // Only process if we're at the top of the page or viewing the hero section
      const heroSection = document.querySelector('.hero');
      const heroRect = heroSection.getBoundingClientRect();
      const isHeroVisible = heroRect.top <= 0 && heroRect.bottom >= 0;
      
      if (isHeroVisible || window.scrollY < window.innerHeight) {
        if (e.key === 'ArrowLeft') {
          showPrevSlide();
          resetSlideshow();
        } else if (e.key === 'ArrowRight') {
          showNextSlide();
          resetSlideshow();
        }
      }
    });
    
    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const heroSlider = document.querySelector('.hero-slider');
    
    heroSlider.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    heroSlider.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);
    
    function handleSwipe() {
      const minSwipeDistance = 50;
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) >= minSwipeDistance) {
        if (swipeDistance > 0) {
          // Swiped right - show previous
          showPrevSlide();
        } else {
          // Swiped left - show next
          showNextSlide();
        }
        resetSlideshow();
      }
    }
  }
}