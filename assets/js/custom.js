// Custom JavaScript for Edygrim Portfolio

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the site
    initSite();

    // Form Handling
    setupForms();

    // Audio Player Controls
    setupAudioPlayers();

    // Booking System
    setupBookingSystem();

    // Background Image Management
    setupBackgrounds();
});

function initSite() {
    console.log('Edygrim Portfolio Site Initialized');

    // Set current year in footer
    const yearSpan = document.createElement('span');
    yearSpan.textContent = new Date().getFullYear();
    const copyright = document.querySelector('#footer p');
    if (copyright) {
        copyright.innerHTML = copyright.innerHTML.replace('2024', yearSpan.textContent);
    }

    // Add active navigation highlighting
    highlightActiveNav();
}

function highlightActiveNav() {
    const navLinks = document.querySelectorAll('nav a');
    const articles = document.querySelectorAll('article');

    function setActiveLink() {
        let currentArticle = '';

        articles.forEach(article => {
            const rect = article.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentArticle = article.id;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === currentArticle) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // Initial call
}

function setupForms() {
    // Booking Form Submission
    // Booking Form Submission Handled by supabase-config.js
    const bookingForm = document.getElementById('booking-form');
    // if (bookingForm) { ... } conflicting listener removed

    // Contact Form Submission
    // Contact Form Submission Handled by supabase-config.js
    const contactForm = document.querySelector('article#contact form');
    // if (contactForm) { ... } conflicting listener removed
}

function saveBooking(data) {
    // Temporary storage until Supabase is implemented
    let bookings = JSON.parse(localStorage.getItem('edygrim_bookings')) || [];
    bookings.push(data);
    localStorage.setItem('edygrim_bookings', JSON.stringify(bookings));

    console.log('Booking saved:', data);

    // TODO: Replace with Supabase API call
    // supabase.from('bookings').insert([data])
}

function saveContact(data) {
    let messages = JSON.parse(localStorage.getItem('edygrim_messages')) || [];
    messages.push(data);
    localStorage.setItem('edygrim_messages', JSON.stringify(messages));

    console.log('Message saved:', data);

    // TODO: Replace with Supabase API call
    // supabase.from('messages').insert([data])
}

function setupAudioPlayers() {
    // Custom audio player controls
    const audioPlayers = document.querySelectorAll('audio');

    audioPlayers.forEach(player => {
        // Add custom play/pause functionality
        const container = player.parentElement;

        // Create custom controls if needed
        const customControls = document.createElement('div');
        customControls.className = 'custom-audio-controls';
        customControls.innerHTML = `
            <button class="play-btn"><i class="fas fa-play"></i></button>
            <button class="pause-btn"><i class="fas fa-pause"></i></button>
            <span class="time">00:00 / 00:00</span>
        `;

        container.appendChild(customControls);

        // Add event listeners for custom controls
        const playBtn = customControls.querySelector('.play-btn');
        const pauseBtn = customControls.querySelector('.pause-btn');
        const timeSpan = customControls.querySelector('.time');

        playBtn.addEventListener('click', () => player.play());
        pauseBtn.addEventListener('click', () => player.pause());

        player.addEventListener('timeupdate', () => {
            const currentTime = formatTime(player.currentTime);
            const duration = formatTime(player.duration);
            timeSpan.textContent = `${currentTime} / ${duration}`;
        });
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function setupBookingSystem() {
    // Setup date restrictions (no past dates)
    const dateInput = document.getElementById('book-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Setup budget range tooltips
    const budgetSelect = document.getElementById('book-budget');
    if (budgetSelect) {
        budgetSelect.addEventListener('change', function () {
            const value = this.value;
            let message = '';

            switch (value) {
                case '0-20000':
                    message = 'Small events, private parties';
                    break;
                case '20000-50000':
                    message = 'Standard club nights, medium events';
                    break;
                case '50000-100000':
                    message = 'Large events, festivals, corporate';
                    break;
                case '100000+':
                    message = 'Premium events, multi-day festivals';
                    break;
            }

            if (message) {
                showNotification(message, 'info', 3000);
            }
        });
    }
}

function setupBackgrounds() {
    // Dynamic background image loading
    const sections = document.querySelectorAll('article');
    const bgImageUrls = {
        'intro': 'assets/css/Ed1.jpg',
        'mixes': 'assets/css/Ed2.jpg',
        'gigs': 'assets/css/RR.webp',
        'booking': 'assets/css/Ed3.jpg',
        'about': 'assets/css/Ed4.jpg',
        'contact': 'assets/css/eddy3.jpg'
    };

    // Preload images
    Object.values(bgImageUrls).forEach(url => {
        const img = new Image();
        img.src = url;
    });

    // Update background based on active section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                if (bgImageUrls[id]) {
                    document.body.style.backgroundImage = `url('${bgImageUrls[id]}')`;
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
}

function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notif">&times;</button>
    `;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem 1rem 1rem;
        background: ${type === 'success' ? '#2e7d32' : type === 'error' ? '#c62828' : '#ff9800'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;

    // Add close button functionality
    const closeBtn = notification.querySelector('.close-notif');
    closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        line-height: 20px;
    `;

    closeBtn.addEventListener('click', () => notification.remove());

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
}

// Utility function for Supabase integration (to be implemented)
async function initSupabase() {
    // TODO: Add Supabase initialization
    // const supabaseUrl = 'YOUR_SUPABASE_URL';
    // const supabaseKey = 'YOUR_SUPABASE_KEY';
    // window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
}

// Mix data management (for future Supabase integration)
const mixData = {
    currentMix: null,
    mixes: [],

    async loadMixes() {
        // TODO: Load from Supabase
        // this.mixes = await supabase.from('mixes').select('*');
    },

    async addMix(mix) {
        // TODO: Add to Supabase
        // await supabase.from('mixes').insert([mix]);
    }
};

// Gig data management
const gigData = {
    upcomingGigs: [],

    async loadGigs() {
        // TODO: Load from Supabase
        // this.upcomingGigs = await supabase.from('gigs').select('*').gte('date', new Date().toISOString());
    },

    async addGig(gig) {
        // TODO: Add to Supabase
        // await supabase.from('gigs').insert([gig]);
    }
};

// Stats Counter Animation
function animateStats() {
    const statItems = document.querySelectorAll('.stat-item');

    statItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);

        const number = item.querySelector('h3');
        if (number) {
            const target = parseInt(number.textContent);
            if (!isNaN(target)) {
                animateCounter(number, target, 2000);
            }
        }
    });
}

function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Mix Player Enhancements
function enhanceAudioPlayers() {
    const audioPlayers = document.querySelectorAll('audio');

    audioPlayers.forEach((player, index) => {
        // Add custom styling
        player.style.cssText = `
            width: 100%;
            height: 40px;
            border-radius: 20px;
            outline: none;
        `;

        // Custom controls
        player.addEventListener('play', function () {
            this.parentElement.style.boxShadow = '0 0 15px rgba(255, 69, 0, 0.5)';
        });

        player.addEventListener('pause', function () {
            this.parentElement.style.boxShadow = 'none';
        });

        player.addEventListener('ended', function () {
            this.parentElement.style.boxShadow = 'none';
            showNotification(`Finished: ${this.closest('.mix-player').querySelector('h3').textContent}`, 'info', 3000);
        });

        // Volume control
        player.volume = 0.7;

        // Add download button
        const downloadBtn = document.createElement('a');
        downloadBtn.href = player.querySelector('source').src;
        downloadBtn.download = `edygrim-mix-${index + 1}.mp3`;
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
        downloadBtn.className = 'download-btn';
        downloadBtn.style.cssText = `
            display: inline-block;
            margin-top: 0.5rem;
            padding: 0.3rem 0.8rem;
            background: #333;
            color: #fff;
            border-radius: 4px;
            text-decoration: none;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        `;

        downloadBtn.addEventListener('mouseenter', function () {
            this.style.background = '#ff4500';
        });

        downloadBtn.addEventListener('mouseleave', function () {
            this.style.background = '#333';
        });

        player.parentElement.appendChild(downloadBtn);
    });
}

// Gig Cards Interactive Features
function setupGigCards() {
    const gigCards = document.querySelectorAll('.gig-card');

    gigCards.forEach(card => {
        // Add click effect
        card.style.cursor = 'pointer';

        card.addEventListener('click', function (e) {
            if (!e.target.closest('a') && !e.target.closest('button')) {
                this.style.transform = 'scale(0.99)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });

        // Add calendar integration for Rock Riot
        const title = card.querySelector('h3').textContent;
        if (title.includes('Rock Riot')) {
            addRockRiotDates(card);
        }

        // Add notification button functionality
        const notifyBtn = card.querySelector('button');
        if (notifyBtn && notifyBtn.textContent.includes('Notify')) {
            notifyBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                setupGigNotification(card);
            });
        }
    });
}

function addRockRiotDates(card) {
    // Calculate next Rock Riot dates (last Saturday of each month)
    const nextDates = getNextRockRiotDates(3); // Get next 3 dates

    const datesHTML = `
        <div class="rock-riot-dates">
            <h4>Upcoming Dates:</h4>
            <ul>
                ${nextDates.map(date => `
                    <li>${date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })}</li>
                `).join('')}
            </ul>
        </div>
    `;

    const datesElement = document.createElement('div');
    datesElement.innerHTML = datesHTML;
    datesElement.style.cssText = `
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(255, 69, 0, 0.1);
        border-radius: 6px;
        border: 1px solid rgba(255, 69, 0, 0.3);
    `;

    datesElement.querySelector('h4').style.cssText = `
        color: #ff4500;
        margin-bottom: 0.5rem;
        font-size: 1rem;
    `;

    datesElement.querySelector('ul').style.cssText = `
        list-style: none;
        padding-left: 0;
    `;

    datesElement.querySelectorAll('li').forEach(li => {
        li.style.cssText = `
            color: #ccc;
            padding: 0.3rem 0;
            border-bottom: 1px solid rgba(255, 69, 0, 0.1);
        `;
    });

    card.appendChild(datesElement);
}

function getNextRockRiotDates(count) {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() + i, 1);

        // Find last Saturday of the month
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const lastSaturday = new Date(lastDay);

        // Go back to find Saturday
        while (lastSaturday.getDay() !== 6) {
            lastSaturday.setDate(lastSaturday.getDate() - 1);
        }

        // If date has passed, get next month
        if (lastSaturday <= today) {
            date.setMonth(date.getMonth() + 1);
            return getNextRockRiotDates(count); // Recursively get dates
        }

        dates.push(lastSaturday);
    }

    return dates;
}

