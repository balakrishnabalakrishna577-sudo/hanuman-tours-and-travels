// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavigation();
    initSlideshow();
    initDestinationFilters();
    initBookingForm();
    initAnimations();
    initActiveNavigation();
    initScrollProgress();
    initCounters();
    initImageZoom();
});

// Navigation functionality
function initNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !navMenu.id) navMenu.id = 'main-nav';
    const navLinks = document.querySelectorAll('.nav-menu a');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-controls', navMenu ? navMenu.id : '');
    // Place the mobile menu button inside the header container (before the CTA) so layout stays consistent
    const headerContainer = document.querySelector('.header-container') || document.querySelector('header');
    const headerCta = headerContainer.querySelector('.header-cta');
    headerContainer.insertBefore(mobileMenuBtn, headerCta);

    // Mobile menu toggle (update aria-expanded)
    mobileMenuBtn.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        if (isActive) mobileMenuBtn.classList.add('open'); else mobileMenuBtn.classList.remove('open');
    });

    // Handle navigation click and highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');

            // Handle smooth scrolling
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking
                navMenu.classList.remove('active');
            }
        });
    });

    // Sticky header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header') || document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Close mobile nav with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// Hero section slideshow
function initSlideshow() {
    const heroImage = document.querySelector('.hero-image img');
    // Use a single static hero image. Removed SVG placeholders from the slideshow.
    const images = ['images/hero.jpg'];

    // Ensure the hero shows the static image and do not start a slideshow when only one image is present.
    if (heroImage) {
        heroImage.src = images[0];
        heroImage.style.opacity = '1';
    }
}

// Destination filtering system
function initDestinationFilters() {
    const destinations = document.querySelectorAll('.destination-item');

    // Category filter (All, Religious Places, Cities, Beaches, Mountains)
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('filter-container');
    const categories = ['All', 'Religious Places', 'Cities', 'Beaches', 'Mountains'];
    categoryContainer.innerHTML = categories.map(cat =>
        `<button class="filter-btn" data-filter="${cat.toLowerCase().replace(/\s+/g,'-')}">${cat}</button>`
    ).join('');

    // Region filter (All, Karnataka, Kerala, Andhra Pradesh)
    const regionContainer = document.createElement('div');
    regionContainer.classList.add('filter-container', 'region-container');
    const regions = ['All', 'Karnataka', 'Kerala', 'Andhra Pradesh'];
    regionContainer.innerHTML = regions.map(r =>
        `<button class="filter-btn region-btn" data-region="${r.toLowerCase().replace(/\s+/g,'-')}">${r}</button>`
    ).join('');

    // Insert category and region filters before destinations grid
    const destSection = document.querySelector('#destinations');
    const grid = destSection.querySelector('.destination-grid');
    destSection.insertBefore(regionContainer, grid);
    destSection.insertBefore(categoryContainer, regionContainer);

    // Track active filters
    let activeCategory = 'all';
    let activeRegion = 'all';

    function applyFilters() {
        destinations.forEach(dest => {
            const cat = dest.dataset.category || '';
            const region = dest.dataset.region || '';

            const categoryMatch = activeCategory === 'all' || cat === activeCategory;
            const regionMatch = activeRegion === 'all' || region === activeRegion;

            if (categoryMatch && regionMatch) {
                dest.style.display = 'block';
            } else {
                dest.style.display = 'none';
            }
        });
    }

    // Category click
    categoryContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // clear active on siblings
            categoryContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeCategory = e.target.dataset.filter;
            applyFilters();
        }
    });

    // Region click
    regionContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('region-btn')) {
            regionContainer.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeRegion = e.target.dataset.region;
            applyFilters();
        }
    });

    // Initialize default active buttons
    categoryContainer.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    regionContainer.querySelector('.region-btn[data-region="all"]').classList.add('active');
    applyFilters();
}

