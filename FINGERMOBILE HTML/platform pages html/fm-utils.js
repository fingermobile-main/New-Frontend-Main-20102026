// FingerMobile Protocol Platform - JavaScript Utilities
// Version: 1.0
// Common utilities and helper functions

// ===== Burger Menu =====
function initBurgerMenu() {
  const burgerButton = document.getElementById('burger-menu-button');
  const burgerMenu = document.getElementById('burger-menu');
  const burgerMenuOverlay = document.getElementById('burger-menu-overlay');
  const burgerMenuClose = document.getElementById('burger-menu-close');
  
  if (!burgerButton || !burgerMenu) return;
  
  function openMenu() {
    burgerMenu.classList.add('active');
    burgerMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    burgerMenu.classList.remove('active');
    burgerMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  if (burgerButton) burgerButton.addEventListener('click', openMenu);
  if (burgerMenuClose) burgerMenuClose.addEventListener('click', closeMenu);
  if (burgerMenuOverlay) burgerMenuOverlay.addEventListener('click', closeMenu);
  
  const menuItems = burgerMenu.querySelectorAll('.burger-menu-item');
  menuItems.forEach(item => item.addEventListener('click', closeMenu));
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burgerMenu.classList.contains('active')) {
      closeMenu();
    }
  });
  
  // Swipe to close on mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  burgerMenu.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  burgerMenu.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      closeMenu();
    }
  }, { passive: true });
}

// ===== Dark Mode =====
function initDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved user preference or use system preference
  const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');
  
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    });
  }
}

// ===== Loading States =====
function showLoading() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.id = 'loading-overlay';
  // ⚠️ SECURITY: Using safe hardcoded HTML (no user input)
  overlay.innerHTML = '<div class="loading-spinner"></div>';
  document.body.appendChild(overlay);
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.remove();
}

function showSkeleton(selector, count = 3) {
  const container = document.querySelector(selector);
  if (!container) return;
  
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    // ⚠️ SECURITY: Using safe hardcoded HTML template (no user input)
    skeleton.innerHTML = `
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width: 80%"></div>
    `;
    container.appendChild(skeleton);
  }
}

function hideSkeleton(selector) {
  const container = document.querySelector(selector);
  if (container) {
    const skeletons = container.querySelectorAll('.skeleton-card');
    skeletons.forEach(s => s.remove());
  }
}

// ===== Notifications =====
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0021f3'};
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== Local Storage Helpers =====
const Storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from localStorage:', e);
      return false;
    }
  }
};

// ===== Format Helpers =====
const Format = {
  currency(amount, currency = 'FIC') {
    return `${amount.toLocaleString()} ${currency}`;
  },
  
  number(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },
  
  date(date) {
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return then.toLocaleDateString();
  },
  
  time(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};

// ===== Animation Helpers =====
function animateNumber(element, start, end, duration = 1000) {
  const range = end - start;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = start + (range * progress);
    
    element.textContent = Format.number(Math.floor(value));
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// ===== Debounce/Throttle =====
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== Service Worker Registration =====
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// ===== Initialize All =====
function initFingerMobile() {
  // Initialize burger menu
  initBurgerMenu();
  
  // Initialize dark mode
  initDarkMode();
  
  // Register service worker
  registerServiceWorker();
  
  // Add notification styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFingerMobile);
} else {
  initFingerMobile();
}

// Export for use in other scripts
window.FM = {
  initBurgerMenu,
  initDarkMode,
  showLoading,
  hideLoading,
  showSkeleton,
  hideSkeleton,
  showNotification,
  Storage,
  Format,
  animateNumber,
  debounce,
  throttle,
  registerServiceWorker
};