function setupGigNotification(card) {
    const gigTitle = card.querySelector('h3').textContent;

    // Create notification modal
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Get Notified</h3>
            <p>Enter your email to get notified when details for "${gigTitle}" are announced:</p>
            <input type="email" placeholder="your@email.com" class="notify-email">
            <div class="modal-buttons">
                <button class="submit-notify">Notify Me</button>
                <button class="cancel-notify">Cancel</button>
            </div>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    modal.querySelector('.modal-content').style.cssText = `
        background: #222;
        padding: 2rem;
        border-radius: 10px;
        border: 2px solid #ff4500;
        max-width: 400px;
        width: 90%;
    `;

    modal.querySelector('h3').style.cssText = `
        color: #ff4500;
        margin-bottom: 1rem;
    `;

    modal.querySelector('p').style.cssText = `
        color: #ccc;
        margin-bottom: 1rem;
    `;

    const emailInput = modal.querySelector('.notify-email');
    emailInput.style.cssText = `
        width: 100%;
        padding: 0.8rem;
        margin-bottom: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #444;
        color: white;
        border-radius: 4px;
        font-size: 1rem;
    `;

    const buttons = modal.querySelector('.modal-buttons');
    buttons.style.cssText = `
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    `;

    const submitBtn = modal.querySelector('.submit-notify');
    submitBtn.style.cssText = `
        background: #ff4500;
        color: black;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    `;

    const cancelBtn = modal.querySelector('.cancel-notify');
    cancelBtn.style.cssText = `
        background: #444;
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
    `;

    // Add event listeners
    submitBtn.addEventListener('click', function () {
        const email = emailInput.value;
        if (validateEmail(email)) {
            saveGigNotification(email, gigTitle);
            modal.remove();
            showNotification(`You'll be notified about ${gigTitle}!`, 'success');
        } else {
            emailInput.style.borderColor = 'red';
            showNotification('Please enter a valid email address', 'error');
        }
    });

    cancelBtn.addEventListener('click', function () {
        modal.remove();
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    document.body.appendChild(modal);
    emailInput.focus();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function saveGigNotification(email, gigTitle) {
    const notifications = JSON.parse(localStorage.getItem('edygrim_gig_notifications')) || [];
    notifications.push({
        email,
        gig: gigTitle,
        date: new Date().toISOString()
    });
    localStorage.setItem('edygrim_gig_notifications', JSON.stringify(notifications));

    // TODO: Send to Supabase when implemented
    // supabase.from('gig_notifications').insert([{ email, gig: gigTitle }])
}

// Initialize these features
function initSectionFeatures() {
    // Wait for page to load
    setTimeout(() => {
        animateStats();
        enhanceAudioPlayers();
        setupGigCards();
    }, 1000);
}

// Add to DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    // ... existing initialization code ...

    // Add section features initialization
    initSectionFeatures();
});

// Add CSS for new elements (dynamically or in custom.css)
const style = document.createElement('style');
style.textContent = `
    .download-btn:hover {
        background: #ff4500 !important;
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(255, 69, 0, 0.3);
    }
    
    .rock-riot-dates ul li:last-child {
        border-bottom: none;
    }
    
    input.notify-email:focus {
        border-color: #ff4500 !important;
        box-shadow: 0 0 10px rgba(255, 69, 0, 0.3) !important;
        outline: none;
    }
    
    button.submit-notify:hover {
        background: #ff5500 !important;
        transform: translateY(-2px);
    }
    
    button.cancel-notify:hover {
        background: #555 !important;
    }
`;

document.head.appendChild(style);

// Booking Form Handling
function setupBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;

    // Add required indicators
    addRequiredIndicators();

    // Setup date restrictions
    setupDateRestrictions();

    // Setup budget range indicator
    setupBudgetIndicator();

    // Form submission handler - REMOVED to avoid conflict with supabase-config.js
    // bookingForm.addEventListener('submit', handleBookingSubmit);

    // Form validation
    setupFormValidation(bookingForm);

    // Character counter for textarea
    setupCharacterCounter();
}

