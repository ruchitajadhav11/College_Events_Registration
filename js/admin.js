// Admin Configuration
const ADMIN_CONFIG = {
    email: 'admin@university.edu',
    password: 'admin123',
    sessionTimeout: 2 * 60 * 60 * 1000 // 2 hours
};

// Admin State
let adminLoggedIn = false;
let adminSessionTimer = null;

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    checkAdminSession();
    initializeAdminEventListeners();
    loadAllEvents();
});

// Check if admin is already logged in
function checkAdminSession() {
    const session = JSON.parse(localStorage.getItem('adminSession') || '{}');
    if (session.loggedIn && session.expiry > Date.now()) {
        adminLoggedIn = true;
        showAdminDashboard();
    } else {
        localStorage.removeItem('adminSession');
        showAdminLogin();
    }
}

// Initialize Event Listeners
function initializeAdminEventListeners() {
    // Admin Login Form
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    
    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', handleAdminLogout);
    
    // Create Event Form
    document.getElementById('createEventForm').addEventListener('submit', handleCreateEvent);
    
    // Registration Filter
    document.getElementById('viewEventRegistrations').addEventListener('change', updateRegistrationsList);
}

// Admin Login Handler
function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (email === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password) {
        // Successful login
        adminLoggedIn = true;
        createAdminSession();
        showAdminDashboard();
        showStatusMessage('Login successful!', 'success');
    } else {
        // Failed login
        showStatusMessage('Invalid email or password!', 'error');
    }
}

// Create Admin Session
function createAdminSession() {
    const session = {
        loggedIn: true,
        expiry: Date.now() + ADMIN_CONFIG.sessionTimeout
    };
    localStorage.setItem('adminSession', JSON.stringify(session));
    
    // Set session timeout
    adminSessionTimer = setTimeout(() => {
        handleAdminLogout();
    }, ADMIN_CONFIG.sessionTimeout);
}

// Admin Logout Handler
function handleAdminLogout() {
    adminLoggedIn = false;
    localStorage.removeItem('adminSession');
    clearTimeout(adminSessionTimer);
    showAdminLogin();
    showStatusMessage('Logged out successfully!', 'success');
}

// Show Admin Login Form
function showAdminLogin() {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Show Admin Dashboard
function showAdminDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    
    // Refresh data
    loadAllEvents();
    updateRegistrationsList();
}

