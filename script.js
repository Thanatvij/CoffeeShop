// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    this.classList.toggle('active');
});

// Menu Category Switch
const menuCategories = document.querySelectorAll('.menu-category');
menuCategories.forEach(category => {
    category.addEventListener('click', function() {
        // Remove active class from all categories
        menuCategories.forEach(cat => cat.classList.remove('active'));
        
        // Add active class to clicked category
        this.classList.add('active');
        
        // Get selected category for filtering
        const selectedCategory = this.getAttribute('data-category');
        console.log(`Selected category: ${selectedCategory}`);
        
        // Here you would add logic to filter menu items based on category
        // For example:
        // const menuItems = document.querySelectorAll('.menu-item');
        // menuItems.forEach(item => {
        //     const itemCategory = item.getAttribute('data-category');
        //     if (selectedCategory === 'all' || itemCategory === selectedCategory) {
        //         item.style.display = 'block';
        //     } else {
        //         item.style.display = 'none';
        //     }
        // });
    });
});

// Smooth Scrolling for Anchor Links
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
        }
    });
});

// Newsletter Form Submission
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    alert(`Thank you! ${email} has been subscribed to our newsletter.`);
    this.reset();
});
// Hero Image Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showNextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

setInterval(showNextSlide, 5000); // เปลี่ยนภาพทุก 5 วินาที
// Scroll Animation
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// Document Ready Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Brew Haven website loaded successfully!');
    
    // Initialize any components or features that need to be set up on page load
    // For example, you could add an image carousel, animations, etc.
});