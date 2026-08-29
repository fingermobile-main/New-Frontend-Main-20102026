/**
 * FingerMobile - Visitor Tracking & Analytics
 * Tracks scroll depth, dwell time, CTA clicks, and conversion events
 * Version: 1.0
 */

class VisitorTracker {
    constructor(pageId, authToken) {
        this.pageId = pageId;
        this.authToken = authToken;
        this.startTime = Date.now();
        this.lastScrollDepth = 0;
        this.maxScrollDepth = 0;
        this.totalDwellTime = 0;
        this.isVisible = false;
        this.conversionEvents = [];
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollListener();
        this.setupVisibilityListener();
        this.setupCTATracking();
        this.trackPageView();
        
        // Report data every 30 seconds
        setInterval(() => this.reportDwellTime(), 30000);
        
        // Report on page unload
        window.addEventListener('beforeunload', () => {
            this.reportFinalwellTime();
            this.reportMaxScrollDepth();
        });
    }

    /**
     * Track when content is visible in viewport
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isVisible) {
                    // Content became visible
                    this.isVisible = true;
                    this.visibleStartTime = Date.now();
                } else if (!entry.isIntersecting && this.isVisible) {
                    // Content became hidden
                    const dwellTime = Date.now() - this.visibleStartTime;
                    this.totalDwellTime += dwellTime;
                    this.isVisible = false;
                    
                    // Report if significant dwell time (>3 seconds)
                    if (dwellTime > 3000) {
                        this.reportDwellTime(dwellTime);
                    }
                }
            });
        }, { 
            threshold: [0, 0.25, 0.5, 0.75, 1.0] // Track at 25% intervals
        });

        // Observe main content area
        const contentElement = document.querySelector('main') || document.body;
        if (contentElement) {
            observer.observe(contentElement);
        }
    }

    /**
     * Track scroll depth percentage
     */
    setupScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.calculateScrollDepth();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Initial calculation
        this.calculateScrollDepth();
    }

    calculateScrollDepth() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        const scrollableHeight = documentHeight - windowHeight;
        const scrollDepth = scrollableHeight > 0 
            ? Math.round((scrollTop / scrollableHeight) * 100)
            : 100;

        this.lastScrollDepth = scrollDepth;
        
        // Update max scroll depth
        if (scrollDepth > this.maxScrollDepth) {
            this.maxScrollDepth = scrollDepth;
            
            // Report at milestones (25%, 50%, 75%, 100%)
            if (scrollDepth >= 25 && scrollDepth < 50) {
                this.reportScrollDepth(25);
            } else if (scrollDepth >= 50 && scrollDepth < 75) {
                this.reportScrollDepth(50);
            } else if (scrollDepth >= 75 && scrollDepth < 100) {
                this.reportScrollDepth(75);
            } else if (scrollDepth === 100) {
                this.reportScrollDepth(100);
            }
        }
    }

    /**
     * Track page visibility changes
     */
    setupVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page hidden - calculate dwell time
                if (this.isVisible) {
                    const dwellTime = Date.now() - this.visibleStartTime;
                    this.totalDwellTime += dwellTime;
                    this.isVisible = false;
                }
            } else {
                // Page visible again
                this.isVisible = true;
                this.visibleStartTime = Date.now();
            }
        });
    }

    /**
     * Track CTA button clicks
     */
    setupCTATracking() {
        document.addEventListener('click', (event) => {
            const ctaButton = event.target.closest('[data-cta-button]');
            
            if (ctaButton) {
                const ctaId = ctaButton.dataset.ctaId;
                const ctaType = ctaButton.dataset.ctaType;
                const ctaText = ctaButton.textContent.trim();
                
                this.trackCTAClick(ctaId, ctaType, ctaText);
                
                // Mark visitor as converted if it's a high-value action
                if (['contact_form', 'phone', 'email'].includes(ctaType)) {
                    this.trackConversion('cta_click', ctaType);
                }
            }
        });
    }

    /**
     * Track initial page view
     */
    async trackPageView() {
        try {
            await fetch(`http://localhost:3003/api/pages/${this.pageId}/track-visitor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({
                    action_taken: 'view',
                    referrer: document.referrer || null,
                    user_agent: navigator.userAgent,
                    screen_width: window.screen.width,
                    screen_height: window.screen.height
                })
            });
            
            console.log('✓ Page view tracked');
        } catch (error) {
            console.error('Failed to track page view:', error);
        }
    }

    /**
     * Report dwell time to server
     */
    async reportDwellTime(additionalTime = 0) {
        const dwellTime = additionalTime > 0 ? additionalTime : this.totalDwellTime;
        
        if (dwellTime < 1000) return; // Don't report less than 1 second
        
        try {
            await fetch(`http://localhost:3003/api/pages/${this.pageId}/update-dwell-time`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({
                    dwell_time_seconds: Math.round(dwellTime / 1000),
                    scroll_depth: this.maxScrollDepth
                })
            });
            
            console.log(`✓ Dwell time reported: ${Math.round(dwellTime / 1000)}s`);
            
            // Reset counter if not additional time
            if (additionalTime === 0) {
                this.totalDwellTime = 0;
            }
        } catch (error) {
            console.error('Failed to report dwell time:', error);
        }
    }

    /**
     * Report final dwell time before page unload
     */
    reportFinalDwellTime() {
        if (this.totalDwellTime > 0) {
            // Use sendBeacon for reliable delivery during page unload
            const data = JSON.stringify({
                dwell_time_seconds: Math.round(this.totalDwellTime / 1000),
                scroll_depth: this.maxScrollDepth
            });
            
            navigator.sendBeacon(
                `http://localhost:3003/api/pages/${this.pageId}/update-dwell-time`,
                new Blob([data], { type: 'application/json' })
            );
        }
    }

    /**
     * Report scroll depth milestone
     */
    async reportScrollDepth(depth) {
        try {
            await fetch(`http://localhost:3003/api/pages/${this.pageId}/update-dwell-time`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({
                    dwell_time_seconds: 0,
                    scroll_depth: depth
                })
            });
            
            console.log(`✓ Scroll depth reported: ${depth}%`);
        } catch (error) {
            console.error('Failed to report scroll depth:', error);
        }
    }

    /**
     * Report max scroll depth
     */
    reportMaxScrollDepth() {
        if (this.maxScrollDepth > 0) {
            this.reportScrollDepth(this.maxScrollDepth);
        }
    }

    /**
     * Track CTA button click
     */
    async trackCTAClick(ctaId, ctaType, ctaText) {
        try {
            await fetch(`http://localhost:3003/api/pages/${this.pageId}/track-cta-click`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({
                    cta_id: ctaId,
                    cta_type: ctaType,
                    cta_text: ctaText,
                    timestamp: new Date().toISOString()
                })
            });
            
            console.log(`✓ CTA click tracked: ${ctaText}`);
        } catch (error) {
            console.error('Failed to track CTA click:', error);
        }
    }

    /**
     * Track conversion event
     */
    trackConversion(conversionType, conversionValue = null) {
        const conversionEvent = {
            type: conversionType,
            value: conversionValue,
            timestamp: Date.now(),
            scroll_depth: this.maxScrollDepth,
            dwell_time: this.totalDwellTime
        };
        
        this.conversionEvents.push(conversionEvent);
        
        // Send to server
        this.sendConversionEvent(conversionEvent);
        
        console.log(`✓ Conversion tracked: ${conversionType}`);
    }

    /**
     * Send conversion event to server
     */
    async sendConversionEvent(event) {
        try {
            await fetch(`http://localhost:3003/api/pages/${this.pageId}/track-conversion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({
                    conversion_type: event.type,
                    conversion_value: event.value,
                    scroll_depth: event.scroll_depth,
                    dwell_time_seconds: Math.round(event.dwell_time / 1000)
                })
            });
        } catch (error) {
            console.error('Failed to send conversion event:', error);
        }
    }

    /**
     * Get tracking statistics
     */
    getStats() {
        return {
            totalDwellTime: Math.round(this.totalDwellTime / 1000),
            maxScrollDepth: this.maxScrollDepth,
            conversionEvents: this.conversionEvents.length,
            pageViewDuration: Math.round((Date.now() - this.startTime) / 1000)
        };
    }
}

// Auto-initialize tracker if page ID is available
document.addEventListener('DOMContentLoaded', () => {
    const pageIdElement = document.getElementById('page-id');
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('session_token');
    
    if (pageIdElement && authToken) {
        const pageId = pageIdElement.value;
        window.visitorTracker = new VisitorTracker(pageId, authToken);
        console.log('✓ Visitor tracking initialized');
    }
});

// Export for manual initialization if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisitorTracker;
}
