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

// WhatsApp order functionality
document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.textContent.includes('Pesan')) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem ? menuItem.querySelector('h3').textContent : 'Coffee Specialty';
            const message = `Halo! Saya tertarik untuk memesan ${itemName}. Bisa tolong informasikan ketersediaan dan cara pemesanannya? Terima kasih!`;
            window.open(`https://wa.me/6289682196484?text=${encodeURIComponent(message)}`, '_blank');
        });
    }
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
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

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

// Form submission handling (jika ada form di masa depan)
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle form submission here
            console.log('Form submitted');
        });
    });
});