// Status Message Helper
function showStatusMessage(message, type) {
    // Remove existing status messages
    const existingMessages = document.querySelectorAll('.status-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message status-${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        ${message}
    `;
    
    document.getElementById('adminDashboard').insertBefore(messageDiv, document.getElementById('adminDashboard').firstChild);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Load All Events (Original + Admin Created)
function loadAllEvents() {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Loading events...</p></div>';
    
    setTimeout(() => {
        const originalEvents = getOriginalEvents();
        const adminEvents = JSON.parse(localStorage.getItem('adminEvents') || '[]');
        const allEvents = [...originalEvents, ...adminEvents];
        
        displayEventsManagement(allEvents);
        updateAdminEventSelect(allEvents);
    }, 500);
}

// Get Original Events
function getOriginalEvents() {
    return [
        {
            id: 1,
            name: "Cultural Fest 2023",
            category: "cultural",
            date: "November 5, 2023",
            time: "11:00 AM - 9:00 PM",
            location: "University Main Ground",
            description: "Experience a vibrant celebration of diverse cultures with food, music, dance, and art from around the world.",
            image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            type: "original"
        },
        {
            id: 2,
            name: "Battle of Bands",
            category: "cultural",
            date: "October 25, 2023",
            time: "6:00 PM - 10:00 PM",
            location: "University Amphitheater",
            description: "Witness the ultimate musical showdown as college bands compete for the championship title.",
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            type: "original"
        },
        {
            id: 3,
            name: "Drama Night",
            category: "cultural",
            date: "November 12, 2023",
            time: "7:00 PM - 10:00 PM",
            location: "University Auditorium",
            description: "Enjoy captivating theatrical performances by talented student drama groups.",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            type: "original"
        },
        {
            id: 4,
            name: "Hackathon 2023",
            category: "technical",
            date: "November 10-12, 2023",
            time: "24-hour event",
            location: "Computer Science Building",
            description: "Participate in our annual coding marathon to solve real-world problems and win exciting prizes.",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            type: "original"
        },
        {
            id: 5,
            name: "AI Workshop",
            category: "technical",
            date: "October 28, 2023",
            time: "10:00 AM - 4:00 PM",
            location: "Tech Innovation Center",
            description: "Learn about Artificial Intelligence and Machine Learning from industry experts with hands-on sessions.",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            type: "original"
        },
        {
            id: 6,
            name: "Tech Symposium",
            category: "technical",
            date: "October 15, 2023",
            time: "9:00 AM - 5:00 PM",
            location: "Engineering Building, Room 101",
            description: "Join us for a day of cutting-edge technology presentations, workshops, and networking with industry leaders.",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            type: "original"
        },
        {
            id: 7,
            name: "Career Fair",
            category: "central",
            date: "October 28, 2023",
            time: "10:00 AM - 4:00 PM",
            location: "Student Union Building",
            description: "Connect with top employers and explore internship and job opportunities across various industries.",
            image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            type: "original"
        },
        {
            id: 8,
            name: "University Foundation Day",
            category: "central",
            date: "December 1, 2023",
            time: "9:00 AM - 4:00 PM",
            location: "Main Campus",
            description: "Celebrate the founding of our university with special ceremonies, guest speakers, and campus-wide activities.",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            type: "original"
        }
    ];
}

// Display Events in Management Section
function displayEventsManagement(events) {
    const eventsList = document.getElementById('eventsList');
    
    if (events.length === 0) {
        eventsList.innerHTML = '<p>No events found. Create your first event!</p>';
        return;
    }
    
    // Sort events: admin events first, then original events
    events.sort((a, b) => {
        if (a.type === 'admin' && b.type === 'original') return -1;
        if (a.type === 'original' && b.type === 'admin') return 1;
        return 0;
    });
    
    let html = '';
    events.forEach(event => {
        const isOriginal = event.type === 'original';
        html += `
            <div class="event-management-item" data-event-id="${event.id}">
                <div class="event-management-info">
                    <h4>${event.name}</h4>
                    <p><strong>Category:</strong> ${event.category.charAt(0).toUpperCase() + event.category.slice(1)} | <strong>Date:</strong> ${event.date} | <strong>Location:</strong> ${event.location}</p>
                    <p>${event.description}</p>
                    ${isOriginal ? 
                        '<span style="color: var(--primary); font-size: 0.8rem;"><i class="fas fa-lock"></i> Original Event (Read-only)</span>' : 
                        '<span style="color: var(--success); font-size: 0.8rem;"><i class="fas fa-edit"></i> Admin Created Event</span>'
                    }
                </div>
                <div class="event-management-actions">
                    ${!isOriginal ? `
                        <button class="btn btn-delete delete-event-btn" data-event-id="${event.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : `
                        <button class="btn" disabled style="background: #ccc; cursor: not-allowed;">
                            <i class="fas fa-lock"></i> Read-only
                        </button>
                    `}
                </div>
            </div>
        `;
    });
    
    eventsList.innerHTML = html;
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-event-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.closest('.delete-event-btn').getAttribute('data-event-id');
            deleteEvent(eventId);
        });
    });
}

// Create Event Handler
function handleCreateEvent(e) {
    e.preventDefault();
    
    if (!adminLoggedIn) {
        showStatusMessage('Please login to create events!', 'error');
        return;
    }
    
    // Get form values
    const eventName = document.getElementById('newEventName').value;
    const category = document.getElementById('newEventCategory').value;
    const date = document.getElementById('newEventDate').value;
    const time = document.getElementById('newEventTime').value;
    const location = document.getElementById('newEventLocation').value;
    const description = document.getElementById('newEventDescription').value;
    const image = document.getElementById('newEventImage').value || getDefaultImage(category);
    
    // Validate required fields
    if (!eventName || !date || !time || !location || !description) {
        showStatusMessage('Please fill all required fields!', 'error');
        return;
    }
    
    // Validate date
    if (new Date(date) < new Date().setHours(0,0,0,0)) {
        showStatusMessage('Event date cannot be in the past!', 'error');
        return;
    }
    
    // Create new event object
    const newEvent = {
        id: Date.now(),
        name: eventName,
        category: category,
        date: new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: time,
        location: location,
        description: description,
        image: image,
        type: "admin"
    };
    
    // Save event
    saveEvent(newEvent);
    
    // Update UI
    addEventToGrid(newEvent);
    updateEventSelect(newEvent);
    updateAdminEventSelect([newEvent]);
    loadAllEvents(); // Refresh management list
    
    // Show success message
    showStatusMessage(`Event "${eventName}" created successfully!`, 'success');
    
    // Reset form
    e.target.reset();
}

