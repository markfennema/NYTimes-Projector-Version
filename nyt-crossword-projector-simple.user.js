// ==UserScript==
// @name         NYTimes Crossword Projector Simple
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Simple projector mode - extracts crossword elements into clean layout
// @author       You
// @match        https://www.nytimes.com/crosswords/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    let projectorModeEnabled = GM_getValue('projectorMode', false);
    let controlPanel = null;

    // Simple projector mode styles - reposition elements in place
    const projectorStyles = `
        /* Black background for projector mode */
        .projector-mode body {
            background: #000 !important;
            overflow: hidden !important;
        }

        /* Hide everything in projector mode */
        .projector-mode * {
            visibility: hidden !important;
        }

        /* Show only the crossword elements and control panel */
        .projector-mode .xwd__board--content,
        .projector-mode .xwd__board--content *,
        .projector-mode .xwd__clue-list--wrapper,
        .projector-mode .xwd__clue-list--wrapper *,
        .projector-mode .xwd__clue-list--list,
        .projector-mode .xwd__clue-list--list *,
        .projector-mode #projector-control-panel,
        .projector-mode #projector-control-panel * {
            visibility: visible !important;
        }

        /* Position board content in top-left two thirds */
        .projector-mode .xwd__board--content {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 67% !important;
            height: 67% !important;
            background: #fff !important;
            border: 3px solid #000 !important;
            padding: 20px !important;
            box-sizing: border-box !important;
            z-index: 10000 !important;
        }

        /* Position first clue list (Across) across bottom third */
        .projector-mode .xwd__clue-list--wrapper:nth-child(1) .xwd__clue-list--list {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 33% !important;
            background: #fff !important;
            border: 3px solid #000 !important;
            padding: 20px !important;
            box-sizing: border-box !important;
            overflow-y: auto !important;
            z-index: 10000 !important;
            
            /* 5-column layout for horizontal space efficiency */
            column-count: 5 !important;
            column-gap: 20px !important;
            column-fill: auto !important;
        }

        /* Prevent clue items from breaking across columns */
        .projector-mode .xwd__clue-list--wrapper:nth-child(1) .xwd__clue--li {
            break-inside: avoid !important;
            margin-bottom: 8px !important;
            display: block !important;
        }

        /* Position second clue list (Down) across right third */
        .projector-mode .xwd__clue-list--wrapper:nth-child(2) .xwd__clue-list--list {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            width: 33% !important;
            height: 67% !important;
            background: #fff !important;
            border: 3px solid #000 !important;
            padding: 20px !important;
            box-sizing: border-box !important;
            overflow-y: auto !important;
            z-index: 10000 !important;
        }

        /* Control Panel Styles */
        #projector-control-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            background: white;
            border: 2px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif;
            min-width: 200px;
        }

        #projector-control-panel h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #333;
        }

        #projector-control-panel button {
            width: 100%;
            padding: 8px;
            margin-bottom: 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        #projector-control-panel .toggle-btn {
            background-color: #1976d2;
            color: white;
        }

        #projector-control-panel .toggle-btn:hover {
            background-color: #1565c0;
        }

        #projector-control-panel .toggle-btn.active {
            background-color: #f44336;
        }

        #projector-control-panel .toggle-btn.active:hover {
            background-color: #d32f2f;
        }

        #projector-control-panel .export-btn {
            background-color: #4caf50;
            color: white;
        }

        #projector-control-panel .export-btn:hover {
            background-color: #45a049;
        }

        #projector-control-panel .status {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin: 8px 0;
        }

        #projector-control-panel .export-section {
            border-top: 1px solid #ddd;
            padding-top: 10px;
            margin-top: 10px;
        }

        #projector-control-panel .export-title {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
        }
    `;

    GM_addStyle(projectorStyles);

    function createControlPanel() {
        controlPanel = document.createElement('div');
        controlPanel.id = 'projector-control-panel';
        controlPanel.innerHTML = `
            <h3>Projector Mode</h3>
            <button id="toggle-projector" class="toggle-btn">Enable Projector Mode</button>
            <div id="projector-status" class="status">Projector mode is off</div>
            
            <div class="export-section">
                <div class="export-title">Debug Export</div>
                <button id="screenshot-guide" class="export-btn">Screenshot Guide</button>
                <button id="export-dom" class="export-btn">Export DOM Source</button>
            </div>
        `;
        
        document.body.appendChild(controlPanel);
        
        // Add event listeners
        document.getElementById('toggle-projector').addEventListener('click', toggleProjectorMode);
        document.getElementById('screenshot-guide').addEventListener('click', showScreenshotGuide);
        document.getElementById('export-dom').addEventListener('click', exportDOMSource);
        
        updateControlPanelUI();
    }

    function toggleProjectorMode() {
        projectorModeEnabled = !projectorModeEnabled;
        GM_setValue('projectorMode', projectorModeEnabled);
        
        if (projectorModeEnabled) {
            enableProjectorMode();
        } else {
            disableProjectorMode();
        }
        
        updateControlPanelUI();
    }

    function enableProjectorMode() {
        // Find the elements we need to verify they exist
        const boardContent = document.querySelector('.xwd__board--content');
        const clueLists = document.querySelectorAll('.xwd__clue-list--list');
        
        console.log('Board content:', boardContent);
        console.log('Clue lists:', clueLists);
        
        if (!boardContent) {
            console.error('Could not find .xwd__board--content');
            alert('Could not find crossword board. Make sure you are on the puzzle solving page.');
            return;
        }
        
        if (clueLists.length < 2) {
            console.error('Could not find 2 .xwd__clue-list--list elements, found:', clueLists.length);
            alert('Could not find clue lists. Make sure puzzle is loaded.');
            return;
        }
        
        // Simply add the CSS class - elements stay in their original DOM positions
        document.body.classList.add('projector-mode');
        console.log('Projector mode enabled - elements repositioned via CSS');
    }

    function disableProjectorMode() {
        // Simply remove the CSS class - elements return to normal positioning
        document.body.classList.remove('projector-mode');
        console.log('Projector mode disabled - elements returned to normal');
    }

    function updateControlPanelUI() {
        if (!controlPanel) return;
        
        const toggleBtn = document.getElementById('toggle-projector');
        const status = document.getElementById('projector-status');
        
        if (projectorModeEnabled) {
            toggleBtn.textContent = 'Disable Projector Mode';
            toggleBtn.classList.add('active');
            status.textContent = 'Projector mode is on';
        } else {
            toggleBtn.textContent = 'Enable Projector Mode';
            toggleBtn.classList.remove('active');
            status.textContent = 'Projector mode is off';
        }
    }

    function showScreenshotGuide() {
        alert(`Screenshot Guide:

1. Enable Projector Mode
2. Use Cmd+Shift+4 to capture the crossword area
3. Screenshot saves to Desktop automatically
4. Run: ./pull-exports.sh to move it to project folder

Then Claude can see your exact layout!`);
    }

    function exportDOMSource() {
        const btn = document.getElementById('export-dom');
        btn.textContent = 'Exporting...';
        btn.disabled = true;
        
        try {
            const domInfo = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                title: document.title,
                crosswordElements: extractCrosswordElements(),
                fullHTML: document.documentElement.outerHTML
            };
            
            const jsonData = JSON.stringify(domInfo, null, 2);
            const blob = new Blob([jsonData], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = 'nyt-crossword-source.json';
            a.click();
            
            btn.textContent = 'DOM Exported!';
            setTimeout(() => {
                btn.textContent = 'Export DOM Source';
                btn.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('Export error:', error);
            btn.textContent = 'Error';
            setTimeout(() => {
                btn.textContent = 'Export DOM Source';
                btn.disabled = false;
            }, 2000);
        }
    }

    function extractCrosswordElements() {
        const elements = {};
        
        const selectors = [
            '.xwd__board--content',
            '.xwd__clue-list--list',
            '.pz-game-board',
            '.pz-game-clues'
        ];
        
        selectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            if (found.length > 0) {
                elements[selector] = Array.from(found).map(el => ({
                    tagName: el.tagName,
                    className: el.className,
                    id: el.id,
                    textContent: el.textContent?.substring(0, 100)
                }));
            }
        });
        
        return elements;
    }

    // Initialize when page loads
    function init() {
        // Wait for crossword elements to load
        const checkForCrossword = setInterval(() => {
            // Check for the new crossword interface
            const hasBoardContent = document.querySelector('.xwd__board--content');
            const hasClueLists = document.querySelectorAll('.xwd__clue-list--list').length >= 2;
            
            if (hasBoardContent && hasClueLists) {
                clearInterval(checkForCrossword);
                console.log('✅ Found crossword elements, creating control panel');
                createControlPanel();
                
                // Apply saved projector mode state
                if (projectorModeEnabled) {
                    enableProjectorMode();
                }
            }
        }, 500);
        
        // Stop checking after 30 seconds
        setTimeout(() => clearInterval(checkForCrossword), 30000);
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();