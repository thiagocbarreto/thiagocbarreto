// Productive YouTube - Hide Homepage Recommendations
console.log('Productive YouTube: Content script loaded');

// Function to hide recommendation sections
function hideRecommendations() {
  // Only hide recommendations on homepage
  const isHomepage = window.location.pathname === '/' || 
                     window.location.pathname === '' ||
                     window.location.search.includes('home') ||
                     document.querySelector('ytd-browse[page-subtype="home"]');
  
  if (!isHomepage) {
    console.log('Productive YouTube: Not on homepage, skipping hide');
    return;
  }
  // Selectors for various recommendation sections on YouTube homepage
  const recommendationSelectors = [
    // Main homepage feed - most important selectors
    'ytd-browse[page-subtype="home"] #primary',
    'ytd-browse[page-subtype="home"] #contents',
    'ytd-two-column-browse-results-renderer #primary',
    
    // Rich grid renderer (main container for recommendations)
    'ytd-rich-grid-renderer',
    'ytd-rich-grid-renderer #contents',
    '#contents.ytd-rich-grid-renderer',
    
    // Individual recommendation items
    'ytd-rich-item-renderer',
    'ytd-rich-section-renderer',
    'ytd-video-renderer',
    
    // Shorts and trending sections
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-rich-shelf-renderer',
    'ytd-reel-shelf-renderer',
    
    // Sidebar recommendations (when watching videos)
    '#secondary #related',
    'ytd-watch-next-secondary-results-renderer',
    
    // Alternative selectors for different layouts
    '#primary #contents',
    'div[page-subtype="home"]',
    '[page-subtype="home"] ytd-rich-grid-renderer',
    
    // Catch-all selectors for homepage content
    'ytd-browse[page-subtype="home"] ytd-section-list-renderer',
    'ytd-browse[page-subtype="home"] ytd-item-section-renderer'
  ];

  let hiddenCount = 0;
  
  recommendationSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (!element.hasAttribute('data-productive-youtube-hidden')) {
        element.style.display = 'none';
        element.setAttribute('data-productive-youtube-hidden', 'true');
        hiddenCount++;
      }
    });
  });
  
  if (hiddenCount > 0) {
    console.log(`Productive YouTube: Hidden ${hiddenCount} recommendation elements`);
  }
  
  // Show a message to the user that recommendations are hidden
  showHiddenMessage();
}

// Function to show a message that recommendations are hidden
function showHiddenMessage() {
  const existingMessage = document.querySelector('#productive-youtube-message');
  if (existingMessage) return;
  
  // Only show on homepage
  const isHomepage = window.location.pathname === '/' || 
                     window.location.pathname === '' ||
                     window.location.search.includes('home') ||
                     document.querySelector('ytd-browse[page-subtype="home"]');
  
  if (!isHomepage) {
    return;
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.id = 'productive-youtube-message';
  messageDiv.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      margin: 20px;
      border-radius: 10px;
      text-align: center;
      font-family: 'Roboto', Arial, sans-serif;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    ">
      <h3 style="margin: 0 0 10px 0; font-size: 24px;">🎯 Staying Productive!</h3>
      <p style="margin: 0; font-size: 16px; opacity: 0.9;">
        YouTube recommendations are hidden to help you stay focused.
        <br>Use the search bar or visit your subscriptions to find specific content.
      </p>
    </div>
  `;
  
  // Insert the message at the top of the page content
  const pageManager = document.querySelector('ytd-page-manager');
  const primaryContent = document.querySelector('#primary') || document.querySelector('#contents');
  
  if (primaryContent) {
    primaryContent.insertBefore(messageDiv, primaryContent.firstChild);
  } else if (pageManager) {
    pageManager.insertBefore(messageDiv, pageManager.firstChild);
  }
}

// Initial hide when page loads
hideRecommendations();

// Create a MutationObserver to hide new recommendations as they load
const observer = new MutationObserver((mutations) => {
  let shouldHide = false;
  
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the added node contains recommendation content
          const hasRecommendations = node.querySelector && (
            node.querySelector('ytd-rich-item-renderer') ||
            node.querySelector('ytd-video-renderer') ||
            node.querySelector('ytd-rich-section-renderer') ||
            node.matches('ytd-rich-item-renderer') ||
            node.matches('ytd-video-renderer') ||
            node.matches('ytd-rich-section-renderer')
          );
          
          if (hasRecommendations) {
            shouldHide = true;
          }
        }
      });
    }
  });
  
  if (shouldHide) {
    setTimeout(hideRecommendations, 100);
  }
});

// Start observing when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
} else {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Re-hide recommendations when navigating (YouTube is a SPA)
let currentUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    setTimeout(hideRecommendations, 500);
  }
}, 1000);

// Hide recommendations periodically (fallback)
setInterval(hideRecommendations, 2000);