function addRequiredIndicators() {
    const requiredLabels = [
        'book-name',
        'book-email',
        'book-event',
        'book-date',
        'book-venue'
    ];

    requiredLabels.forEach(id => {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) {
            label.classList.add('field-required');
        }
    });
}

function setupDateRestrictions() {
    const dateInput = document.getElementById('book-date');
    if (!dateInput) return;

    // Set minimum date to today
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    dateInput.min = minDate;

    // Set maximum date to 1 year from now
    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    dateInput.max = maxDate.toISOString().split('T')[0];

    // Add custom date validation
    dateInput.addEventListener('change', function () {
        const selectedDate = new Date(this.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showValidationError(this, 'Please select a future date');
        } else {
            clearValidationError(this);
        }
    });
}

function setupBudgetIndicator() {
    const budgetSelect = document.getElementById('book-budget');
    if (!budgetSelect) return;

    // Create budget indicator
    const indicatorHTML = `
        <div class="budget-indicator">
            <div class="budget-bar">
                <div class="budget-fill"></div>
            </div>
            <span class="budget-value">Select budget</span>
        </div>
    `;

    const indicator = document.createElement('div');
    indicator.innerHTML = indicatorHTML;
    budgetSelect.parentNode.appendChild(indicator);

    const budgetFill = indicator.querySelector('.budget-fill');
    const budgetValue = indicator.querySelector('.budget-value');

    // Update indicator on change
    budgetSelect.addEventListener('change', function () {
        const value = this.value;
        let percentage = 0;
        let displayText = 'Select budget';

        switch (value) {
            case '0-20000':
                percentage = 25;
                displayText = 'KES 0-20K';
                break;
            case '20000-50000':
                percentage = 50;
                displayText = 'KES 20-50K';
                break;
            case '50000-100000':
                percentage = 75;
                displayText = 'KES 50-100K';
                break;
            case '100000+':
                percentage = 100;
                displayText = 'KES 100K+';
                break;
        }

        budgetFill.style.width = `${percentage}%`;
        budgetValue.textContent = displayText;

        // Show budget guidance
        showBudgetGuidance(value);
    });

    // Initial state
    budgetFill.style.width = '0%';
}

function showBudgetGuidance(budgetRange) {
    const messages = {
        '0-20000': 'Small events, private parties (2-3 hours)',
        '20000-50000': 'Standard club nights, medium events (3-4 hours)',
        '50000-100000': 'Large events, festivals, corporate (4-6 hours)',
        '100000+': 'Premium events, multi-day festivals, weddings'
    };

    if (messages[budgetRange]) {
        showNotification(messages[budgetRange], 'info', 4000);
    }
}

