# Productive YouTube Chrome Extension

## 🎯 Overview
This Chrome extension helps you stay focused while using YouTube by hiding distracting recommendation content from the homepage and other areas of the site.

## 🔧 What Was Fixed

The original extension wasn't working because it likely had issues with:

1. **Incomplete CSS Selectors**: The extension now targets all the current YouTube DOM elements that contain recommendations:
   - `ytd-rich-grid-renderer` - Main homepage recommendation grid
   - `ytd-rich-section-renderer` - Recommendation sections
   - `ytd-rich-shelf-renderer` - Various recommendation shelves
   - `ytd-reel-shelf-renderer` - YouTube Shorts recommendations
   - And many more specific selectors

2. **Missing DOM Monitoring**: YouTube is a single-page application that loads content dynamically. The extension now includes:
   - `MutationObserver` to detect when new content is loaded
   - Proper handling of YouTube's navigation system
   - Debounced re-application of hiding rules

3. **CSS Specificity Issues**: Added `!important` declarations and multiple CSS approaches:
   - Inline style overrides
   - CSS file rules with high specificity
   - JavaScript-based hiding as backup

4. **Timing Issues**: The extension now:
   - Runs at `document_start` for early intervention
   - Has multiple initialization points (DOMContentLoaded, window load)
   - Includes delayed execution to catch late-loading content

## ✨ Features

- **Hide Homepage Recommendations**: Removes all video recommendations from YouTube's homepage
- **Hide Sidebar Recommendations**: Removes suggested videos while watching content
- **Hide End Screen Suggestions**: Removes video suggestions at the end of videos
- **Optional Comment Hiding**: Can hide comment sections if desired
- **User-Friendly Popup**: Easy toggle controls for each feature
- **Persistent Settings**: Your preferences are saved and synced across devices

## 📥 Installation

1. **Download the extension files**:
   - `manifest.json`
   - `content.js`
   - `styles.css`
   - `popup.html`
   - `popup.js`

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the folder containing the extension files

3. **Activate**:
   - The extension will automatically start working on YouTube
   - Click the extension icon to access settings

## 🎮 Usage

### Automatic Operation
- The extension works automatically when you visit YouTube
- Recommendations are hidden by default on the homepage and sidebar

### Manual Controls
- Click the extension icon in your toolbar
- Use the toggle switches to enable/disable specific features:
  - **Hide Recommendations**: Homepage video grid
  - **Hide Sidebar**: Related videos while watching
  - **Hide End Screens**: Video end suggestions
  - **Hide Comments**: Comment sections (optional)

### Keyboard Shortcuts (in popup)
- `1` - Toggle homepage recommendations
- `2` - Toggle sidebar recommendations
- `3` - Toggle end screen hiding
- `4` - Toggle comment hiding
- `Ctrl/Cmd + R` - Refresh current tab

## 🛠️ Technical Details

### How It Works
1. **CSS Injection**: Styles are injected to immediately hide known recommendation elements
2. **DOM Monitoring**: JavaScript monitors for dynamically loaded content
3. **Multi-layered Approach**: Combines CSS and JavaScript for maximum effectiveness
4. **Persistent Configuration**: Settings are saved using Chrome's storage API

### Targeted Elements
The extension targets these specific YouTube elements:
- Main recommendation grids and shelves
- Sidebar suggestion containers
- End screen overlays
- Shorts recommendation shelves
- Related video sections
- Promotional content areas

### Performance
- Lightweight: Minimal impact on page loading
- Efficient: Uses CSS for primary hiding with JavaScript backup
- Optimized: Debounced re-application prevents excessive operations

## 🐛 Troubleshooting

### Extension Not Working?
1. **Refresh the page**: Click the refresh button in the extension popup
2. **Check permissions**: Ensure the extension has permission to access YouTube
3. **Reload extension**: Go to `chrome://extensions/` and reload the extension
4. **Clear cache**: Clear your browser cache and cookies for YouTube

### Still Seeing Recommendations?
1. **New YouTube Layout**: YouTube occasionally updates their layout. The extension may need updates for new elements
2. **Partial Loading**: Some content might load after the extension runs. Try refreshing the page
3. **Cached Content**: Clear your YouTube cache or try incognito mode

### Settings Not Saving?
1. **Storage Permission**: Ensure the extension has storage permission
2. **Sync Issues**: Settings sync across devices but may take a few minutes

## 🔄 Updates

This extension is designed to be easily updateable when YouTube changes their layout. The selector arrays in `content.js` can be updated to target new elements as they appear.

## 📝 License

This extension is provided as-is for productivity purposes. Feel free to modify and improve it for your needs.

## 🤝 Contributing

If you find new YouTube elements that should be hidden or improvements to the code, you can:
1. Update the `SELECTORS` object in `content.js`
2. Add new CSS rules in `styles.css`
3. Test thoroughly on different YouTube pages

---

**Note**: This extension is not affiliated with YouTube or Google. It's a productivity tool designed to help users focus while using the platform.