// Delete Event
function deleteEvent(eventId) {
    if (!adminLoggedIn) {
        showStatusMessage('Please login to delete events!', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        return;
    }
    
    const events = JSON.parse(localStorage.getItem('adminEvents') || '[]');
    const eventIndex = events.findIndex(e => e.id == eventId);
    
    if (eventIndex === -1) {
        showStatusMessage('Event not found!', 'error');
        return;
    }
    
    const eventName = events[eventIndex].name;
    
    // Remove event from storage
    events.splice(eventIndex, 1);
    localStorage.setItem('adminEvents', JSON.stringify(events));
    
    // Remove from UI
    removeEventFromGrid(eventId);
    removeEventFromSelect(eventName);
    loadAllEvents();
    
    showStatusMessage(`Event "${eventName}" deleted successfully!`, 'success');
}

// Save event to localStorage
function saveEvent(event) {
    let events = JSON.parse(localStorage.getItem('adminEvents') || '[]');
    // Check if event already exists
    const existingIndex = events.findIndex(e => e.id === event.id);
    if (existingIndex === -1) {
        events.push(event);
    } else {
        events[existingIndex] = event;
    }
    localStorage.setItem('adminEvents', JSON.stringify(events));
}

// Get default image based on category
function getDefaultImage(category) {
    const defaultImages = {
        cultural: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        technical: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        central: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    };
    return defaultImages[category] || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
}

// Add event to the events grid
function addEventToGrid(event) {
    const eventsGrid = document.querySelector('.events-grid');
    
    // Check if event already exists in grid
    const existingEvent = document.querySelector(`[data-event-id="${event.id}"]`);
    if (existingEvent) {
        existingEvent.remove();
    }
    
    const eventCard = document.createElement('div');
    eventCard.className = `event-card ${event.category === 'cultural' ? 'active' : ''}`;
    eventCard.setAttribute('data-category', event.category);
    eventCard.setAttribute('data-event-id', event.id);

    const categoryClass = `event-category ${event.category}`;
    const btnClass = `btn btn-${event.category} register-btn`;

    eventCard.innerHTML = `
        <div class="event-image" style="background-image: url('${event.image}');"></div>
        <div class="event-content">
            <h3 class="event-title">${event.name}</h3>
            <span class="${categoryClass}">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
            <div class="event-date">
                <i class="far fa-calendar-alt"></i>
                <span>${event.date} | ${event.time}</span>
            </div>
            <div class="event-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${event.location}</span>
            </div>
            <p class="event-description">${event.description}</p>
            <button class="${btnClass} register-btn" data-event="${event.name}">Register Now</button>
        </div>
    `;

    eventsGrid.appendChild(eventCard);
    
    // Re-initialize event filtering for the new card
    initializeEventFilteringForCard(eventCard);
}

// Initialize event filtering for a specific card
function initializeEventFilteringForCard(card) {
    const category = card.getAttribute('data-category');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategory = this.getAttribute('data-category');
            if (selectedCategory === 'all' || selectedCategory === category) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    });
}

// Update registration form dropdown
function updateEventSelect(event) {
    const eventSelect = document.getElementById('eventSelect');
    
    // Find the correct optgroup
    let optgroup;
    const categoryLabel = event.category.charAt(0).toUpperCase() + event.category.slice(1) + ' Events';
    
    for (let i = 0; i < eventSelect.children.length; i++) {
        if (eventSelect.children[i].tagName === 'OPTGROUP' && eventSelect.children[i].label === categoryLabel) {
            optgroup = eventSelect.children[i];
            break;
        }
    }
    
    // If optgroup doesn't exist, create it
    if (!optgroup) {
        optgroup = document.createElement('optgroup');
        optgroup.label = categoryLabel;
        eventSelect.appendChild(optgroup);
    }
    
    // Check if option already exists
    const existingOption = Array.from(optgroup.children).find(option => option.value === event.name);
    if (!existingOption) {
        const option = document.createElement('option');
        option.value = event.name;
        option.textContent = event.name;
        optgroup.appendChild(option);
    }
}

// Update admin filter dropdown
function updateAdminEventSelect(events) {
    const adminEventSelect = document.getElementById('viewEventRegistrations');
    
    // Clear existing options except "All Events"
    while (adminEventSelect.children.length > 1) {
        adminEventSelect.removeChild(adminEventSelect.lastChild);
    }
    
    // Add all events
    events.forEach(event => {
        const option = document.createElement('option');
        option.value = event.name;
        option.textContent = event.name;
        adminEventSelect.appendChild(option);
    });
}

// Remove event from grid
function removeEventFromGrid(eventId) {
    const eventCard = document.querySelector(`.event-card[data-event-id="${eventId}"]`);
    if (eventCard) {
        eventCard.remove();
    }
}

