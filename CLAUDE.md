# Chrome Extension Development Guide

## Project Structure
```
nyt-crossword-projector/
├── manifest.json          # Extension configuration
├── content.js            # Main functionality script
├── styles.css           # Projector mode styles
├── popup.html           # Extension popup interface
├── popup.js             # Popup interaction logic
├── SETUP.md            # Installation and usage guide
└── CLAUDE.md           # This development guide
```

## Chrome Extension Fundamentals

### Manifest V3
- Required entry point for all Chrome extensions
- Defines permissions, content scripts, and basic metadata
- Uses `host_permissions` for site access

### Content Scripts
- Run in the context of web pages
- Can access and modify DOM elements
- Isolated from page's JavaScript context
- Use `chrome.runtime.onMessage` for popup communication

### Popup Extension
- Small HTML interface activated by clicking extension icon
- Separate execution context from content scripts
- Communicates with content scripts via `chrome.tabs.sendMessage`

## Key Development Patterns

### Element Selection and Manipulation
```javascript
// Hide elements
const elements = document.querySelectorAll(selector);
elements.forEach(el => el.style.display = 'none');

// Store original state for restoration
el.setAttribute('data-hidden-by-projector', 'true');
```

### CSS Injection and Styling
```javascript
// Add CSS classes for styling
document.body.classList.add('projector-mode');

// Direct style manipulation
element.style.transform = 'scale(1.5)';
element.style.position = 'fixed';
```

### State Management
```javascript
// Persistent storage
chrome.storage.local.set({ projectorMode: enabled });
chrome.storage.local.get(['projectorMode'], callback);
```

### Dynamic Content Handling
```javascript
// Watch for DOM changes
const observer = new MutationObserver((mutations) => {
  // Re-apply modifications when content changes
});
observer.observe(document.body, { childList: true, subtree: true });
```

## Testing and Debugging

### Loading Extensions
1. Navigate to `chrome://extensions/`
2. Enable Developer Mode
3. Use "Load unpacked" to load extension folder

### Debugging Tools
- **Popup**: Right-click extension icon → Inspect
- **Content Script**: F12 on target webpage → Console tab
- **Background**: Extensions page → "Inspect views: background page"

### Common Issues
- **Permissions**: Ensure correct `host_permissions` in manifest
- **Content Script Timing**: Use `run_at: "document_idle"`
- **Element Selection**: NYTimes may change selectors; use broad patterns

## Extension Architecture

### Communication Flow
1. User clicks popup button
2. Popup sends message to active tab
3. Content script receives message and toggles mode
4. Content script modifies DOM and stores state
5. Content script responds to popup with current state

### Error Handling
- Always check if elements exist before manipulation
- Use try-catch blocks for DOM operations
- Provide fallback selectors for key elements

## NYTimes-Specific Considerations

### Element Selectors
- Use class prefixes like `.pz-` for puzzle elements
- Target specific crossword page patterns
- Account for different puzzle types (daily, mini, etc.)

### Performance
- Minimize DOM queries in MutationObserver
- Use efficient CSS selectors
- Debounce frequent operations

## Future Enhancements

### Potential Features
- Keyboard shortcuts for toggling
- Multiple display presets
- Font size controls
- Color theme options
- Timer visibility toggle

### Code Organization
- Extract selector lists to configuration object
- Create separate modules for different functionality
- Add options page for user customization

## Best Practices

### Security
- Never inject external scripts
- Validate all DOM selections
- Use CSP-compliant code only

### Performance
- Cache DOM selections when possible
- Use CSS transforms over position changes
- Minimize style recalculations

### Maintainability
- Comment complex selector logic
- Use descriptive function names
- Keep functions focused and small
- Document browser compatibility requirements