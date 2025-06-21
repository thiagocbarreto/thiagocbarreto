// YouTube Recommendation Hider - Content Script
// This script hides various recommendation elements on YouTube

(function() {
    'use strict';
    
    // Configuration object to store user preferences
    let config = {
        hideRecommendations: true,
        hideSidebar: true,
        hideEndScreens: true,
        hideComments: false
    };
    
    // Load configuration from Chrome storage
    function loadConfig() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get(['productiveYouTubeConfig'], function(result) {
                if (result.productiveYouTubeConfig) {
                    config = { ...config, ...result.productiveYouTubeConfig };
                }
                applyHiding();
            });
        } else {
            applyHiding();
        }
    }
    
    // Selectors for various YouTube recommendation elements
    const SELECTORS = {
        // Homepage recommendations
        homepage: [
            'ytd-rich-grid-renderer', // Main recommendation grid
            'ytd-rich-section-renderer', // Recommendation sections
            'ytd-rich-shelf-renderer', // Recommendation shelves
            '#contents.ytd-rich-grid-renderer', // Grid contents
            'ytd-two-column-browse-results-renderer #primary', // Primary content area
            '[page-subtype="home"] ytd-rich-grid-renderer',
            '[page-subtype="home"] #contents',
            '.ytd-browse[page-subtype="home"]'
        ],
        
        // Sidebar recommendations
        sidebar: [
            'ytd-watch-next-secondary-results-renderer', // Watch next sidebar
            '#secondary.ytd-watch-flexy', // Secondary content
            'ytd-compact-video-renderer', // Compact video recommendations
            'ytd-shelf-renderer', // Sidebar shelves
            '#related' // Related videos
        ],
        
        // End screen recommendations
        endScreen: [
            '.ytp-endscreen-content',
            '.ytp-ce-element',
            '.ytp-cards-teaser',
            'ytd-endscreen-element-renderer'
        ],
        
        // Comments (optional)
        comments: [
            'ytd-comments',
            '#comments',
            'ytd-comment-thread-renderer'
        ],
        
        // Additional elements that might show recommendations
        additional: [
            'ytd-reel-shelf-renderer', // Shorts shelf
            'ytd-video-secondary-info-renderer #meta-contents', // Video meta with recommendations
            'ytd-merch-shelf-renderer', // Merch shelf
            'ytd-donation-shelf-renderer' // Donation shelf
        ]
    };
    
    // Function to hide elements based on selectors
    function hideElements(selectors) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.style.display = 'none !important';
                    element.style.visibility = 'hidden !important';
                    element.setAttribute('data-productive-youtube-hidden', 'true');
                }
            });
        });
    }
    
    // Function to show elements (for toggling)
    function showElements(selectors) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector + '[data-productive-youtube-hidden="true"]');
            elements.forEach(element => {
                if (element) {
                    element.style.display = '';
                    element.style.visibility = '';
                    element.removeAttribute('data-productive-youtube-hidden');
                }
            });
        });
    }
    
    // Main function to apply hiding based on current config
    function applyHiding() {
        // Hide homepage recommendations
        if (config.hideRecommendations) {
            hideElements(SELECTORS.homepage);
            hideElements(SELECTORS.additional);
        } else {
            showElements(SELECTORS.homepage);
            showElements(SELECTORS.additional);
        }
        
        // Hide sidebar recommendations
        if (config.hideSidebar) {
            hideElements(SELECTORS.sidebar);
        } else {
            showElements(SELECTORS.sidebar);
        }
        
        // Hide end screen recommendations
        if (config.hideEndScreens) {
            hideElements(SELECTORS.endScreen);
        } else {
            showElements(SELECTORS.endScreen);
        }
        
        // Hide comments if enabled
        if (config.hideComments) {
            hideElements(SELECTORS.comments);
        } else {
            showElements(SELECTORS.comments);
        }
    }
    
    // Observer to handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        let shouldReapply = false;
        
        mutations.forEach(function(mutation) {
            // Check if new nodes were added
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node or its children match our selectors
                        const allSelectors = [
                            ...SELECTORS.homepage,
                            ...SELECTORS.sidebar,
                            ...SELECTORS.endScreen,
                            ...SELECTORS.additional
                        ];
                        
                        const matchesSelector = allSelectors.some(selector => {
                            try {
                                return node.matches && node.matches(selector) || 
                                       node.querySelector && node.querySelector(selector);
                            } catch (e) {
                                return false;
                            }
                        });
                        
                        if (matchesSelector) {
                            shouldReapply = true;
                        }
                    }
                });
            }
        });
        
        if (shouldReapply) {
            // Debounce the reapplication to avoid excessive calls
            clearTimeout(window.productiveYouTubeTimeout);
            window.productiveYouTubeTimeout = setTimeout(applyHiding, 100);
        }
    });
    
    // Start observing when DOM is ready
    function startObserving() {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }
    
    // Initialize the extension
    function initialize() {
        console.log('Productive YouTube: Initializing...');
        
        // Apply hiding immediately if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                loadConfig();
                setTimeout(startObserving, 1000);
            });
        } else {
            loadConfig();
            setTimeout(startObserving, 1000);
        }
        
        // Also apply on window load to catch any late-loading content
        window.addEventListener('load', function() {
            setTimeout(applyHiding, 2000);
        });
        
        // Handle YouTube's single-page app navigation
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(applyHiding, 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }
    
    // Listen for messages from popup
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (request.action === 'updateConfig') {
                config = { ...config, ...request.config };
                applyHiding();
                sendResponse({ success: true });
            } else if (request.action === 'getConfig') {
                sendResponse({ config: config });
            }
        });
    }
    
    // Start the extension
    initialize();
    
})();