// Remove event from select dropdowns
function removeEventFromSelect(eventName) {
    const eventSelect = document.getElementById('eventSelect');
    const adminEventSelect = document.getElementById('viewEventRegistrations');
    
    // Remove from both selects
    [eventSelect, adminEventSelect].forEach(select => {
        const options = select.getElementsByTagName('option');
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === eventName) {
                options[i].remove();
                break;
            }
        }
    });
}

// Update registrations list in admin panel
// Enhanced updateRegistrationsList function with edit/delete capabilities
function updateRegistrationsList() {
    const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
    const registrationsList = document.getElementById('registrationsList');
    const selectedEvent = document.getElementById('viewEventRegistrations').value;
    
    if (registrations.length === 0) {
        registrationsList.innerHTML = '<p>No registrations to display.</p>';
        return;
    }
    
    let filteredRegistrations = registrations;
    if (selectedEvent && selectedEvent !== '') {
        filteredRegistrations = registrations.filter(reg => reg.eventName === selectedEvent);
    }
    
    let html = '<div style="max-height: 400px; overflow-y: auto;">';
    html += '<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">';
    html += '<thead><tr style="background: #f8f9fa;">';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Name</th>';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Event</th>';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Email</th>';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Department</th>';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Actions</th>';
    html += '</tr></thead>';
    html += '<tbody>';
    
    filteredRegistrations.forEach((reg, index) => {
        const originalIndex = registrations.findIndex(r => 
            r.email === reg.email && 
            r.eventName === reg.eventName && 
            r.timestamp === reg.timestamp
        );
        
        html += `<tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${reg.firstName} ${reg.lastName}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${reg.eventName}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${reg.email}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${reg.department}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${reg.timestamp}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                <button class="btn btn-edit edit-registration-btn" style="padding: 4px 8px; font-size: 0.8rem; margin: 2px;" data-index="${originalIndex}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-delete delete-registration-btn" style="padding: 4px 8px; font-size: 0.8rem; margin: 2px;" data-index="${originalIndex}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    registrationsList.innerHTML = html;
    
    // Add event listeners for the new buttons
    document.querySelectorAll('.edit-registration-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.edit-registration-btn').getAttribute('data-index'));
            editRegistration(index);
        });
    });
    
    document.querySelectorAll('.delete-registration-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.delete-registration-btn').getAttribute('data-index'));
            deleteRegistration(index);
        });
    });
}

// Edit registration function
function editRegistration(index) {
    const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
    
    if (index < 0 || index >= registrations.length) {
        showStatusMessage('Registration not found!', 'error');
        return;
    }
    
    const registration = registrations[index];
    
    // Create edit modal
    const editModal = document.createElement('div');
    editModal.className = 'modal';
    editModal.id = 'editRegistrationModal';
    editModal.style.display = 'flex';
    editModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close-edit-modal" style="float: right; font-size: 1.5rem; cursor: pointer; color: #777;">&times;</span>
            <h3><i class="fas fa-edit"></i> Edit Registration</h3>
            <form id="editRegistrationForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="editFirstName">First Name</label>
                        <input type="text" id="editFirstName" class="form-control" value="${registration.firstName}" required>
                    </div>
                    <div class="form-group">
                        <label for="editLastName">Last Name</label>
                        <input type="text" id="editLastName" class="form-control" value="${registration.lastName}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="editEmail">Email Address</label>
                    <input type="email" id="editEmail" class="form-control" value="${registration.email}" required>
                </div>
                <div class="form-group">
                    <label for="editStudentId">Student ID</label>
                    <input type="text" id="editStudentId" class="form-control" value="${registration.studentId}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editDepartment">Department</label>
                        <select id="editDepartment" class="form-control" required>
                            <option value="">Select department</option>
                            <option value="Computer Science" ${registration.department === 'Computer Science' ? 'selected' : ''}>Computer Science</option>
                            <option value="AIML" ${registration.department === 'AIML' ? 'selected' : ''}>AIML</option>
                            <option value="ISE" ${registration.department === 'ISE' ? 'selected' : ''}>ISE</option>
                            <option value="EEE" ${registration.department === 'EEE' ? 'selected' : ''}>EEE</option>
                            <option value="EC" ${registration.department === 'EC' ? 'selected' : ''}>EC</option>
                            <option value="MECH" ${registration.department === 'MECH' ? 'selected' : ''}>MECH</option>
                            <option value="CHEMICAL" ${registration.department === 'CHEMICAL' ? 'selected' : ''}>CHEMICAL</option>
                            <option value="CIVIL" ${registration.department === 'CIVIL' ? 'selected' : ''}>CIVIL</option>
                            <option value="MBA" ${registration.department === 'MBA' ? 'selected' : ''}>MBA</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editYear">Year</label>
                        <select id="editYear" class="form-control" required>
                            <option value="">Select year</option>
                            <option value="1" ${registration.year === '1' ? 'selected' : ''}>1</option>
                            <option value="2" ${registration.year === '2' ? 'selected' : ''}>2</option>
                            <option value="3" ${registration.year === '3' ? 'selected' : ''}>3</option>
                            <option value="4" ${registration.year === '4' ? 'selected' : ''}>4</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="editPhone">Phone Number</label>
                    <input type="tel" id="editPhone" class="form-control" value="${registration.phone}" required>
                </div>
                <div class="form-group">
                    <label for="editEvent">Event</label>
                    <select id="editEvent" class="form-control" required>
                        <option value="">Select event</option>
                        <optgroup label="Cultural Events">
                            <option value="Cultural Fest 2023" ${registration.eventName === 'Cultural Fest 2023' ? 'selected' : ''}>Cultural Fest 2023</option>
                            <option value="Battle of Bands" ${registration.eventName === 'Battle of Bands' ? 'selected' : ''}>Battle of Bands</option>
                            <option value="Drama Night" ${registration.eventName === 'Drama Night' ? 'selected' : ''}>Drama Night</option>
                        </optgroup>
                        <optgroup label="Technical Events">
                            <option value="Hackathon 2023" ${registration.eventName === 'Hackathon 2023' ? 'selected' : ''}>Hackathon 2023</option>
                            <option value="AI Workshop" ${registration.eventName === 'AI Workshop' ? 'selected' : ''}>AI Workshop</option>
                            <option value="Tech Symposium" ${registration.eventName === 'Tech Symposium' ? 'selected' : ''}>Tech Symposium</option>
                        </optgroup>
                        <optgroup label="Central Events">
                            <option value="Career Fair" ${registration.eventName === 'Career Fair' ? 'selected' : ''}>Career Fair</option>
                            <option value="University Foundation Day" ${registration.eventName === 'University Foundation Day' ? 'selected' : ''}>University Foundation Day</option>
                        </optgroup>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editComments">Additional Comments</label>
                    <textarea id="editComments" class="form-control" rows="4">${registration.comments || ''}</textarea>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button type="submit" class="btn btn-success" style="flex: 1;">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                    <button type="button" class="btn btn-danger" style="flex: 1;" id="cancelEditBtn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
                <input type="hidden" id="editRegistrationIndex" value="${index}">
            </form>
        </div>
    `;
    
    document.body.appendChild(editModal);
    
    // Close modal events
    editModal.querySelector('.close-edit-modal').addEventListener('click', () => {
        editModal.remove();
    });
    
    editModal.querySelector('#cancelEditBtn').addEventListener('click', () => {
        editModal.remove();
    });
    
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.remove();
        }
    });
    
    // Form submission
    editModal.querySelector('#editRegistrationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveEditedRegistration(index);
        editModal.remove();
    });
}