// Booking form functionality
function initBookingForm() {
    // Create and append modal to body only once
    if (!document.querySelector('.booking-modal')) {
        const modal = document.createElement('div');
        modal.classList.add('booking-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Book Your Trip</h2>
                <form id="bookingForm">
                    <input type="text" name="name" id="name" placeholder="Full Name" required>
                    <input type="tel" name="phone" id="phone" placeholder="Phone Number" required pattern="[0-9]{10}">
                    <input type="email" name="email" id="email" placeholder="Email" required>
                    <select name="destination" id="destination" required>
                        <option value="">Select Destination</option>
                        <optgroup label="Religious Destinations">
                            <option value="Mantralaya">Mantralaya</option>
                            <option value="Dharmasthala">Dharmasthala</option>
                            <option value="Sabarimala">Sabarimala</option>
                            <option value="Tirupati">Tirupati</option>
                            <option value="Shirdi">Shirdi</option>
                            <option value="Udupi">Udupi</option>
                        </optgroup>
                        <optgroup label="Cities">
                            <option value="Bangalore">Bangalore</option>
                            <option value="Mysore">Mysore</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                        </optgroup>
                        <optgroup label="International">
                            <option value="Dubai">Dubai</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Malaysia">Malaysia</option>
                        </optgroup>
                    </select>
                    <input type="number" name="persons" id="persons" placeholder="Number of Persons" min="1" max="10" required>
                    <input type="date" name="date" id="date" required>
                    <div class="booking-buttons">
                        <button type="button" id="whatsappBtn" class="whatsapp-btn">
                            Send via WhatsApp
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    // Accessibility attributes
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');

    // Handle WhatsApp button click
        const whatsappBtn = modal.querySelector('#whatsappBtn');
        whatsappBtn.addEventListener('click', function() {
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const destination = document.getElementById('destination').value;
            const persons = document.getElementById('persons').value;
            const date = document.getElementById('date').value;

            // Validate form
            if (!name || !phone || !email || !destination || !persons || !date) {
                alert('Please fill in all fields before sending');
                return;
            }

            // Format the message
            const message = encodeURIComponent(
                `*New Trip Booking Request*\n\n` +
                `👤 *Name:* ${name}\n` +
                `📞 *Phone:* ${phone}\n` +
                `📧 *Email:* ${email}\n` +
                `🌍 *Destination:* ${destination}\n` +
                `👥 *Number of Persons:* ${persons}\n` +
                `📅 *Travel Date:* ${date}\n\n` +
                `Please provide more details about the trip package.`
            );

            // Open WhatsApp with the message (prefers app on mobile, falls back to web)
            openWhatsAppLink(message);
            
            // Close modal and reset form
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            if (modal._previouslyFocused) modal._previouslyFocused.focus();
            document.getElementById('bookingForm').reset();
        });
    }

    // Get both booking buttons and add click handlers
    const bookButtons = document.querySelectorAll('.book-now-btn, .hero-button');
    const modal = document.querySelector('.booking-modal');

    bookButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Show modal and manage focus for accessibility
            modal._previouslyFocused = document.activeElement;
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            const firstInput = modal.querySelector('input, select, textarea, button');
            if (firstInput) firstInput.focus();
        });
    });

    // Close button functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        if (modal._previouslyFocused) modal._previouslyFocused.focus();
    });

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            if (modal._previouslyFocused) modal._previouslyFocused.focus();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            if (modal._previouslyFocused) modal._previouslyFocused.focus();
        }
    });

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

// (sendWhatsAppMessage removed — booking modal uses openWhatsAppLink directly)

// Open WhatsApp with fallback logic (app on mobile, web otherwise)
function openWhatsAppLink(encodedMessage) {
    const ownerNumber = '919740120892'; // owner with country code (91)
    const webUrl = `https://api.whatsapp.com/send?phone=91${ownerNumber.replace(/^\+?91/, '')}&text=${encodedMessage}`;
    const waMeUrl = `https://wa.me/91${ownerNumber.replace(/^\+?91/, '')}?text=${encodedMessage}`;
    const appUrl = `whatsapp://send?phone=91${ownerNumber.replace(/^\+?91/, '')}&text=${encodedMessage}`;

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        // Try to open WhatsApp app; if it fails, after timeout open web URL
        window.location.href = appUrl;
        // Fallback after 1.2s to web url (if app is not installed)
        setTimeout(() => {
            window.open(webUrl, '_blank');
        }, 1200);
    } else {
        // Desktop: open web WhatsApp
        // Use wa.me if available, otherwise api link
        window.open(waMeUrl || webUrl, '_blank');
    }
}


// Animation functionality
function initAnimations() {
    // Animate elements when they come into view
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Add animation to all destination and hotel items
    document.querySelectorAll('.destination-item, .hotel-item').forEach(item => {
        animateOnScroll.observe(item);
    });

    // Add hover effects
    document.querySelectorAll('.destination-item, .hotel-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('hover');
        });
        item.addEventListener('mouseleave', () => {
            item.classList.remove('hover');
        });
    });
}

// Dynamic loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Active navigation link based on scroll position
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                const sel = `.nav-menu a[href*="${sectionId}"]`;
                document.querySelector(sel)?.classList.add('active');
            } else {
                const sel = `.nav-menu a[href*="${sectionId}"]`;
                document.querySelector(sel)?.classList.remove('active');
            }
        });
    });
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalScroll) * 100;
        progressBar.style.width = progress + '%';
    });
}

// Animated counters for statistics
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                
                const updateCount = () => {
                    const increment = target / speed;
                    if (count < target) {
                        count += increment;
                        counter.textContent = Math.ceil(count);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    });

    counters.forEach(counter => observer.observe(counter));
}

// Image zoom effect on hover for destinations
function initImageZoom() {
    const destinationImages = document.querySelectorAll('.destination-item img');
    
    destinationImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.1)';
            img.style.transition = 'transform 0.5s ease';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

