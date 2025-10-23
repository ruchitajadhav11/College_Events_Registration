// Event category filtering
function initializeEventFiltering() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide events based on category
            const allEventCards = document.querySelectorAll('.event-card');
            allEventCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventFiltering();
    
    // Form submission handling
    document.getElementById('eventRegistrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const eventName = document.getElementById('eventSelect').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const studentId = document.getElementById('studentId').value;
        const department = document.getElementById('department').value;
        const year = document.getElementById('year').value;
        const phone = document.getElementById('phone').value;
        const comments = document.getElementById('comments').value;
        
        // Store registration data
        const registration = {
            eventName,
            firstName,
            lastName,
            email,
            studentId,
            department,
            year,
            phone,
            comments,
            timestamp: new Date().toLocaleString()
        };
        
        // Save to localStorage
        let registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
        registrations.push(registration);
        localStorage.setItem('eventRegistrations', JSON.stringify(registrations));
        
        // Update admin panel if function exists
        if (typeof updateRegistrationsList === 'function') {
            updateRegistrationsList();
        }
        
        // Set values in the modal
        document.getElementById('registeredEvent').textContent = eventName;
        document.getElementById('registeredEmail').textContent = email;
        
        // Show the success modal
        document.getElementById('successModal').style.display = 'flex';
        
        // Reset the form
        this.reset();
    });

    // Register buttons on event cards (delegated event listener)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('register-btn')) {
            const eventName = e.target.getAttribute('data-event');
            document.getElementById('eventSelect').value = eventName;
            document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Modal close functionality
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('successModal').style.display = 'none';
    });

    document.getElementById('closeModalBtn').addEventListener('click', function() {
        document.getElementById('successModal').style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('successModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});