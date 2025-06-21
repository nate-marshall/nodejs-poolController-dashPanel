/* Next Theme Dynamic Enhancement System */

(function() {
    'use strict';

    const NextTheme = {
        isActive: false,
        
        init() {
            // Check if next theme is currently selected
            this.checkThemeSelection();
            
            // Listen for theme changes
            this.setupThemeWatcher();
            
            // Apply next theme if selected
            if (this.isActive) {
                this.applyNextTheme();
            }
        },
        
        checkThemeSelection() {
            // Check localStorage for theme preference
            const savedTheme = this.getStorage('dashTheme', 'default');
            this.isActive = savedTheme === 'next';
            
            // Also check if next theme CSS is loaded
            const nextThemeLink = document.getElementById('cssref_theme');
            if (nextThemeLink && nextThemeLink.href.includes('next/theme.css')) {
                this.isActive = true;
            }
        },
        
        setupThemeWatcher() {
            // Watch for theme changes via MutationObserver
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                        const target = mutation.target;
                        if (target.id === 'cssref_theme') {
                            const isNextTheme = target.href.includes('next/theme.css');
                            if (isNextTheme && !this.isActive) {
                                this.activateNextTheme();
                            } else if (!isNextTheme && this.isActive) {
                                this.deactivateNextTheme();
                            }
                        }
                    }
                });
            });
            
            const themeLink = document.getElementById('cssref_theme');
            if (themeLink) {
                observer.observe(themeLink, { attributes: true });
            }
        },
        
        applyNextTheme() {
            this.activateNextTheme();
        },
        
        activateNextTheme() {
            console.log('Activating Next Theme...');
            this.isActive = true;
            
            // Add theme class to body
            document.body.classList.add('theme-next');
            
            // Apply semantic HTML enhancements
            this.enhanceSemanticStructure();
            
            // Apply ARIA labels and accessibility enhancements
            this.enhanceAccessibility();
            
            // Apply modern JavaScript enhancements
            this.enhanceJavaScript();
            
            // Show theme indicator
            this.showThemeIndicator();
            
            console.log('Next Theme activated successfully');
        },
        
        deactivateNextTheme() {
            console.log('Deactivating Next Theme...');
            this.isActive = false;
            
            // Remove theme class from body
            document.body.classList.remove('theme-next');
            
            // Restore original structure (if needed)
            this.restoreOriginalStructure();
            
            // Hide theme indicator
            this.hideThemeIndicator();
            
            console.log('Next Theme deactivated');
        },
        
        enhanceSemanticStructure() {
            // Add semantic roles and structure while preserving existing classes
            const dashOuter = document.querySelector('.dashOuter, .picDashboard');
            if (dashOuter && !dashOuter.hasAttribute('role')) {
                dashOuter.setAttribute('role', 'application');
                dashOuter.setAttribute('aria-label', 'Pool Controller Dashboard');
            }
            
            // Enhance header semantics
            const header = document.querySelector('.picHeader');
            if (header && header.tagName !== 'HEADER') {
                header.setAttribute('role', 'banner');
            }
            
            // Enhance main content area
            const dashContainer = document.querySelector('.dashContainer');
            if (dashContainer && dashContainer.tagName !== 'MAIN') {
                dashContainer.setAttribute('role', 'main');
                dashContainer.setAttribute('aria-label', 'Dashboard Controls');
            }
            
            // Enhance config container
            const configContainer = document.querySelector('.configContainer');
            if (configContainer && configContainer.tagName !== 'ASIDE') {
                configContainer.setAttribute('role', 'complementary');
                configContainer.setAttribute('aria-label', 'Configuration Panel');
            }
            
            // Add section roles to control panels
            const controlPanels = document.querySelectorAll('.control-panel');
            controlPanels.forEach((panel, index) => {
                if (!panel.hasAttribute('role')) {
                    panel.setAttribute('role', 'region');
                    
                    // Try to determine panel type from classes
                    let panelType = 'Control Panel';
                    if (panel.classList.contains('picBodies')) panelType = 'Pool Bodies';
                    else if (panel.classList.contains('picChemistry')) panelType = 'Chemistry Control';
                    else if (panel.classList.contains('picPumps')) panelType = 'Pump Control';
                    else if (panel.classList.contains('picCircuits')) panelType = 'Circuit Control';
                    else if (panel.classList.contains('picLights')) panelType = 'Light Control';
                    else if (panel.classList.contains('picSchedules')) panelType = 'Schedules';
                    else if (panel.classList.contains('picFilters')) panelType = 'Filter Control';
                    
                    panel.setAttribute('aria-label', panelType);
                }
            });
        },
        
        enhanceAccessibility() {
            // Add skip navigation if not present
            if (!document.querySelector('.skip-link')) {
                const skipLink = document.createElement('a');
                skipLink.href = '#main-content';
                skipLink.className = 'skip-link';
                skipLink.textContent = 'Skip to main content';
                skipLink.style.cssText = `
                    position: absolute;
                    top: -40px;
                    left: 6px;
                    background: var(--primary-color, #2563eb);
                    color: white;
                    padding: 8px;
                    text-decoration: none;
                    border-radius: 4px;
                    z-index: 1000;
                    transition: top 0.2s ease;
                `;
                skipLink.addEventListener('focus', () => {
                    skipLink.style.top = '6px';
                });
                skipLink.addEventListener('blur', () => {
                    skipLink.style.top = '-40px';
                });
                document.body.insertBefore(skipLink, document.body.firstChild);
            }
            
            // Add main content ID for skip link
            const mainContent = document.querySelector('.dashContainer');
            if (mainContent && !mainContent.id) {
                mainContent.id = 'main-content';
            }
            
            // Enhance keyboard navigation
            this.setupKeyboardNavigation();
        },
        
        setupKeyboardNavigation() {
            // Track keyboard usage for enhanced focus styles
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });
            
            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        },
        
        enhanceJavaScript() {
            // Modern JavaScript enhancements for next theme
            if (window.jQuery) {
                // Enhance jQuery widgets with modern features
                this.enhanceWidgets();
            }
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Enhanced error handling
            this.setupErrorHandling();
        },
        
        enhanceWidgets() {
            // Add loading states to widgets
            $('.control-panel').each(function() {
                const $panel = $(this);
                if (!$panel.data('next-enhanced')) {
                    $panel.data('next-enhanced', true);
                    
                    // Add loading state capability
                    $panel[0].setLoading = function(loading) {
                        $panel.toggleClass('loading', loading);
                    };
                    
                    // Add modern transition effects
                    $panel.on('mouseenter', function() {
                        if (!$(this).hasClass('loading')) {
                            $(this).addClass('hover-enhanced');
                        }
                    }).on('mouseleave', function() {
                        $(this).removeClass('hover-enhanced');
                    });
                }
            });
        },
        
        setupPerformanceMonitoring() {
            if ('performance' in window && performance.timing) {
                setTimeout(() => {
                    const timing = performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    console.log(`Next Theme: Page load time: ${loadTime}ms`);
                }, 100);
            }
        },
        
        setupErrorHandling() {
            // Enhanced error handling for next theme
            window.addEventListener('error', (event) => {
                console.warn('Next Theme: JavaScript error:', event.error);
            });
            
            window.addEventListener('unhandledrejection', (event) => {
                console.warn('Next Theme: Unhandled promise rejection:', event.reason);
            });
        },
        
        showThemeIndicator() {
            // Theme indicator is handled by CSS ::before pseudo-element
            // Could add additional UI elements here if needed
        },
        
        hideThemeIndicator() {
            // Remove any custom theme indicators
            const indicators = document.querySelectorAll('.next-theme-indicator');
            indicators.forEach(indicator => indicator.remove());
        },
        
        restoreOriginalStructure() {
            // Remove any dynamic enhancements that might conflict
            // Most styling is handled by CSS, so mainly cleanup dynamic additions
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.remove();
            }
        },
        
        getStorage(key, defaultValue) {
            try {
                const value = localStorage.getItem(key);
                return value !== null ? value : defaultValue;
            } catch (e) {
                console.warn('localStorage not available:', e);
                return defaultValue;
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => NextTheme.init());
    } else {
        NextTheme.init();
    }

    // Expose for manual control if needed
    window.NextTheme = NextTheme;

})();