function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function () {
            validateField(this);
        });

        // Clear validation on input
        input.addEventListener('input', function () {
            clearValidationError(this);
        });
    });

    // Email validation
    const emailInput = document.getElementById('book-email');
    if (emailInput) {
        emailInput.addEventListener('change', function () {
            if (!isValidEmail(this.value)) {
                showValidationError(this, 'Please enter a valid email address');
            }
        });
    }
}

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        showValidationError(field, 'This field is required');
        return false;
    }

    if (field.type === 'email' && field.value) {
        if (!isValidEmail(field.value)) {
            showValidationError(field, 'Please enter a valid email address');
            return false;
        }
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showValidationError(field, message) {
    clearValidationError(field);

    const error = document.createElement('div');
    error.className = 'validation-error';
    error.textContent = message;
    error.style.cssText = `
        color: #ff4444;
        font-size: 0.8rem;
        margin-top: 0.3rem;
        padding: 0.2rem 0.5rem;
        background: rgba(255, 68, 68, 0.1);
        border-radius: 4px;
        border-left: 2px solid #ff4444;
    `;

    field.parentNode.appendChild(error);
    field.style.borderColor = '#ff4444';
}

function clearValidationError(field) {
    const existingError = field.parentNode.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function setupCharacterCounter() {
    const textarea = document.getElementById('book-details');
    if (!textarea) return;

    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: #888;
        margin-top: 0.3rem;
    `;

    textarea.parentNode.appendChild(counter);

    function updateCounter() {
        const length = textarea.value.length;
        const maxLength = textarea.getAttribute('maxlength') || 1000;
        counter.textContent = `${length}/${maxLength} characters`;

        if (length > maxLength * 0.9) {
            counter.style.color = '#ff4500';
        } else if (length > maxLength * 0.7) {
            counter.style.color = '#ffa500';
        } else {
            counter.style.color = '#888';
        }
    }

    textarea.addEventListener('input', updateCounter);
    updateCounter(); // Initial call
}

// function handleBookingSubmit(e) { ... } - REMOVED to avoid conflict

function collectFormData(form) {
    const formData = {
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.name) {
            formData[input.name] = input.value;
        }
    });

    return formData;
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function setFormLoading(loading) {
    const form = document.getElementById('booking-form');
    const submitBtn = form.querySelector('input[type="submit"]');

    if (loading) {
        form.classList.add('loading');
        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;
    } else {
        form.classList.remove('loading');
        submitBtn.value = 'Send Booking Request';
        submitBtn.disabled = false;
    }
}

function saveBookingToStorage(bookingData) {
    const bookings = JSON.parse(localStorage.getItem('edygrim_bookings')) || [];
    bookings.push(bookingData);
    localStorage.setItem('edygrim_bookings', JSON.stringify(bookings));

    // Log for debugging
    console.log('Booking saved:', bookingData);

    // TODO: Replace with Supabase integration
    // await supabase.from('bookings').insert([bookingData]);
}

function generateBookingId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `EDG-${timestamp}-${random}`;
}

function showBookingConfirmation(bookingId, formData) {
    // Create or show confirmation element
    let confirmation = document.querySelector('.booking-confirmation');

    if (!confirmation) {
        confirmation = document.createElement('div');
        confirmation.className = 'booking-confirmation';
        document.getElementById('booking').appendChild(confirmation);
    }

    const eventDate = new Date(formData['book-date']).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    confirmation.innerHTML = `
        <h3>🎉 Booking Request Submitted!</h3>
        <p>Thank you <strong>${formData['book-name']}</strong> for your booking request.</p>
        <p>I'll review your request for <strong>${formData['book-event']}</strong> on <strong>${eventDate}</strong> and get back to you within 24 hours.</p>
        <div class="booking-id">Booking ID: ${bookingId}</div>
        <p><small>You'll receive a confirmation email shortly. You can also contact me directly on WhatsApp for urgent inquiries.</small></p>
    `;

    confirmation.classList.add('show');

    // Scroll to confirmation
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-hide after 30 seconds
    setTimeout(() => {
        confirmation.classList.remove('show');
    }, 30000);
}

async function sendBookingNotification(bookingData, bookingId) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Notification sent:', { bookingId, ...bookingData });

            // TODO: Integrate with email service or Supabase edge functions
            // Example: SendGrid, AWS SES, or Supabase Edge Functions

            resolve(true);
        }, 1000);
    });
}

function resetBudgetIndicator() {
    const budgetFill = document.querySelector('.budget-fill');
    const budgetValue = document.querySelector('.budget-value');

    if (budgetFill && budgetValue) {
        budgetFill.style.width = '0%';
        budgetValue.textContent = 'Select budget';
    }
}

// WhatsApp Booking Enhancement
function setupWhatsAppBooking() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (!whatsappBtn) return;

    // Add click tracking
    whatsappBtn.addEventListener('click', function () {
        // Track WhatsApp booking clicks
        const whatsappClicks = JSON.parse(localStorage.getItem('edygrim_whatsapp_clicks')) || [];
        whatsappClicks.push({
            timestamp: new Date().toISOString(),
            source: 'booking_section'
        });
        localStorage.setItem('edygrim_whatsapp_clicks', JSON.stringify(whatsappClicks));

        // TODO: Send to analytics
    });

    // Pre-fill WhatsApp message with form data if available
    const form = document.getElementById('booking-form');
    if (form) {
        form.addEventListener('input', function () {
            updateWhatsAppMessage();
        });
    }
}

function updateWhatsAppMessage() {
    const nameInput = document.getElementById('book-name');
    const eventInput = document.getElementById('book-event');
    const dateInput = document.getElementById('book-date');

    if (nameInput && nameInput.value) {
        const name = nameInput.value.split(' ')[0]; // First name only
        const eventType = eventInput ? eventInput.options[eventInput.selectedIndex].text : 'event';
        const date = dateInput ? new Date(dateInput.value).toLocaleDateString() : 'a date';

        const message = `Hi Edygrim, I'm ${name}. I'd like to book you for a ${eventType} on ${date}.`;
        const encodedMessage = encodeURIComponent(message);

        const whatsappBtn = document.querySelector('.whatsapp-btn');
        if (whatsappBtn) {
            whatsappBtn.href = `https://wa.me/254714937005?text=${encodedMessage}`;
        }
    }
}

// Initialize booking features
function initBookingFeatures() {
    setupBookingForm();
    setupWhatsAppBooking();
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // ... existing initialization code ...

    // Initialize booking features
    initBookingFeatures();
});

