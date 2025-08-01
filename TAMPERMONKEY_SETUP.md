# Tampermonkey Userscript Setup Guide

## Installation

1. **Install Tampermonkey**
   - Chrome: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
   - Edge: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd

2. **Install the Script**
   - Open `nyt-crossword-projector.user.js` in a text editor
   - Copy the entire contents
   - Click the Tampermonkey extension icon
   - Choose "Create a new script"
   - Replace the default template with the copied code
   - Save (Ctrl+S or Cmd+S)

## Alternative Installation
   - In Tampermonkey dashboard, click "Utilities"
   - Under "Import from file", select `nyt-crossword-projector.user.js`
   - Click "Install"

## Usage

1. **Navigate to NYTimes Crossword**
   - Go to https://www.nytimes.com/crosswords/
   - Open any crossword puzzle

2. **Control Panel**
   - A control panel appears in the top-right corner
   - Click "Enable Projector Mode" to optimize for projector
   - Use export buttons to capture screenshots and DOM data

3. **Features**
   - **Projector Toggle**: Enables/disables projector optimization
   - **Export Screenshot**: Downloads page screenshot (requires html2canvas)
   - **Export DOM Source**: Downloads detailed HTML/CSS analysis

## Key Differences from Extension

- **Control Panel**: Floating panel instead of popup
- **Persistent State**: Settings saved using Tampermonkey storage
- **No Background Script**: All functionality runs in page context
- **Direct Downloads**: Uses GM_download for file exports
- **CSS Injection**: Styles injected directly via GM_addStyle

## Troubleshooting

### Script Not Running
- Check Tampermonkey is enabled for nytimes.com
- Verify script is enabled in Tampermonkey dashboard
- Refresh the crossword page

### Control Panel Not Appearing
- Wait for page to fully load
- Check browser console for errors
- Ensure you're on a crossword puzzle page (not main games page)

### Export Issues
- DOM export always works
- Screenshot export requires html2canvas library (optional)
- Files download to your default download folder

### Permission Issues
- Grant Tampermonkey download permissions if prompted
- Check browser's download settings

## Customization

Edit the userscript to modify:
- **Element Selectors** (lines 140-157): Which elements to hide
- **Sizing** (lines 219-238): Scale and font adjustments  
- **Positioning** (lines 181-198): Layout arrangement
- **Styling** (lines 13-114): Colors and appearance

## Advantages over Extension
- ✅ Bypasses corporate extension policies
- ✅ Works in most browsers with Tampermonkey
- ✅ Easier to modify and customize
- ✅ No installation/developer mode needed
- ✅ Portable across different systems