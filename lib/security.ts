
/**
 * LINGUAFLOW AI - Security Module
 * Copyright (c) 2026 Paulinho Fernando. All rights reserved.
 * 
 * Provides UI-level protection for Intellectual Property.
 */

export const initSecurityProtections = () => {
    if (typeof window === 'undefined') return;

    // 1. Disable Right-Click (Context Menu)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // 2. Disable Common Shortcuts for DevTools and Source Viewing
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        // Ctrl + Shift + I (Inspect)
        // Ctrl + Shift + J (Console)
        // Ctrl + Shift + C (Element Inspect)
        // Ctrl + U (View Source)
        // Ctrl + S (Save Page)
        if (e.ctrlKey && (e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C') || e.key === 'u' || e.key === 's')) {
            e.preventDefault();
            return false;
        }

        // Mac versions
        if (e.metaKey && (e.altKey && (e.key === 'i' || e.key === 'j') || e.key === 'u' || e.key === 's')) {
            e.preventDefault();
            return false;
        }
    });

    // 3. DevTools Detection (Soft)
    // This is a common trick: check if the console is behaving strangely or if window size changes abruptly
    let devtoolsOpen = false;
    const threshold = 160;

    const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                console.log('%cPARE!', 'color: red; font-size: 50px; font-weight: bold; -webkit-text-stroke: 1px black;');
                console.log('%cEste é um recurso do navegador destinado a desenvolvedores. Se alguém disse para você copiar e colar algo aqui para "hackear" o sistema, é um golpe.', 'font-size: 18px;');
            }
            devtoolsOpen = true;
        } else {
            devtoolsOpen = false;
        }
    };

    window.addEventListener('resize', checkDevTools);

    // 4. Disable Text Selection on sensitive elements
    // We can do this via CSS, but we can also force it here for certain classes
    const style = document.createElement('style');
    style.innerHTML = `
        .no-select {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        
        /* Protect the whole body from casual copying */
        body {
            -webkit-touch-callout: none;
        }
    `;
    document.head.appendChild(style);
};