// Add CSS for new elements
const bookingStyles = document.createElement('style');
bookingStyles.textContent = `
    .validation-error {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .char-counter.warning {
        color: #ffa500 !important;
    }
    
    .char-counter.error {
        color: #ff4444 !important;
    }
    
    /* Add some spacing for the new elements */
    #booking-form .field {
        margin-bottom: 1rem;
    }
`;

document.head.appendChild(bookingStyles);

// About Section Enhancements
function setupAboutSection() {
    // Animate list items
    animateListItems();

    // Setup interactive tags
    setupMusicTags();

    // Setup parallax effect for the image
    setupParallaxImage();

    // Setup timeline (if added later)
    setupTimeline();

    // Setup stats counter
    setupAboutStats();

    // Setup testimonial slider (if added later)
    setupTestimonialSlider();
}

function animateListItems() {
    const listItems = document.querySelectorAll('#about ul li');

    listItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);

        // Add hover sound effect
        item.addEventListener('mouseenter', function () {
            playRockSound('hover');
        });

        // Add click to copy feature
        item.addEventListener('click', function () {
            const text = this.textContent.replace('✓', '').trim();
            copyToClipboard(text);
            showNotification(`Copied: "${text}"`, 'info', 2000);
        });

        // Add tooltip
        item.title = 'Click to copy';
    });
}

function setupMusicTags() {
    const tags = document.querySelectorAll('.tag');
    const rockSounds = [
        'guitar_riff_1',
        'guitar_riff_2',
        'drum_fill_1',
        'bass_slide'
    ];

    tags.forEach(tag => {
        // Add click event to play sound
        tag.addEventListener('click', function (e) {
            e.stopPropagation();
            const randomSound = rockSounds[Math.floor(Math.random() * rockSounds.length)];
            playRockSound(randomSound);

            // Visual feedback
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);

            // Show genre info
            showTagInfo(this.textContent);
        });

        // Add hover effect with delay
        let hoverTimeout;
        tag.addEventListener('mouseenter', function () {
            hoverTimeout = setTimeout(() => {
                this.classList.add('active');
            }, 300);
        });

        tag.addEventListener('mouseleave', function () {
            clearTimeout(hoverTimeout);
            this.classList.remove('active');
        });
    });

    // Create genre info modal
    createGenreInfoModal();
}

function playRockSound(soundType) {
    // This is a placeholder for actual sound effects
    // In production, you would load actual audio files
    console.log(`Playing rock sound: ${soundType}`);

    // For now, just play a beep for demonstration
    // For now, just play a beep for demonstration
    // AudioContext blocked on some browsers without user interaction on the specific element
    try {
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 440; // A4 note
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Lower volume
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    } catch (e) {
        console.log("Audio playback failed (likely due to strict autoplay policy):", e);
    }
}

function showTagInfo(genre) {
    const genreInfo = {
        'Classic Rock': '70s-80s rock legends like Led Zeppelin, AC/DC, Queen',
        'Hard Rock': 'Heavy guitar-driven rock from bands like Guns N\' Roses, Van Halen',
        'Metal': 'Everything from classic metal to modern metalcore',
        'Alternative': '90s grunge and alternative rock',
        'Rock Anthems': 'Iconic crowd-pleasing rock songs',
        '90s Rock': 'Nirvana, Pearl Jam, Soundgarden era',
        'Modern Rock': 'Contemporary rock and indie rock'
    };

    if (genreInfo[genre]) {
        showNotification(`${genre}: ${genreInfo[genre]}`, 'info', 3000);
    }
}

function createGenreInfoModal() {
    const modalHTML = `
        <div class="genre-modal" style="display: none;">
            <div class="modal-content">
                <h3><i class="fas fa-music"></i> Genre Info</h3>
                <div class="genre-details"></div>
                <button class="close-modal">&times;</button>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .genre-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .genre-modal .modal-content {
            background: #222;
            padding: 2rem;
            border-radius: 10px;
            border: 2px solid #ff4500;
            max-width: 500px;
            width: 90%;
            position: relative;
            animation: slideUp 0.3s ease;
        }
        
        .genre-modal h3 {
            color: #ff4500;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .genre-details {
            color: #ccc;
            line-height: 1.6;
        }
        
        .close-modal {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: #ff4500;
            font-size: 1.5rem;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .close-modal:hover {
            background: rgba(255, 69, 0, 0.1);
            transform: rotate(90deg);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function setupParallaxImage() {
    const aboutImage = document.querySelector('#about .image.main img');
    if (!aboutImage) return;

    let isInView = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isInView = entry.isIntersecting;
        });
    }, { threshold: 0.5 });

    observer.observe(aboutImage);

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        if (!isInView) return;

        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        aboutImage.style.transform = `translateY(${rate}px) scale(1.02)`;
    });
}

function setupTimeline() {
    // This would be used if you add a timeline section later
    const timelineData = [
        {
            year: '2010',
            title: 'Started DJ Career',
            description: 'Began playing in small Nairobi clubs'
        },
        {
            year: '2015',
            title: 'First Major Gig',
            description: 'Headlined at a major Nairobi venue'
        },
        {
            year: '2018',
            title: 'Launched Rock Riot',
            description: 'Started the monthly rock event series'
        },
        {
            year: '2023',
            title: 'National Recognition',
            description: 'Featured in Kenyan music publications'
        }
    ];

    // You can dynamically create timeline from this data
}

function setupAboutStats() {
    const stats = [
        { icon: '🎸', number: '100+', label: 'Gigs Played' },
        { icon: '🎚️', number: '50+', label: 'Mixes Created' },
        { icon: '👥', number: '5000+', label: 'Largest Crowd' },
        { icon: '🏆', number: '10+', label: 'Awards & Features' }
    ];

    // This can be used to dynamically create stats cards
}

function setupTestimonialSlider() {
    const testimonials = [
        {
            text: "Edygrim absolutely killed it at our festival! The crowd was electric all night.",
            author: "Sarah M., Festival Organizer"
        },
        {
            text: "Best rock DJ in Nairobi. His music selection is always on point!",
            author: "Mike T., Club Owner"
        },
        {
            text: "Professional, reliable, and knows exactly how to work a crowd. Highly recommended!",
            author: "James K., Event Planner"
        }
    ];

    // This can be used to create a testimonial slider
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Initialize about section
function initAboutSection() {
    setupAboutSection();
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // ... existing initialization code ...

    // Initialize about section features
    initAboutSection();
});

// Add additional CSS for animations
const aboutStyles = document.createElement('style');
aboutStyles.textContent = `
    /* Rock pulse animation for active tags */
    .tag.active {
        animation: rockPulse 0.5s ease;
    }
    
    @keyframes rockPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    /* Shake animation for list items */
    @keyframes listShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px); }
        75% { transform: translateX(3px); }
    }
    
    #about ul li:active {
        animation: listShake 0.3s ease;
    }
    
    /* Glow effect for image */
    .image.main {
        position: relative;
    }
    
    .image.main:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, transparent 30%, rgba(255, 69, 0, 0.1) 70%);
        border-radius: 10px;
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
    }
    
    .image.main:hover:after {
        opacity: 1;
    }
