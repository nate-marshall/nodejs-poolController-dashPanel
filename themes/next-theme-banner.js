/* Next Theme Discovery Banner Script */

(function() {
    'use strict';

    const NextThemeBanner = {
        bannerElement: null,
        dismissedKey: 'nextThemeBannerDismissed',
        
        init() {
            // Don't show if already dismissed or using next theme
            if (this.isDismissed() || this.isNextThemeActive()) {
                return;
            }
            
            // Wait a bit before showing banner
            setTimeout(() => {
                this.createBanner();
            }, 3000);
        },
        
        isDismissed() {
            try {
                return localStorage.getItem(this.dismissedKey) === 'true';
            } catch (e) {
                return false;
            }
        },
        
        isNextThemeActive() {
            try {
                const theme = localStorage.getItem('dashTheme');
                return theme === 'next';
            } catch (e) {
                return false;
            }
        },
        
        createBanner() {
            if (this.bannerElement) return;
            
            const banner = document.createElement('div');
            banner.className = 'next-theme-banner';
            banner.innerHTML = `
                <button class="next-theme-banner-close" title="Dismiss">×</button>
                <div class="next-theme-banner-title">Try Next-Gen UI</div>
                <div class="next-theme-banner-text">
                    Experience our modern, accessible dashboard with improved mobile support and enhanced visuals.
                </div>
                <button class="next-theme-banner-button">Switch to Next Theme</button>
            `;
            
            // Add event listeners
            const closeBtn = banner.querySelector('.next-theme-banner-close');
            const switchBtn = banner.querySelector('.next-theme-banner-button');
            
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dismissBanner();
            });
            
            switchBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.switchToNextTheme();
            });
            
            banner.addEventListener('click', () => {
                this.switchToNextTheme();
            });
            
            document.body.appendChild(banner);
            this.bannerElement = banner;
        },
        
        dismissBanner() {
            if (this.bannerElement) {
                this.bannerElement.classList.add('dismissed');
                setTimeout(() => {
                    if (this.bannerElement && this.bannerElement.parentNode) {
                        this.bannerElement.parentNode.removeChild(this.bannerElement);
                    }
                    this.bannerElement = null;
                }, 300);
            }
            
            try {
                localStorage.setItem(this.dismissedKey, 'true');
            } catch (e) {
                console.warn('Could not save banner dismissal state');
            }
        },
        
        switchToNextTheme() {
            try {
                // Save theme preference
                localStorage.setItem('dashTheme', 'next');
                
                // Update theme link
                const themeLink = document.getElementById('cssref_theme');
                if (themeLink) {
                    themeLink.href = 'themes/next/theme.css';
                    themeLink.setAttribute('data-theme', 'next');
                } else {
                    // Create theme link if it doesn't exist
                    const link = document.createElement('link');
                    link.id = 'cssref_theme';
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = 'themes/next/theme.css';
                    link.setAttribute('data-theme', 'next');
                    document.head.appendChild(link);
                }
                
                // Dismiss banner
                this.dismissBanner();
                
                // Show success message
                this.showSuccessMessage();
                
            } catch (e) {
                console.error('Failed to switch to next theme:', e);
                alert('Failed to switch theme. Please try using the configuration panel.');
            }
        },
        
        showSuccessMessage() {
            const message = document.createElement('div');
            message.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
                font-size: 0.875rem;
                font-weight: 500;
                z-index: 1001;
                animation: slideInDown 0.3s ease-out;
            `;
            message.textContent = 'Next Theme activated! ✨';
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.style.animation = 'slideOutUp 0.3s ease-out';
                setTimeout(() => {
                    if (message.parentNode) {
                        message.parentNode.removeChild(message);
                    }
                }, 300);
            }, 3000);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => NextThemeBanner.init());
    } else {
        NextThemeBanner.init();
    }

    // Expose for manual control
    window.NextThemeBanner = NextThemeBanner;

})();