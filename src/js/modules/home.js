import tippy from "tippy.js";

export function setTippies() {
    tippy('[data-tippy-content]');
}

export const displayBenefitsWhyUsButton = () => {
    const isMobile = document.documentElement.classList.contains('_touch');
    const whyUs = document.querySelector('.advantages__title-mobile-arrow')
    if (isMobile && whyUs) {
        whyUs.classList.add('_show');
    }
}