// ===================================
// Authentication System
// ===================================

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    const restrictedPages = ['dashboard.html', 'registration.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (restrictedPages.includes(currentPage) && !user) {
        showNotification('Please login to access this page', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    updateNavigation();
});

// Update navigation based on auth status
function updateNavigation() {
    const user = localStorage.getItem('currentUser');
    const navMenu = document.getElementById('navMenu');
    
    if (user && navMenu) {
        const userData = JSON.parse(user);
        
        // Update dashboard user profile if on dashboard page
        const userNameElement = document.getElementById('userName');
        const userAvatarElement = document.getElementById('userAvatar');
        
        if (userNameElement && userAvatarElement) {
            const fullName = `${userData.firstName} ${userData.lastName}`;
            userNameElement.textContent = fullName;
            userAvatarElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=4F46E5&color=fff`;
            userAvatarElement.alt = fullName;
        }
        
        console.log('User logged in:', userData.email);
    }
}

// ===================================
// Login Form Handler
// ===================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Validation
        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) {
            showNotification('Account not found. Please sign up first.', 'error');
            return;
        }
        
        if (user.password !== password) {
            showNotification('Incorrect password', 'error');
            return;
        }
        
        // Login successful
        localStorage.setItem('currentUser', JSON.stringify({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            loginTime: new Date().toISOString()
        }));
        
        showNotification('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    });
}

// ===================================
// Signup Form Handler
// ===================================
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    const passwordInput = document.getElementById('signupPassword');
    
    // Password strength checker
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.querySelector('input[name="terms"]').checked;
        
        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Password validation
        if (password.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (!terms) {
            showNotification('Please accept the terms and conditions', 'error');
            return;
        }
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            showNotification('An account with this email already exists', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            firstName,
            lastName,
            email,
            password, // In production, this should be hashed!
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showNotification('Account created successfully! Redirecting to login...', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}

// ===================================
// Password Strength Checker
// ===================================
function checkPasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let text = '';
    let color = '';
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    switch(strength) {
        case 0:
        case 1:
            text = 'Weak';
            color = '#EF4444';
            break;
        case 2:
            text = 'Fair';
            color = '#F59E0B';
            break;
        case 3:
            text = 'Good';
            color = '#3B82F6';
            break;
        case 4:
            text = 'Strong';
            color = '#10B981';
            break;
    }
    
    strengthBar.style.width = (strength * 25) + '%';
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
}

// ===================================
// Toggle Password Visibility
// ===================================
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ===================================
// Social Login Handlers
// ===================================
document.querySelectorAll('.btn-social').forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.classList.contains('btn-google') ? 'Google' : 'GitHub';
        showNotification(`${provider} authentication would be integrated here`, 'info');
    });
});

// ===================================
// Logout Function
// ===================================
function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// ===================================
// Forgot Password Handler
// ===================================
document.querySelectorAll('.forgot-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const email = prompt('Enter your email address:');
        
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                showNotification('Password reset link sent to your email', 'success');
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        }
    });
});

console.log('Authentication system loaded ✓');
