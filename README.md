# 🎯 Productive YouTube Chrome Extension

A Chrome extension that helps you stay focused by hiding YouTube's homepage recommendations and distractions.

## ✨ Features

- **Hide Homepage Feed**: Completely removes the main recommendation feed from YouTube's homepage
- **Block Sidebar Recommendations**: Hides suggested videos when watching content
- **Remove Shorts Shelf**: Eliminates the distracting Shorts recommendations
- **Preserve Functionality**: Search, subscriptions, and direct video access still work perfectly
- **Clean Interface**: Shows a motivational message instead of endless recommendations

## 🚀 Installation

### Method 1: Load as Unpacked Extension (Development)

1. **Download or Clone** this repository to your computer
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in the top right corner)
4. **Click "Load unpacked"** and select the folder containing the extension files
5. **Add Icons** (optional): Add icon files to the `icons/` folder (icon16.png, icon48.png, icon128.png)
6. **Visit YouTube** and see the difference!

### Method 2: Create Extension Package

1. After loading unpacked, click **"Pack extension"** 
2. Select the extension folder
3. This creates a `.crx` file you can share

## 🛠️ Troubleshooting

### Extension Not Working?

1. **Refresh YouTube**: Press `Ctrl+F5` (or `Cmd+F5` on Mac) to hard refresh
2. **Check Console**: Press `F12` and look for "Productive YouTube" messages in the Console tab
3. **Reload Extension**: Go to `chrome://extensions/`, find the extension, and click the reload button
4. **Clear Cache**: Clear your browser cache and cookies for YouTube

### Still Seeing Recommendations?

The extension uses multiple methods to hide recommendations:

- **CSS-based hiding** (instant)
- **JavaScript DOM manipulation** (catches dynamic content)
- **MutationObserver** (watches for new content)

If recommendations still appear:

1. Wait a few seconds after page load
2. Check if you're on the actual homepage (`youtube.com` not a specific video)
3. Disable other YouTube extensions that might conflict
4. Try refreshing the page

### Common Issues

**Issue**: Extension icon not showing
- **Solution**: Add icon files to the `icons/` folder or update manifest.json to remove icon references

**Issue**: Extension not loading
- **Solution**: Check that all files (manifest.json, content.js, styles.css, popup.html) are present

**Issue**: YouTube looks broken
- **Solution**: The extension only affects the homepage - search, subscriptions, and video pages work normally

## 📁 File Structure

```
productive-youtube/
├── manifest.json          # Extension configuration
├── content.js            # Main logic for hiding recommendations  
├── styles.css            # CSS rules for hiding content
├── popup.html            # Extension popup interface
├── icons/                # Icon files (16px, 48px, 128px)
└── README.md             # This file
```

## 🔧 How It Works

The extension uses three complementary approaches:

1. **CSS Rules**: Immediately hide known recommendation selectors
2. **JavaScript DOM Manipulation**: Actively find and hide recommendation elements
3. **MutationObserver**: Watch for new content and hide it as it loads

This multi-layered approach ensures that recommendations are hidden even as YouTube's interface changes or loads content dynamically.

## 🤝 Contributing

Found a bug or want to improve the extension? Feel free to:

1. Open an issue describing the problem
2. Submit a pull request with improvements
3. Test with different YouTube layouts and report findings

## 📋 Development Notes

- Extension uses Manifest V3 (latest Chrome extension format)
- Compatible with modern YouTube interface
- Tested on various YouTube pages and layouts
- Uses minimal permissions for security

## 🎯 Philosophy

This extension is built on the principle that **you should control your attention**, not algorithmic recommendations. By removing the infinite scroll of suggestions, you can:

- Use YouTube intentionally (search for specific content)
- Check your subscriptions without distractions  
- Avoid falling into recommendation rabbit holes
- Stay focused on your actual goals

---

**Stay productive! 🚀**
