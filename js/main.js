// ===== Anti-bot core =====

const botSignals = {
    noMouse: true,
    tooFast: false,
    noFocus: true,
    webdriver: navigator.webdriver,
    headless: false
};

// Detect headless (basic)
if (navigator.userAgent.includes("Headless")) {
    botSignals.headless = true;
}

// Mouse detection
document.addEventListener("mousemove", () => {
    botSignals.noMouse = false;
});

// Focus detection
window.addEventListener("focus", () => {
    botSignals.noFocus = false;
});

// Timing test (page load speed)
const startTime = performance.now();
window.addEventListener("load", () => {
    const loadTime = performance.now() - startTime;
    if (loadTime < 50) {
        botSignals.tooFast = true;
    }
});

// Decision engine
function isBot() {
    let score = 0;

    if (botSignals.webdriver) score += 2;
    if (botSignals.noMouse) score += 1;
    if (botSignals.noFocus) score += 1;
    if (botSignals.tooFast) score += 1;
    if (botSignals.headless) score += 2;

    return score >= 3;
}

// ===== Reaction =====

setTimeout(() => {
    if (isBot()) {
        console.log("Bot detected (soft)");

        // Fake slowdown
        const delay = 3000 + Math.random() * 4000;

        const originalFetch = window.fetch;
        window.fetch = (...args) =>
            new Promise(resolve =>
                setTimeout(() => resolve(originalFetch(...args)), delay)
            );

        // Fake data injection
        const fakeIP = "192.168." + Math.floor(Math.random()*255) + "." + Math.floor(Math.random()*255);
        const ipEl = document.getElementById("ip");
        if (ipEl) ipEl.innerText = fakeIP;

    }
}, 1500);

// Honeypot detection
window.trapTriggered = false;

const trap = document.getElementById("trap");
if (trap) {
    trap.addEventListener("input", () => {
        window.trapTriggered = true;
    });
}