`;

document.head.appendChild(aboutStyles);

// Rock trivia feature
function showRockTrivia() {
    const trivia = [
        "Did you know? The first rock and roll song is widely considered to be 'Rocket 88' by Jackie Brenston and his Delta Cats (1951)",
        "The term 'rock and roll' was originally slang for dancing and romance in African American Vernacular English",
        "The world's longest guitar riff lasted 24 hours and 18 minutes, achieved in 2011",
        "The Gibson Les Paul guitar was originally rejected by Gibson but went on to become one of the most iconic guitars in rock history",
        "AC/DC's 'Back in Black' is the second best-selling album of all time worldwide"
    ];

    const randomTrivia = trivia[Math.floor(Math.random() * trivia.length)];

    // Show trivia in a subtle way
    const triviaElement = document.createElement('div');
    triviaElement.className = 'rock-trivia';
    triviaElement.innerHTML = `
        <div class="trivia-content">
            <span class="trivia-icon">🤘</span>
            <span class="trivia-text">${randomTrivia}</span>
            <button class="close-trivia">&times;</button>
        </div>
    `;

    triviaElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(255, 69, 0, 0.9);
        color: #000;
        padding: 1rem;
        border-radius: 8px;
        max-width: 300px;
        z-index: 1000;
        animation: slideInRight 0.5s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        font-weight: bold;
    `;

    triviaElement.querySelector('.trivia-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.8rem;
    `;

    triviaElement.querySelector('.trivia-icon').style.cssText = `
        font-size: 1.5rem;
        flex-shrink: 0;
    `;

    triviaElement.querySelector('.trivia-text').style.cssText = `
        flex: 1;
        font-size: 0.9rem;
        line-height: 1.4;
    `;

    triviaElement.querySelector('.close-trivia').style.cssText = `
        background: none;
        border: none;
        color: #000;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    `;

    triviaElement.querySelector('.close-trivia').addEventListener('mouseenter', function () {
        this.style.background = 'rgba(0, 0, 0, 0.1)';
    });

    triviaElement.querySelector('.close-trivia').addEventListener('click', function () {
        triviaElement.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => triviaElement.remove(), 500);
    });

    document.body.appendChild(triviaElement);

    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (triviaElement.parentNode) {
            triviaElement.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => triviaElement.remove(), 500);
        }
    }, 10000);
}

// Show trivia randomly when on about page
if (window.location.hash === '#about') {
    setTimeout(showRockTrivia, 3000);
}

// Contact Section Enhancements
function setupContactSection() {
    // Add classes to contact methods for different styling
    styleContactMethods();

    // Setup contact form
    setupContactForm();

    // Setup social media interactions
    setupSocialInteractions();

    // Setup quick actions
    setupQuickActions();

    // Setup WhatsApp QR code (optional)
    setupWhatsAppQR();

    // Setup click tracking
    setupContactAnalytics();

    // Setup email link with fallback
    setupEmailLinks();
}

function styleContactMethods() {
    const contactMethods = document.querySelectorAll('.contact-method');

    contactMethods.forEach(method => {
        const icon = method.querySelector('i');
        if (!icon) return;

        // Add specific class based on icon
        if (icon.classList.contains('fa-whatsapp')) {
            method.classList.add('whatsapp');
            addPulseEffect(method);
        } else if (icon.classList.contains('fa-instagram')) {
            method.classList.add('instagram');
        } else if (icon.classList.contains('fa-spotify')) {
            method.classList.add('spotify');
        } else if (icon.classList.contains('fa-ticket-alt')) {
            method.classList.add('tickets');
        }

        // Add click sound
        method.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                playContactSound(this.className);
            }
        });
    });
}

