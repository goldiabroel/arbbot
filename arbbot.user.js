// ==UserScript==
// @name         Full Auto Sniper (Multi-Step & Fast)
// @namespace    local.auto
// @version      2.0
// @match        https://*.payjora.com/*
// @match        https://*.asjoby.com/*
// @match        https://*.arbpay.me/*
// @match        https://*.arbpay.cc/*
// @match        https://*.arbpay.co/*
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Step 1: Naye order ka grab/buy button
    const BUY_SELECTORS = [
        '.van-button--primary',
        'button.btn-primary',
        'button.btn-success',
        '.van-button--danger'
    ];

    // Step 2: Pop-up aane ke baad confirmation button
    const MODAL_CONFIRM_SELECTORS = [
        '.van-dialog__confirm',
        '.van-button--default.van-dialog__confirm',
        '.modal-footer .btn-primary'
    ];

    const ACTION_KEYWORDS = ['buy', 'accept', 'grab', 'confirm', 'pay', 'ok', 'yes'];

    function triggerClick(element) {
        if (!element || element.disabled || element.offsetParent === null) return false;
        
        // Human click simulate karna taaki event listener miss na ho
        const events = ['mousedown', 'mouseup', 'click'];
        events.forEach(eventType => {
            element.dispatchEvent(new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        });
        return true;
    }

    function processOrders() {
        // Pehle check karein agar koi confirmation pop-up khula hai
        for (let selector of MODAL_CONFIRM_SELECTORS) {
            const confirmBtn = document.querySelector(selector);
            if (confirmBtn && triggerClick(confirmBtn)) {
                return;
            }
        }

        // Agar pop-up nahi hai to regular buy button click karein
        for (let selector of BUY_SELECTORS) {
            const buttons = document.querySelectorAll(selector);
            for (let btn of buttons) {
                const text = (btn.innerText || '').trim().toLowerCase();
                const isMatch = ACTION_KEYWORDS.some(k => text.includes(k)) || btn.classList.contains('van-button--primary');

                if (isMatch) {
                    if (triggerClick(btn)) return;
                }
            }
        }
    }

    // High performance DOM listener (Zero Delay)
    const observer = new MutationObserver(() => {
        processOrders();
    });

    function start() {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            setInterval(processOrders, 100); // 100ms ultra-fast polling
        } else {
            requestAnimationFrame(start);
        }
    }

    start();
})();
