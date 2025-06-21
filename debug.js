// Debug script for Productive YouTube Extension
// Run this in the browser console on YouTube to diagnose issues

console.log('🎯 Productive YouTube Debug Script');
console.log('================================');

// Check if we're on YouTube
if (!window.location.hostname.includes('youtube.com')) {
  console.log('❌ Not on YouTube - extension only works on youtube.com');
} else {
  console.log('✅ On YouTube domain');
}

// Check page type
const isHomepage = window.location.pathname === '/' || window.location.search.includes('home');
const isWatchPage = window.location.pathname.includes('/watch');
const isSearchPage = window.location.pathname.includes('/results');
const isSubscriptionsPage = window.location.pathname.includes('/feed/subscriptions');

console.log(`Page type: ${isHomepage ? 'Homepage' : isWatchPage ? 'Watch' : isSearchPage ? 'Search' : isSubscriptionsPage ? 'Subscriptions' : 'Other'}`);

// Check for recommendation elements
const recommendationSelectors = [
  'ytd-rich-grid-renderer',
  'ytd-rich-item-renderer',
  'ytd-video-renderer',
  'ytd-rich-section-renderer',
  '#contents.ytd-rich-grid-renderer',
  'div[page-subtype="home"]',
  'ytd-browse[page-subtype="home"] #primary'
];

console.log('\n📊 Recommendation Elements Found:');
console.log('=================================');

let totalFound = 0;
recommendationSelectors.forEach(selector => {
  const elements = document.querySelectorAll(selector);
  if (elements.length > 0) {
    console.log(`${selector}: ${elements.length} elements`);
    totalFound += elements.length;
    
    // Check if they're hidden
    elements.forEach((el, index) => {
      const isHidden = window.getComputedStyle(el).display === 'none' || 
                      el.hasAttribute('data-productive-youtube-hidden');
      console.log(`  Element ${index + 1}: ${isHidden ? '✅ Hidden' : '❌ Visible'}`);
    });
  }
});

console.log(`\nTotal recommendation elements found: ${totalFound}`);

// Check if our extension message is showing
const extensionMessage = document.querySelector('#productive-youtube-message');
console.log(`\nExtension message: ${extensionMessage ? '✅ Showing' : '❌ Not found'}`);

// Check for our CSS
const stylesheets = Array.from(document.styleSheets);
let extensionCSS = false;
stylesheets.forEach(sheet => {
  try {
    if (sheet.href && sheet.href.includes('extension')) {
      extensionCSS = true;
    }
  } catch (e) {
    // Can't access cross-origin stylesheets
  }
});

console.log(`Extension CSS: ${extensionCSS ? '✅ Loaded' : '❓ Unknown (normal for content scripts)'}`);

// Test hiding function
console.log('\n🧪 Testing Hide Function:');
console.log('========================');

function testHide() {
  let hiddenCount = 0;
  recommendationSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.style.display !== 'none') {
        element.style.display = 'none';
        element.setAttribute('data-debug-hidden', 'true');
        hiddenCount++;
      }
    });
  });
  console.log(`Manually hid ${hiddenCount} elements`);
  return hiddenCount;
}

const hiddenByDebug = testHide();

// Recommendations for debugging
console.log('\n💡 Debugging Recommendations:');
console.log('============================');

if (isHomepage && totalFound === 0) {
  console.log('• No recommendation elements found - YouTube might have changed their layout');
  console.log('• Try refreshing the page or checking with different YouTube layout');
}

if (isHomepage && totalFound > 0) {
  console.log('• Recommendation elements found but may not be hidden');
  console.log('• Check if extension is properly loaded');
  console.log('• Try reloading the extension in chrome://extensions/');
}

if (!extensionMessage && isHomepage) {
  console.log('• Extension message not showing - content script may not be running');
  console.log('• Check browser console for JavaScript errors');
}

console.log('\n🔧 Quick Fixes to Try:');
console.log('=====================');
console.log('1. Hard refresh: Ctrl+F5 (Cmd+F5 on Mac)');
console.log('2. Reload extension: chrome://extensions/ → Reload button');
console.log('3. Clear cache: Settings → Privacy → Clear browsing data');
console.log('4. Disable other YouTube extensions temporarily');
console.log('5. Check if you\'re on the actual homepage (youtube.com)');

console.log('\n✅ Debug script complete!');