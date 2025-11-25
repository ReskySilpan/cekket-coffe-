// script.js
// Smooth scrolling untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe semua elemen dengan class fade-in
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Header scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
});

// Mobile sidebar functionality
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');
const overlay = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Notification functionality
const notification = document.getElementById('notification');
const notificationClose = document.getElementById('notification-close');

// Tampilkan notifikasi setelah 1 detik
setTimeout(() => {
    notification.classList.add('show');
}, 1000);

notificationClose.addEventListener('click', () => {
    notification.classList.remove('show');
});

// Auto-hide notifikasi setelah 5 detik
setTimeout(() => {
    if (notification.classList.contains('show')) {
        notification.classList.remove('show');
    }
}, 5000);

// Animasi untuk menu item saat hover
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Animasi untuk tombol
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Animasi scroll untuk hero section
const heroScroll = document.querySelector('.hero-scroll');
heroScroll.addEventListener('click', () => {
    document.querySelector('#menu').scrollIntoView({
        behavior: 'smooth'
    });
});

// Parallax effect untuk hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Cart functionality
let cart = [];
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const emptyCart = document.getElementById('empty-cart');
const sidebarCartBtn = document.getElementById('sidebar-cart-btn');

// Toggle cart sidebar
cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

sidebarCartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    sidebar.classList.remove('open');
});

cartClose.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = parseInt(this.getAttribute('data-price'));
        
        addToCart(name, price);
        
        // Show success feedback
        const originalText = this.textContent;
        this.textContent = '✓ Ditambahkan!';
        this.style.background = 'var(--light-brown)';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
        }, 1500);
    });
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    // Update cart count
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cartCount;
    });
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.appendChild(emptyCart);
        emptyCart.style.display = 'block';
    } else {
        emptyCart.style.display = 'none';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${getItemImage(item.name)}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" data-name="${item.name}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-name="${item.name}">+</button>
                    <button class="remove-item" data-name="${item.name}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners to new buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                updateQuantity(this.getAttribute('data-name'), -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                updateQuantity(this.getAttribute('data-name'), 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                removeFromCart(this.getAttribute('data-name'));
            });
        });
    }
    
    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = `Rp ${total.toLocaleString()}`;
}

function getItemImage(name) {
    const imageMap = {
        'Choco Milk Coffee': 'choco-milk.jpg',
        'Matchalatte': 'matchalatte.jpg',
        'Milo Caffe': 'milo-caffe.jpg'
    };
    
    return imageMap[name] || 'coffe.jpg';
}

// Checkout functionality
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang masih kosong!');
        return;
    }
    
    let message = 'Halo! Saya ingin memesan:\n\n';
    
    cart.forEach(item => {
        message += `• ${item.name} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: Rp ${total.toLocaleString()}\n\n`;
    message += 'Bisa tolong konfirmasi ketersediaan dan cara pembayarannya? Terima kasih!';
    
    const whatsappUrl = `https://wa.me/6285159092232?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

// Initialize cart
updateCart();
