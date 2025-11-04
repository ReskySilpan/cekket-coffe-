// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const notification = document.getElementById('notification');
const notificationClose = document.getElementById('notification-close');
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');
const overlay = document.getElementById('overlay');
const cartIcon = document.getElementById('cart-icon');
const sidebarCartBtn = document.getElementById('sidebar-cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const emptyCart = document.getElementById('empty-cart');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelectorAll('.cart-count');

// Cart Data
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2000);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 2500);
    
    // Initialize animations
    initAnimations();
    
    // Load cart from localStorage
    loadCart();
    
    // Update cart display
    updateCart();
});

// Notification Close
notificationClose.addEventListener('click', function() {
    notification.classList.remove('show');
});

// Mobile Menu Toggle
hamburger.addEventListener('click', function() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

sidebarClose.addEventListener('click', function() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

overlay.addEventListener('click', function() {
    sidebar.classList.remove('open');
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Cart Toggle
cartIcon.addEventListener('click', function(e) {
    e.preventDefault();
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

sidebarCartBtn.addEventListener('click', function(e) {
    e.preventDefault();
    sidebar.classList.remove('open');
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

cartClose.addEventListener('click', function() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Add to Cart
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const name = this.dataset.name;
        const price = parseInt(this.dataset.price);
        
        addToCart(name, price);
        
        // Show feedback
        showAddToCartFeedback(this);
    });
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }
    
    // Save to localStorage
    saveCart();
    
    // Update cart display
    updateCart();
    
    // Show notification
    showNotification(`${name} berhasil ditambahkan ke keranjang!`);
}

function showAddToCartFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Ditambahkan';
    button.style.background = '#4CAF50';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 2000);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1002;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update Cart
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.forEach(element => {
        element.textContent = totalItems;
    });
    
    // Update cart items
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.innerHTML = '';
        cartItems.appendChild(emptyCart);
    } else {
        emptyCart.style.display = 'none';
        
        let cartHTML = '';
        let totalPrice = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${getItemImage(item.name)}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rp ${item.price.toLocaleString()}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                        <button class="remove-item" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        cartTotalPrice.textContent = `Rp ${totalPrice.toLocaleString()}`;
        
        // Add event listeners to cart controls
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                decreaseQuantity(index);
            });
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                increaseQuantity(index);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                removeFromCart(index);
            });
        });
    }
}

function getItemImage(name) {
    const imageMap = {
        'Choco Milk Coffee': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        'Machalatte': 'https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        'Coffee Gula Aren': 'https://images.unsplash.com/photo-1534687941688-651ccaafbff8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    };
    
    return imageMap[name] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    
    saveCart();
    updateCart();
}

function increaseQuantity(index) {
    cart[index].quantity++;
    saveCart();
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

// Checkout
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        showNotification('Keranjang masih kosong!');
        return;
    }
    
    let message = 'Halo! Saya ingin memesan kopi dari Ceket Coffee:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `- ${item.name} (${item.quantity}x) - Rp ${itemTotal.toLocaleString()}\n`;
    });
    
    message += `\nTotal: Rp ${total.toLocaleString()}`;
    message += `\n\nSaya ingin memesan ini. Terima kasih!`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/6281287358494?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
});

// Local Storage
function saveCart() {
    localStorage.setItem('ceketCoffeeCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('ceketCoffeeCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Animations
function initAnimations() {
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeInOnScroll.observe(element);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(139, 69, 19, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, var(--primary-brown) 0%, var(--light-brown) 100%)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Add some interactive effects to menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});
