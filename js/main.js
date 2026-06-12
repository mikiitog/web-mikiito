const menuItems = document.querySelectorAll('.sidebar-index li');
const sections = document.querySelectorAll('.article-content section');

// 0. CARGAR PREFERENCIA DE TEMA AL INICIAR
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme-preference');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
}

function applyTheme(theme) {
    const html = document.documentElement;
    const toggleButton = document.getElementById('toggle-theme');
    
    if (theme === 'dark') {
        html.classList.add('dark-mode');
        toggleButton.setAttribute('aria-pressed', 'true');
    } else {
        html.classList.remove('dark-mode');
        toggleButton.setAttribute('aria-pressed', 'false');
    }
    localStorage.setItem('theme-preference', theme);
}

// Cargar tema al iniciar
loadThemePreference();

// 1. FUNCIÓN DE SCROLL SUAVE MANUAL
document.querySelectorAll('.sidebar-index a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - 20;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 600;
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
            history.pushState(null, null, targetId);
        }
    });
});

// 2. DETECTOR DE SECCIÓN ACTIVA AL HACER SCROLL (IntersectionObserver)
const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', 
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const activeId = entry.target.getAttribute('id');
            
            menuItems.forEach(item => item.classList.remove('active'));
            
            const activeLink = document.querySelector(`.sidebar-index a[href="#${activeId}"]`);
            if (activeLink) {
                activeLink.parentElement.classList.add('active');
            }
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

const toggleAsideButton = document.getElementById('toggle-aside');
const toggleThemeButton = document.getElementById('toggle-theme');
const homeButton = document.getElementById('home-button');
const container = document.querySelector('.container');

toggleAsideButton.addEventListener('click', () => {
    const hidden = container.classList.toggle('aside-hidden');
    toggleAsideButton.setAttribute('aria-pressed', hidden);
});

toggleThemeButton.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark-mode');
    applyTheme(isDark ? 'light' : 'dark');
});

homeButton.addEventListener('click', () => {
    window.location.href = './';
});

// Scroll to top con animación suave
const scrollTopButton = document.getElementById('scroll-top');
function scrollToSmooth(targetPosition, duration = 600) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let start = null;

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}

if (scrollTopButton) {
    scrollTopButton.addEventListener('click', () => {
        scrollToSmooth(0, 600);
    });
}