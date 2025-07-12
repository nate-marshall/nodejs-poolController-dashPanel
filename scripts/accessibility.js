/* Pool Controller Dashboard - Accessibility Enhancement Module */
/* Provides comprehensive accessibility features and WCAG 2.1 AA compliance */

(function($) {
    'use strict';

    // Accessibility namespace
    window.PoolAccessibility = {
        // Focus management
        focusManager: {
            // Store the last focused element before modal opens
            lastFocusedElement: null,
            
            // Focus trap for modals
            trapFocus: function(container) {
                const focusableElements = container.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="spinbutton"]');
                const firstElement = focusableElements.first();
                const lastElement = focusableElements.last();
                
                container.on('keydown.focustrap', function(e) {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === firstElement[0]) {
                                e.preventDefault();
                                lastElement.focus();
                            }
                        } else {
                            if (document.activeElement === lastElement[0]) {
                                e.preventDefault();
                                firstElement.focus();
                            }
                        }
                    }
                    
                    // Escape key closes modal
                    if (e.key === 'Escape') {
                        this.releaseFocus(container);
                    }
                }.bind(this));
                
                // Focus first element
                firstElement.focus();
            },
            
            // Release focus trap
            releaseFocus: function(container) {
                container.off('keydown.focustrap');
                if (this.lastFocusedElement) {
                    this.lastFocusedElement.focus();
                    this.lastFocusedElement = null;
                }
            },
            
            // Store current focus before opening modal
            storeFocus: function() {
                this.lastFocusedElement = document.activeElement;
            }
        },
        
        // Keyboard navigation enhancement
        keyboardNav: {
            init: function() {
                // Detect keyboard usage
                $(document).on('keydown', function(e) {
                    if (e.key === 'Tab') {
                        $('body').addClass('keyboard-navigation');
                    }
                });
                
                $(document).on('mousedown', function() {
                    $('body').removeClass('keyboard-navigation');
                });
                
                // Enhanced arrow key navigation for spinners
                this.initSpinnerNavigation();
                
                // Enhanced button activation
                this.initButtonActivation();
            },
            
            initSpinnerNavigation: function() {
                $(document).on('keydown', '.picSpinner-value', function(e) {
                    const spinner = $(this).closest('.picValueSpinner, .picTimeSpinner');
                    if (!spinner.length) return;
                    
                    switch(e.key) {
                        case 'ArrowUp':
                            e.preventDefault();
                            if (spinner[0].increment) {
                                spinner[0].increment();
                                PoolAccessibility.announcer.announce('Value increased');
                            }
                            break;
                        case 'ArrowDown':
                            e.preventDefault();
                            if (spinner[0].decrement) {
                                spinner[0].decrement();
                                PoolAccessibility.announcer.announce('Value decreased');
                            }
                            break;
                        case 'Home':
                            e.preventDefault();
                            if (spinner[0].minVal && spinner[0].val) {
                                spinner[0].val(spinner[0].minVal());
                                PoolAccessibility.announcer.announce('Set to minimum value');
                            }
                            break;
                        case 'End':
                            e.preventDefault();
                            if (spinner[0].maxVal && spinner[0].val) {
                                spinner[0].val(spinner[0].maxVal());
                                PoolAccessibility.announcer.announce('Set to maximum value');
                            }
                            break;
                    }
                });
            },
            
            initButtonActivation: function() {
                $(document).on('keydown', '[role="button"]', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (!$(this).hasClass('disabled')) {
                            $(this).trigger('click');
                        }
                    }
                });
            }
        },
        
        // Screen reader announcements
        announcer: {
            container: null,
            
            init: function() {
                // Create announcement container
                this.container = $('<div>')
                    .attr('aria-live', 'polite')
                    .attr('aria-atomic', 'true')
                    .addClass('sr-only')
                    .addClass('status-announcement')
                    .appendTo('body');
            },
            
            announce: function(message, priority = 'polite') {
                if (!this.container) this.init();
                
                this.container.attr('aria-live', priority);
                this.container.text(message);
                
                // Clear after announcement
                setTimeout(() => {
                    this.container.empty();
                }, 1000);
            },
            
            announceError: function(message) {
                this.announce(message, 'assertive');
            }
        },
        
        // Form validation enhancement
        validation: {
            init: function() {
                // Enhanced validation for all form fields
                $(document).on('blur', '.picInputField-value, .picSpinner-value', function() {
                    const field = $(this).closest('.picInputField, .picValueSpinner');
                    if (field.length && field[0].validateField) {
                        field[0].validateField();
                    }
                });
                
                // Real-time validation feedback
                $(document).on('input', '.picInputField-value', function() {
                    const field = $(this).closest('.picInputField');
                    if (field.hasClass('has-error')) {
                        // Clear error on input if field was previously invalid
                        if (field[0].clearError) {
                            field[0].clearError();
                        }
                    }
                });
            },
            
            validateForm: function(container) {
                let isValid = true;
                const errors = [];
                
                container.find('.picInputField, .picValueSpinner').each(function() {
                    if (this.validateField && !this.validateField()) {
                        isValid = false;
                        const label = $(this).find('label').text() || 'Field';
                        errors.push(label);
                    }
                });
                
                if (!isValid) {
                    const errorMessage = `Please correct the following fields: ${errors.join(', ')}`;
                    PoolAccessibility.announcer.announceError(errorMessage);
                }
                
                return isValid;
            }
        },
        
        // Status indicator enhancement
        statusIndicators: {
            init: function() {
                // Add text alternatives for color-only status indicators
                this.enhanceStatusDots();
                this.enhancePoolStatus();
            },
            
            enhanceStatusDots: function() {
                $('.status-dot').each(function() {
                    const $dot = $(this);
                    let statusText = '';
                    
                    if ($dot.hasClass('status-success')) statusText = 'Success';
                    else if ($dot.hasClass('status-warning')) statusText = 'Warning';
                    else if ($dot.hasClass('status-error')) statusText = 'Error';
                    else if ($dot.hasClass('status-info')) statusText = 'Information';
                    else if ($dot.hasClass('status-heating')) statusText = 'Heating';
                    else if ($dot.hasClass('status-cooling')) statusText = 'Cooling';
                    else if ($dot.hasClass('status-chemical')) statusText = 'Chemical';
                    else if ($dot.hasClass('status-filter')) statusText = 'Filter';
                    else if ($dot.hasClass('status-pump')) statusText = 'Pump';
                    else if ($dot.hasClass('status-light')) statusText = 'Light';
                    
                    if (statusText) {
                        $dot.attr('aria-label', statusText + ' status');
                        $dot.attr('role', 'img');
                        
                        // Add text for screen readers
                        if (!$dot.next('.sr-only').length) {
                            $('<span class="sr-only">' + statusText + ' status</span>').insertAfter($dot);
                        }
                    }
                });
            },
            
            enhancePoolStatus: function() {
                // Monitor for dynamic status changes
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const $target = $(mutation.target);
                            if ($target.hasClass('status-dot')) {
                                PoolAccessibility.statusIndicators.enhanceStatusDots();
                            }
                        }
                    });
                });
                
                // Observe status changes
                $('.status-dot').each(function() {
                    observer.observe(this, { attributes: true, attributeFilter: ['class'] });
                });
            }
        },
        
        // High contrast mode support
        highContrast: {
            init: function() {
                // Detect high contrast preference
                if (window.matchMedia('(prefers-contrast: high)').matches) {
                    $('body').addClass('high-contrast-mode');
                }
                
                // Listen for changes
                window.matchMedia('(prefers-contrast: high)').addEventListener('change', function(e) {
                    if (e.matches) {
                        $('body').addClass('high-contrast-mode');
                    } else {
                        $('body').removeClass('high-contrast-mode');
                    }
                });
            }
        },
        
        // Reduced motion support
        reducedMotion: {
            init: function() {
                // Detect reduced motion preference
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    $('body').addClass('reduced-motion');
                }
                
                // Listen for changes
                window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
                    if (e.matches) {
                        $('body').addClass('reduced-motion');
                    } else {
                        $('body').removeClass('reduced-motion');
                    }
                });
            }
        },
        
        // Initialize all accessibility features
        init: function() {
            $(document).ready(() => {
                this.keyboardNav.init();
                this.announcer.init();
                this.validation.init();
                this.statusIndicators.init();
                this.highContrast.init();
                this.reducedMotion.init();
                
                // Add skip link if not present
                if (!$('.skip-link').length) {
                    $('<a href="#main-content" class="skip-link">Skip to main content</a>')
                        .prependTo('body');
                }
                
                // Ensure main content has proper landmark
                if (!$('#main-content').length && !$('main').length) {
                    $('.container, .main-container, .content').first()
                        .attr('id', 'main-content')
                        .attr('role', 'main');
                }
                
                console.log('Pool Controller Accessibility features initialized');
            });
        }
    };
    
    // Auto-initialize
    PoolAccessibility.init();
    
})(jQuery);