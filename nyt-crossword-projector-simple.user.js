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

    let projectorModeEnabled = GM_getValue('projectorMode', true);
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

        /* Show only the crossword elements, control panel, and pause modal */
        .projector-mode .xwd__board--content,
        .projector-mode .xwd__board--content *,
        .projector-mode .xwd__clue-list--wrapper,
        .projector-mode .xwd__clue-list--wrapper *,
        .projector-mode .xwd__clue-list--list,
        .projector-mode .xwd__clue-list--list *,
        .projector-mode #projector-toggle-btn,
        .projector-mode .pause-modal,
        .projector-mode .pause-modal * {
            visibility: visible !important;
        }

        /* Ensure pause modal stays on top */
        .projector-mode .pause-modal {
            z-index: 99999 !important;
        }

        /* Position board content in top-left area (now 40% width) */
        .projector-mode .xwd__board--content {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 40% !important;
            height: 67% !important;
            background: #fff !important;
            border: 3px solid #000 !important;
            padding: 20px !important;
            box-sizing: border-box !important;
            z-index: 10000 !important;
        }

        /* Position first clue list (Across) across bottom third with 8 columns */
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
            
            /* 8-column layout for denser horizontal space usage */
            column-count: 8 !important;
            column-gap: 15px !important;
            column-fill: auto !important;
        }

        /* Prevent clue items from breaking across columns */
        .projector-mode .xwd__clue-list--wrapper:nth-child(1) .xwd__clue--li {
            break-inside: avoid !important;
            margin-bottom: 8px !important;
            display: block !important;
        }

        /* Position second clue list (Down) in expanded right sidebar with 3 columns */
        .projector-mode .xwd__clue-list--wrapper:nth-child(2) .xwd__clue-list--list {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            width: 60% !important;
            height: 67% !important;
            background: #fff !important;
            border: 3px solid #000 !important;
            padding: 20px !important;
            box-sizing: border-box !important;
            overflow-y: auto !important;
            z-index: 10000 !important;
            
            /* 5-column layout for Down clues */
            column-count: 5 !important;
            column-gap: 20px !important;
            column-fill: auto !important;
        }

        /* Prevent Down clue items from breaking across columns */
        .projector-mode .xwd__clue-list--wrapper:nth-child(2) .xwd__clue--li {
            break-inside: avoid !important;
            margin-bottom: 8px !important;
            display: block !important;
        }

        /* Minimal Projector Toggle Button */
        #projector-toggle-btn {
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            z-index: 99999 !important;
            width: 40px !important;
            height: 40px !important;
            background: transparent !important;
            border: 2px solid rgba(255,255,255,0.8) !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 24px !important;
            visibility: visible !important;
            backdrop-filter: blur(10px) !important;
        }

        #projector-toggle-btn:hover {
            background: rgba(255,255,255,0.1) !important;
            transform: scale(1.05) !important;
            border-color: rgba(255,255,255,1) !important;
        }
    `;

    GM_addStyle(projectorStyles);

    function createControlPanel() {
        controlPanel = document.createElement('button');
        controlPanel.id = 'projector-toggle-btn';
        controlPanel.innerHTML = projectorModeEnabled ? '📺' : '🎬';
        controlPanel.title = projectorModeEnabled ? 'Disable Projector Mode' : 'Enable Projector Mode';
        controlPanel.className = projectorModeEnabled ? 'active' : 'inactive';
        
        document.body.appendChild(controlPanel);
        
        // Add event listener
        controlPanel.addEventListener('click', toggleProjectorMode);
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
        console.log('✅ Projector mode enabled - elements repositioned via CSS');
        console.log('Body classes:', document.body.classList.toString());
    }

    function disableProjectorMode() {
        // Simply remove the CSS class - elements return to normal positioning
        document.body.classList.remove('projector-mode');
        console.log('Projector mode disabled - elements returned to normal');
    }

    function updateControlPanelUI() {
        if (!controlPanel) return;
        
        controlPanel.innerHTML = projectorModeEnabled ? '📺' : '🎬';
        controlPanel.title = projectorModeEnabled ? 'Disable Projector Mode' : 'Enable Projector Mode';
        controlPanel.className = projectorModeEnabled ? 'active' : 'inactive';
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
                
                // Force projector mode on by default
                console.log('🎬 Starting projector mode by default');
                projectorModeEnabled = true;
                GM_setValue('projectorMode', true);
                
                // Add a small delay to ensure DOM is ready
                setTimeout(() => {
                    console.log('🎬 Enabling projector mode after delay');
                    enableProjectorMode();
                    updateControlPanelUI();
                }, 100);
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