function addPulseEffect(element) {
    element.style.position = 'relative';

    const pulse = document.createElement('div');
    pulse.className = 'pulse-ring';
    pulse.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        border: 2px solid #25D366;
        border-radius: 10px;
        opacity: 0;
        pointer-events: none;
    `;

    element.appendChild(pulse);

    element.addEventListener('mouseenter', function () {
        pulse.style.animation = 'pulse 1.5s infinite';
    });

    element.addEventListener('mouseleave', function () {
        pulse.style.animation = 'none';
    });
}

function playContactSound(type) {
    const sounds = {
        'whatsapp': 'message_sent',
        'instagram': 'camera_shutter',
        'spotify': 'music_start',
        'tickets': 'cash_register'
    };

    // This would play actual sounds in production
    console.log(`Playing ${sounds[type] || 'click'} sound`);
}

function setupContactForm() {
    const contactForm = document.querySelector('#contact form');
    if (!contactForm) return;

    // Setup form validation
    setupContactValidation(contactForm);

    // Handle form submission
    contactForm.addEventListener('submit', handleContactSubmit);

    // Add character counter
    setupMessageCounter();

    // Add auto-save feature
    setupAutoSave();
}

function setupContactValidation(form) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    // Real-time validation
    [nameInput, emailInput, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('blur', validateContactField);
            input.addEventListener('input', clearContactError);
        }
    });

    // Email validation
    if (emailInput) {
        emailInput.addEventListener('change', function () {
            if (this.value && !isValidEmail(this.value)) {
                showContactError(this, 'Please enter a valid email address');
            }
        });
    }
}

function validateContactField(e) {
    const field = e.target;

    if (field.hasAttribute('required') && !field.value.trim()) {
        showContactError(field, 'This field is required');
        return false;
    }

    if (field.type === 'email' && field.value) {
        if (!isValidEmail(field.value)) {
            showContactError(field, 'Please enter a valid email address');
            return false;
        }
    }

    return true;
}

function showContactError(field, message) {
    clearContactError(field);

    const error = document.createElement('div');
    error.className = 'contact-error';
    error.textContent = message;
    error.style.cssText = `
        color: #ff4444;
        font-size: 0.8rem;
        margin-top: 0.3rem;
        padding: 0.3rem 0.5rem;
        background: rgba(255, 68, 68, 0.1);
        border-radius: 4px;
        border-left: 2px solid #ff4444;
        animation: slideDown 0.3s ease;
    `;

    field.parentNode.appendChild(error);
    field.style.borderColor = '#ff4444';
}

function clearContactError(field) {
    const existingError = field.parentNode.querySelector('.contact-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function setupMessageCounter() {
    const messageInput = document.getElementById('contact-message');
    if (!messageInput) return;

    const counter = document.createElement('div');
    counter.className = 'message-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: #888;
        margin-top: 0.3rem;
    `;

    messageInput.parentNode.appendChild(counter);

    function updateCounter() {
        const length = messageInput.value.length;
        const maxLength = 500;
        counter.textContent = `${length}/${maxLength} characters`;

        if (length > maxLength) {
            counter.style.color = '#ff4444';
            messageInput.style.borderColor = '#ff4444';
        } else if (length > maxLength * 0.8) {
            counter.style.color = '#ffa500';
        } else {
            counter.style.color = '#888';
            messageInput.style.borderColor = '';
        }
    }

    messageInput.addEventListener('input', updateCounter);
    messageInput.setAttribute('maxlength', '500');
    updateCounter();
}

function setupAutoSave() {
    const form = document.querySelector('#contact form');
    const inputs = form.querySelectorAll('input, textarea');

    // Load saved data
    const savedData = JSON.parse(localStorage.getItem('contact_form_draft')) || {};
    inputs.forEach(input => {
        if (input.name && savedData[input.name]) {
            input.value = savedData[input.name];
        }
    });

    // Auto-save on input
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            const formData = {};
            inputs.forEach(i => {
                if (i.name) {
                    formData[i.name] = i.value;
                }
            });
            localStorage.setItem('contact_form_draft', JSON.stringify(formData));
        });
    });

    // Clear draft on successful submission
    form.addEventListener('submit', function () {
        localStorage.removeItem('contact_form_draft');
    });
}

async function handleContactSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = collectContactFormData(form);

    // Validate form
    if (!validateContactForm(form)) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }

    // Show loading state
    setContactFormLoading(true);

    try {
        // Save message
        saveContactMessage(formData);

        // Show success message
        showContactSuccess(formData);

        // Send notification (simulated)
        await sendContactNotification(formData);

        // Reset form
        form.reset();

        // Clear draft
        localStorage.removeItem('contact_form_draft');

        // Show success notification
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success', 5000);

    } catch (error) {
        console.error('Contact form error:', error);
        showNotification('There was an error sending your message. Please try again.', 'error');
    } finally {
        setContactFormLoading(false);
    }
}

function collectContactFormData(form) {
    const formData = {
        timestamp: new Date().toISOString(),
        type: 'general_inquiry'
    };

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.name && input.value) {
            formData[input.name] = input.value;
        }
    });

    return formData;
}

function validateContactForm(form) {
    let isValid = true;
    const requiredFields = ['contact-name', 'contact-email', 'contact-message'];

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            showContactError(field, 'This field is required');
            isValid = false;
        }

        if (fieldId === 'contact-email' && field.value) {
            if (!isValidEmail(field.value)) {
                showContactError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
    });

    return isValid;
}

function setContactFormLoading(loading) {
    const form = document.querySelector('#contact form');
    const submitBtn = form.querySelector('input[type="submit"]');

    if (loading) {
        form.classList.add('loading');
        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;
    } else {
        form.classList.remove('loading');
        submitBtn.value = 'Send Message';
        submitBtn.disabled = false;
    }
}

function saveContactMessage(messageData) {
    const messages = JSON.parse(localStorage.getItem('contact_messages')) || [];
    messages.push(messageData);
    localStorage.setItem('contact_messages', JSON.stringify(messages));

    console.log('Message saved:', messageData);

    // TODO: Replace with Supabase integration
    // await supabase.from('contact_messages').insert([messageData]);
}

function showContactSuccess(formData) {
    // Create or show success message
    let successElement = document.querySelector('.contact-success');

    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'contact-success';
        document.querySelector('#contact form').parentNode.appendChild(successElement);
    }

    successElement.innerHTML = `
        <h4>Message Sent Successfully!</h4>
        <p>Thank you <strong>${formData['contact-name']}</strong> for your message. 
        I'll respond to <strong>${formData['contact-email']}</strong> within 24-48 hours.</p>
        <p><small>For urgent inquiries, please contact me directly on WhatsApp.</small></p>
    `;

    successElement.classList.add('show');

    // Auto-hide after 10 seconds
    setTimeout(() => {
        successElement.classList.remove('show');
    }, 10000);
}

async function sendContactNotification(formData) {
    // Simulate sending notification
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Contact notification sent:', formData);
            resolve(true);
        }, 1000);
    });
}

