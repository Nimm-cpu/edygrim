// supabase-config.js
const SUPABASE_URL = 'https://ptoxjmirnqtjdwdzolnt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TQzqZImbJ6u1c858SKFI9Q_lyoeM5wF';

// Initialize Supabase client
const supabaseClient = window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper functions
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}

async function signOut() {
    await supabaseClient.auth.signOut();
    window.location.href = 'admin-login.html';
}

// Booking form handler for index.html
function setupBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = bookingForm.querySelector('input[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.value : 'Send Booking Request';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.value = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
        }

        const formData = {
            name: document.getElementById('book-name').value,
            email: document.getElementById('book-email').value,
            event_type: document.getElementById('book-event').value,
            event_date: document.getElementById('book-date').value,
            venue: document.getElementById('book-venue').value,
            details: document.getElementById('book-details').value,
            budget_range: document.getElementById('book-budget').value,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        try {
            const { data, error } = await supabaseClient
                .from('booking_requests')
                .insert([formData]);

            if (error) throw error;

            alert('✅ Booking request submitted successfully! I\'ll get back to you within 24 hours.');
            bookingForm.reset();

        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('❌ There was an error submitting your booking. Please try again or contact me directly via WhatsApp.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.value = originalBtnText;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
        }
    });
}

// Contact form handler for index.html
function setupContactForm() {
    const contactForm = document.querySelector('form[action="#"]:not(#booking-form)');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('contact-name')?.value || '',
            email: document.getElementById('contact-email')?.value || '',
            subject: document.getElementById('contact-subject')?.value || '',
            message: document.getElementById('contact-message')?.value || '',
            created_at: new Date().toISOString()
        };

        try {
            const { data, error } = await supabaseClient
                .from('contact_messages')
                .insert([formData]);

            if (error) throw error;

            alert('✅ Message sent successfully!');
            contactForm.reset();

        } catch (error) {
            console.error('Error sending message:', error);
            alert('❌ There was an error sending your message. Please try again.');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log('Supabase config loaded');
    setupBookingForm();
    setupContactForm();
});