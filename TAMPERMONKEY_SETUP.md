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

## Troubleshooting

### Script Not Running
- Check Tampermonkey is enabled for nytimes.com
- Verify script is enabled in Tampermonkey dashboard
- Refresh the crossword page

### Control Panel Not Appearing
- Wait for page to fully load
- Check browser console for errors
- Ensure you're on a crossword puzzle page (not main games page)

### Permission Issues
- Grant Tampermonkey download permissions if prompted
- Check browser's download settings