// Save edited registration
function saveEditedRegistration(index) {
    const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
    
    if (index < 0 || index >= registrations.length) {
        showStatusMessage('Registration not found!', 'error');
        return;
    }
    
    // Get updated values
    const updatedRegistration = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        studentId: document.getElementById('editStudentId').value,
        department: document.getElementById('editDepartment').value,
        year: document.getElementById('editYear').value,
        phone: document.getElementById('editPhone').value,
        eventName: document.getElementById('editEvent').value,
        comments: document.getElementById('editComments').value,
        timestamp: registrations[index].timestamp // Keep original timestamp
    };
    
    // Update registration
    registrations[index] = updatedRegistration;
    localStorage.setItem('eventRegistrations', JSON.stringify(registrations));
    
    // Update UI
    updateRegistrationsList();
    showStatusMessage('Registration updated successfully!', 'success');
}

// Delete registration function
function deleteRegistration(index) {
    if (!confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
        return;
    }
    
    const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
    
    if (index < 0 || index >= registrations.length) {
        showStatusMessage('Registration not found!', 'error');
        return;
    }
    
    const deletedRegistration = registrations[index];
    
    // Remove registration
    registrations.splice(index, 1);
    localStorage.setItem('eventRegistrations', JSON.stringify(registrations));
    
    // Update UI
    updateRegistrationsList();
    showStatusMessage(`Registration for ${deletedRegistration.firstName} ${deletedRegistration.lastName} deleted successfully!`, 'success');
}

// Make updateRegistrationsList available globally
window.updateRegistrationsList = updateRegistrationsList;