function setupSocialInteractions() {
    const socialIcons = document.querySelectorAll('#contact .icons a');

    socialIcons.forEach(icon => {
        // Add hover effect
        icon.addEventListener('mouseenter', function () {
            const iconType = this.querySelector('i').className;
            animateSocialIcon(this, iconType);
        });

        // Add click tracking
        icon.addEventListener('click', function (e) {
            const platform = this.className.includes('instagram') ? 'instagram' :
                this.className.includes('spotify') ? 'spotify' :
                    this.className.includes('whatsapp') ? 'whatsapp' : 'email';

            trackSocialClick(platform);
        });
    });
}

function animateSocialIcon(icon, iconType) {
    // Add bounce animation
    icon.style.animation = 'bounce 0.5s ease';
    setTimeout(() => {
        icon.style.animation = '';
    }, 500);

    // Platform-specific effects
    switch (true) {
        case iconType.includes('instagram'):
            icon.style.boxShadow = '0 0 20px rgba(225, 48, 108, 0.5)';
            break;
        case iconType.includes('spotify'):
            icon.style.boxShadow = '0 0 20px rgba(29, 185, 84, 0.5)';
            break;
        case iconType.includes('whatsapp'):
            icon.style.boxShadow = '0 0 20px rgba(37, 211, 102, 0.5)';
            break;
        case iconType.includes('envelope'):
            icon.style.boxShadow = '0 0 20px rgba(255, 69, 0, 0.5)';
            break;
    }

    // Reset shadow after animation
    setTimeout(() => {
        icon.style.boxShadow = '';
    }, 1000);
}

function trackSocialClick(platform) {
    const socialClicks = JSON.parse(localStorage.getItem('social_clicks')) || [];
    socialClicks.push({
        platform,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('social_clicks', JSON.stringify(socialClicks));

    // TODO: Send to analytics
}

function setupQuickActions() {
    const quickActionsHTML = `
        <div class="contact-quick-actions">
            <a href="tel:+254714937005" class="quick-action-btn phone">
                <i class="fas fa-phone"></i> Call Now
            </a>
            <a href="mailto:booking@edygrim.com" class="quick-action-btn email">
                <i class="fas fa-envelope"></i> Email Directly
            </a>
        </div>
    `;

    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        const actionsDiv = document.createElement('div');
        actionsDiv.innerHTML = quickActionsHTML;
        contactInfo.parentNode.insertBefore(actionsDiv, contactInfo.nextSibling);
    }
}

function setupWhatsAppQR() {
    // Optional: Add QR code for WhatsApp
    const whatsappMethod = document.querySelector('.contact-method.whatsapp');
    if (whatsappMethod) {
        const qrHTML = `
            <div class="whatsapp-qr">
                <p><small>Scan to start chat on WhatsApp</small></p>
                <div class="qr-code">
                    <!-- In production, generate actual QR code -->
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">📱</div>
                        <div>WhatsApp</div>
                        <div>+254 714 937 005</div>
                    </div>
                </div>
                <p><small>Or click the link above</small></p>
            </div>
        `;

        const qrDiv = document.createElement('div');
        qrDiv.innerHTML = qrHTML;
        whatsappMethod.appendChild(qrDiv);

        // Toggle QR code on click
        const qrSection = qrDiv.querySelector('.whatsapp-qr');
        qrSection.style.display = 'none';

        whatsappMethod.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                qrSection.style.display = qrSection.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
}

function setupContactAnalytics() {
    // Track contact section views
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackContactView();
            }
        });
    }, { threshold: 0.5 });

    const contactSection = document.getElementById('contact');
    if (contactSection) {
        observer.observe(contactSection);
    }
}

function trackContactView() {
    const contactViews = JSON.parse(localStorage.getItem('contact_views')) || [];
    contactViews.push(new Date().toISOString());
    localStorage.setItem('contact_views', JSON.stringify(contactViews));
}

function setupEmailLinks() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

    emailLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Check if default mail client is available
            if (!this.href.startsWith('mailto:')) return;

            // Fallback for mobile devices
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // Mobile devices handle mailto links well
                return;
            }

            // Desktop fallback - copy email to clipboard
            e.preventDefault();
            const email = this.href.replace('mailto:', '');
            copyToClipboard(email);
            showNotification(`Email copied to clipboard: ${email}`, 'info', 3000);

            // Try to open mail client anyway
            setTimeout(() => {
                window.location.href = this.href;
            }, 100);
        });
    });
}

// Initialize contact section
function initContactSection() {
    setupContactSection();
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // ... existing initialization code ...

    // Initialize contact section features
    initContactSection();
});

// Add additional CSS for contact animations
const contactStyles = document.createElement('style');
contactStyles.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0) scale(1.1); }
        50% { transform: translateY(-10px) scale(1.2); }
    }
    
    @keyframes pulse {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Loading spinner for forms */
    #contact form.loading:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 69, 0, 0.3);
        border-top: 3px solid #ff4500;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 10;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    /* Floating animation for contact methods */
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
    
    .contact-method {
        animation: float 3s ease-in-out infinite;
    }
    
    .contact-method:nth-child(2) { animation-delay: 0.5s; }
    .contact-method:nth-child(3) { animation-delay: 1s; }
    .contact-method:nth-child(4) { animation-delay: 1.5s; }
`;

document.head.appendChild(contactStyles);

// Copy phone number functionality
function setupPhoneCopy() {
    const phoneLinks = document.querySelectorAll('a[href*="tel:"], a[href*="wa.me"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Don't interfere with WhatsApp links
            if (this.href.includes('wa.me')) return;

            // For tel: links on desktop, copy to clipboard
            if (this.href.startsWith('tel:') && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                e.preventDefault();
                const phone = this.href.replace('tel:', '');
                copyToClipboard(phone);
                showNotification(`Phone number copied: ${phone}`, 'info', 3000);
            }
        });
    });
}

// Initialize phone copy
setupPhoneCopy();