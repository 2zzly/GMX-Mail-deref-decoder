// ==UserScript==
// @name         URL Decoder and Rewriter Tampermonkey Script
// @namespace    http://your-namespace-here
// @version      0.1
// @description  Decodes and rewrites URLs on the current webpage using Tampermonkey script
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function decodeAndRewriteUrl(url) {
        const regexMail = /https:\/\/deref-mail\.com\/mail\/client\/([a-zA-Z0-9-_]{11})\/dereferrer\/\?redirectUrl=(.+)/;
        const regexGMX = /https:\/\/deref-gmx\.net\/mail\/client\/([a-zA-Z0-9-_]{11})\/dereferrer\/\?redirectUrl=(.+)/;

        const matchMail = url.match(regexMail);
        const matchGMX = url.match(regexGMX);

        if (matchMail && matchMail[2]) {
            const strippedUrl = matchMail[2];
            const decodedUrl = decodeURIComponent(strippedUrl);
            return decodedUrl;
        }

        if (matchGMX && matchGMX[2]) {
            const strippedUrl = matchGMX[2];
            const decodedUrl = decodeURIComponent(strippedUrl);
            return decodedUrl;
        }

        return null;
    }

    function injectScript(frame) {
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                const links = document.querySelectorAll('a');
                for (const link of links) {
                    const decodedUrl = decodeAndRewriteUrl(link.href);
                    if (decodedUrl) {
                        link.href = decodedUrl;
                    }
                }
            })();
        `;
        frame.contentDocument.head.appendChild(script);
    }

    function handleFrames() {
        const frames = document.querySelectorAll('iframe');
        for (const frame of frames) {
            injectScript(frame);
        }
    }

    // Handle the top-level document
    const links = document.querySelectorAll('a');
    for (const link of links) {
        const decodedUrl = decodeAndRewriteUrl(link.href);
        if (decodedUrl) {
            link.href = decodedUrl;
        }
    }

    // Handle frames
    handleFrames();
})();
