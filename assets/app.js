function switchPhase(phaseNum) {
    const activePanelId = `phase${phaseNum}`;
    const activeTabId = `phase${phaseNum}-tab`;

    document.querySelectorAll('.phase-content').forEach((panel) => {
        const isActive = panel.id === activePanelId;
        panel.classList.toggle('hidden', !isActive);
        panel.hidden = !isActive;
    });

    document.querySelectorAll('.phase-tab').forEach((tab) => {
        const isActive = tab.id === activeTabId;
        tab.classList.toggle('active', isActive);
        tab.classList.toggle('text-white', isActive);
        tab.classList.toggle('text-white/70', !isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.phase-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            switchPhase(tab.dataset.phase);
        });
    });

    const fadeInElements = document.querySelectorAll('.fade-in');

    if (!('IntersectionObserver' in window)) {
        fadeInElements.forEach((element) => {
            element.style.animationPlayState = 'running';
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    });

    fadeInElements.forEach((element) => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
});
