const handleCartHeight = () => {
    const mq = window.matchMedia(`(min-width: ${992 / 16}em)`);
    if (mq.matches){
        const cartContainer = document.querySelector('.cart__container');
        if (cartContainer) {
            const headerHeight = document.querySelector(".header")?.scrollHeight;
            const footerHeight = document.querySelector('.footer-cart')?.scrollHeight;
            const windowHeight = window.innerHeight;
            const cartContainerHeight = windowHeight - (headerHeight + footerHeight);
            cartContainer.style.height = cartContainerHeight + 'px';
        }
    }
}
handleCartHeight();
