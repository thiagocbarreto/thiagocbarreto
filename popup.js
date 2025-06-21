// Popup script for Productive YouTube extension

document.addEventListener('DOMContentLoaded', function() {
    // Default configuration
    const defaultConfig = {
        hideRecommendations: true,
        hideSidebar: true,
        hideEndScreens: true,
        hideComments: false
    };
    
    let currentConfig = { ...defaultConfig };
    
    // DOM elements
    const toggles = {
        hideRecommendations: document.getElementById('hideRecommendations'),
        hideSidebar: document.getElementById('hideSidebar'),
        hideEndScreens: document.getElementById('hideEndScreens'),
        hideComments: document.getElementById('hideComments')
    };
    
    const refreshBtn = document.getElementById('refreshPage');
    const statusDiv = document.getElementById('status');
    
    // Load saved configuration
    function loadConfig() {
        chrome.storage.sync.get(['productiveYouTubeConfig'], function(result) {
            if (result.productiveYouTubeConfig) {
                currentConfig = { ...defaultConfig, ...result.productiveYouTubeConfig };
            }
            updateUI();
        });
    }
    
    // Save configuration
    function saveConfig() {
        chrome.storage.sync.set({
            productiveYouTubeConfig: currentConfig
        }, function() {
            console.log('Configuration saved:', currentConfig);
            updateStatus('Settings saved successfully!');
            
            // Send message to content script
            sendMessageToContentScript();
        });
    }
    
    // Update UI based on current configuration
    function updateUI() {
        Object.keys(toggles).forEach(key => {
            const toggle = toggles[key];
            const isActive = currentConfig[key];
            
            if (isActive) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }
        });
        
        updateStatus();
    }
    
    // Update status message
    function updateStatus(message = null) {
        if (message) {
            statusDiv.textContent = message;
            setTimeout(() => {
                updateStatus();
            }, 2000);
            return;
        }
        
        const activeFeatures = Object.keys(currentConfig).filter(key => currentConfig[key]);
        const count = activeFeatures.length;
        
        if (count === 0) {
            statusDiv.textContent = 'All features disabled';
        } else {
            statusDiv.textContent = `${count} distraction${count === 1 ? '' : 's'} blocked`;
        }
    }
    
    // Send message to content script
    function sendMessageToContentScript() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateConfig',
                    config: currentConfig
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.log('Could not send message to content script:', chrome.runtime.lastError.message);
                        updateStatus('Refresh the page to apply changes');
                    } else if (response && response.success) {
                        updateStatus('Changes applied successfully!');
                    }
                });
            } else {
                updateStatus('Navigate to YouTube to use this extension');
            }
        });
    }
    
    // Add click listeners to toggles
    Object.keys(toggles).forEach(key => {
        const toggle = toggles[key];
        
        toggle.addEventListener('click', function() {
            currentConfig[key] = !currentConfig[key];
            updateUI();
            saveConfig();
        });
    });
    
    // Refresh button functionality
    refreshBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.reload(tabs[0].id);
                updateStatus('Page refreshed!');
                
                // Close popup after refresh
                setTimeout(() => {
                    window.close();
                }, 1000);
            }
        });
    });
    
    // Check if we're on a YouTube page
    function checkYouTubePage() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url) {
                if (tabs[0].url.includes('youtube.com')) {
                    // Try to get config from content script
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'getConfig'
                    }, function(response) {
                        if (response && response.config) {
                            currentConfig = { ...defaultConfig, ...response.config };
                            updateUI();
                        }
                    });
                } else {
                    updateStatus('This extension only works on YouTube');
                }
            }
        });
    }
    
    // Initialize popup
    function initialize() {
        loadConfig();
        checkYouTubePage();
        
        // Update status periodically
        setInterval(updateStatus, 5000);
    }
    
    // Start initialization
    initialize();
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            refreshBtn.click();
        }
        
        // Toggle features with number keys
        const keyMap = {
            '1': 'hideRecommendations',
            '2': 'hideSidebar',
            '3': 'hideEndScreens',
            '4': 'hideComments'
        };
        
        if (keyMap[e.key]) {
            e.preventDefault();
            toggles[keyMap[e.key]].click();
        }
    });
    
    // Add tooltips or help text
    const helpText = {
        hideRecommendations: 'Removes all video recommendations from YouTube homepage',
        hideSidebar: 'Hides suggested videos in the sidebar while watching',
        hideEndScreens: 'Removes end screen video suggestions',
        hideComments: 'Hides comment sections (may affect engagement)'
    };
    
    // Add hover effects for better UX
    Object.keys(toggles).forEach(key => {
        const toggle = toggles[key];
        const settingItem = toggle.closest('.setting-item');
        
        settingItem.addEventListener('mouseenter', function() {
            toggle.style.transform = 'scale(1.05)';
        });
        
        settingItem.addEventListener('mouseleave', function() {
            toggle.style.transform = 'scale(1)';
        });
    });
});