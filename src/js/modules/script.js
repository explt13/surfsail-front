import { _slideDown, _slideUp } from "./functions.js";
import { validateInit } from './validate.js';
import { setViewPassword } from './forms.js'


document.addEventListener("click", documentActions);

function documentActions(e){
    const targetElement = e.target;
    if (targetElement.closest('[data-parent]')){
        e.preventDefault();
        const subMenuId = targetElement.dataset.parent ? targetElement.dataset.parent : null;
        const subMenu = document.querySelector(`[data-submenu="${subMenuId}"]`);
        if (subMenu){
            const activeTab = document.querySelector('._active-link');
            const activeMenu = document.querySelector('._active-sub-menu');
            if (activeTab && activeTab != targetElement){
                activeTab.classList.remove('_active-link');
                activeMenu.classList.remove('_active-sub-menu');
                document.documentElement.classList.remove('sub-menu-open');
            }
            targetElement.classList.toggle('_active-link');
            subMenu.classList.toggle('_active-sub-menu');
            document.documentElement.classList.toggle('sub-menu-open');
            
        } else {
            console.log("Oops, there is no such submenu :(");
        }
    }


    if (targetElement.closest('.menu-top-header__link_catalog')){
        e.preventDefault();
        document.documentElement.classList.add("catalog-open");
    }

    if (targetElement.closest('.menu-catalog__back')){
        e.preventDefault();
        document.documentElement.classList.remove("catalog-open");
        document.querySelector("._active-link") ? document.querySelector("._active-link").classList.remove("_active-link") : null;
        document.querySelector("._active-sub-menu") ? document.querySelector("._active-sub-menu").classList.remove("_active-sub-menu") : null;
    }

    if (targetElement.closest('.sub-menu-catalog__back')){
        e.preventDefault();
        document.documentElement.classList.remove("sub-menu-open");
        document.querySelector("._active-link") ? document.querySelector("._active-link").classList.remove("_active-link") : null;
        document.querySelector("._active-sub-menu") ? document.querySelector("._active-sub-menu").classList.remove("_active-sub-menu") : null;
    }    
}

function subMenuBlockGridLayout() {
    const menuBlocks = document.querySelectorAll(".sub-menu-catalog__block");
    if (menuBlocks.length > 0){
        menuBlocks.forEach(block => {
            const categoryQty = block.querySelectorAll(".sub-menu-catalog__category").length;
            block.classList.add(`sub-menu-catalog__block_${categoryQty}`);
        })
    }
}
subMenuBlockGridLayout();

const burgerMenu = () =>{
    const mql = matchMedia(`(max-width: ${991 / 16}em)`)
    const button = document.querySelector('.icon-menu');
    if (button) {
        const menu = () => {
            document.documentElement.classList.remove('menu-hidden');
            document.querySelector('.icon-menu').classList.toggle('active');
            if (document.documentElement.classList.contains('catalog-open')){
                document.documentElement.classList.remove('catalog-open');
            }
            if (document.documentElement.classList.contains('sub-menu-open')){
                document.documentElement.classList.remove('sub-menu-open');
                document.querySelector('.menu-catalog__link').classList.remove('_active-link');
                document.querySelector('.sub-menu-catalog__block').classList.remove("_active-sub-menu");
                
            }
    
            document.documentElement.classList.toggle('menu-open');
            document.documentElement.classList.toggle('lock');
        }
    
        const handleBM = () => {
            document.documentElement.classList.add('menu-hidden');
            button.addEventListener('click', menu);
        }
    
        if (mql.matches){
            handleBM();
        }
        mql.addEventListener('change', function(){
            if (mql.matches){
                handleBM();
            } else {
                document.querySelector('.icon-menu').removeEventListener('click', menu);
                document.querySelector('.icon-menu').classList.remove('active');
                document.documentElement.classList.remove('menu-open');
                document.documentElement.classList.remove('lock');
                document.documentElement.classList.remove('catalog-open');
                document.documentElement.classList.remove('sub-menu-open');
            }
        })
    }  
}
burgerMenu();


const handleHeader = () => {
    const topHeader = document.querySelector('.top-header');
    const bodyHeader = document.querySelector('.body-header');
    const catalogHeader = document.querySelector('.catalog-header');

    if (topHeader){
        const mq = window.matchMedia(`(min-width: ${992 / 16}em)`)
        const topHeaderHeight = topHeader.scrollHeight
        const bodyHeaderHeight = bodyHeader.scrollHeight;
        const catalogHeaderHeight = catalogHeader.scrollHeight;
        let scrollYLast = 0;
        const watchHeader = () => {
            const scrollY = window.scrollY;
            if (scrollY > topHeaderHeight + bodyHeaderHeight){
                if (!bodyHeader.classList.contains('_scrolled')){
                    bodyHeader.classList.add('_scrolled');
                }
                if (topHeader.style.marginBottom === '0px'){
                    topHeader.style.marginBottom = bodyHeaderHeight + "px";
                }
                
            } else if (scrollY <= topHeaderHeight + bodyHeaderHeight){
                if (bodyHeader.classList.contains('_scrolled')){
                    bodyHeader.classList.remove('_scrolled');
                }
                if (bodyHeader.classList.contains('_hide')){
                    bodyHeader.classList.remove('_hide');
                }
                topHeader.style.marginBottom = 0;
            }
            if (scrollY > topHeaderHeight + bodyHeaderHeight + catalogHeaderHeight){
                if (!bodyHeader.classList.contains('_show')){
                    bodyHeader.classList.add('_show');
                }
                if (bodyHeader.classList.contains('_hide')){
                    bodyHeader.classList.remove('_hide');
                }
            } else if (scrollY <= topHeaderHeight + bodyHeaderHeight + catalogHeaderHeight){
                if (bodyHeader.classList.contains('_show')){
                    bodyHeader.classList.remove('_show');
                }
            }
            if ((scrollY <= topHeaderHeight + bodyHeaderHeight + catalogHeaderHeight) && (scrollY > topHeaderHeight + bodyHeaderHeight) && (scrollYLast > scrollY)){
                if (!bodyHeader.classList.contains('_hide')){
                    bodyHeader.classList.add('_hide');
                }
            }
            scrollYLast = scrollY;
        }
        mq.addEventListener('change', function(){
            initHeader();
        })
    
        const initHeader = () => {
            if (mq.matches){
                window.addEventListener("scroll", watchHeader);
            } else{
                if (bodyHeader.classList.contains('_scrolled')){
                    bodyHeader.classList.remove('_scrolled');
                }
                if (bodyHeader.classList.contains('_hide')){
                    bodyHeader.classList.remove('_hide');
                }
                topHeader.style.marginBottom = 0;
                window.removeEventListener("scroll", watchHeader);
            }
        }
        initHeader();
    }

    
}
handleHeader();


const handleSubMenuMore = () => {
    const submenu = document.querySelectorAll('.sub-menu-catalog__block');
    if (submenu.length > 0) {
        submenu.forEach(submenuItem => {
            const list = submenuItem.querySelectorAll('.sub-menu-catalog__list');
            if (list.length > 0) {
                let display = false;
                list.forEach(listItem => {
                    if (listItem.children.length > 7) {
                        display = true;
                    }
                });
                if (!display) {
                    const footer = submenuItem.querySelectorAll('.sub-menu-catalog__footer');
                    footer.forEach(footerItem => {
                        footerItem.remove();
                    })
                }
            }
        })
    }
}


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

const setPlaceholders = () => {
    const fields = document.querySelectorAll('.form__field:has(input:not([type="checkbox"]))');
    fields.forEach(field => {
        const input = field.querySelector('input');
        if (input.value.length > 0) {
            if (!field.classList.contains('_minimize-placeholder')) {
                field.classList.add('_minimize-placeholder');
            }
        }
        field.setAttribute('data-placeholder', input.placeholder ?? '');
        input.addEventListener('focusin', function() {
            if (!field.classList.contains('_minimize-placeholder')) {
                field.classList.add('_minimize-placeholder');
            }
        });
        input.addEventListener('focusout', function() {
            if (input.value.length > 0) return;
            if (field.classList.contains('_minimize-placeholder')) {
                field.classList.remove('_minimize-placeholder');
            }
        });
    });
}
setPlaceholders();

const handleAuth = () => {
    validateInit();
    setViewPassword();
    
    const switchButton = document.querySelector('.auth__change-form');
    if (!switchButton) {
        return;
    }
    const params = new URLSearchParams(window.location.search);
    let authForm = params.get('auth');
    const redirectToParamString = params.get('r_link') ? '&r_link=' + params.get('r_link') : '';

    if (authForm === null) {
        window.history.pushState({}, "", window.location.origin + window.location.pathname + '?auth=login' + redirectToParamString);
        authForm = 'login';
    }
    
    const authBody = document.querySelector('.auth__body');
    const formEl = authBody.querySelector('.auth__form');
    const confirmPasswordParent = formEl.querySelector('.form__password-confirm').parentElement;
    const dynamicChangeable = document.querySelectorAll('[data-changeable]');
    authBody.classList.add(`_${authForm}`);

    const revalidateEvent = new CustomEvent('revalidate');

    const authFormText = {
        login: {
            switchFormButton: 'Register',
            switchFormText: 'Don\'t have an account?',
            submitFormButton: 'Log in',
        },
        register: {
            switchFormButton: 'Log in',
            switchFormText: 'Already have an account?',
            submitFormButton: 'Register',
        }
    
    }
    
    function renderFormInit() {
        if (authForm === 'register') {
            confirmPasswordParent.style.removeProperty('display');
            dynamicChangeable.forEach(el => {
                el.textContent = authFormText[authForm][el.dataset.name];
            })
        } else if (authForm === 'login') {
            dynamicChangeable.forEach(el => {
                el.textContent = authFormText[authForm][el.dataset.name];
            })

        }

    }
    renderFormInit();

    switchButton.addEventListener('click', function() {
        if (authForm === 'login'){
            authBody.classList.remove('_login');
            authBody.classList.add('_register');
            authForm = 'register';
            authFormAnimate(authForm);
            window.history.pushState({}, '', window.location.origin + window.location.pathname  + "?auth=" + authForm + redirectToParamString);
        } 
        else if (authForm === 'register') {
            authBody.classList.remove('_register');
            authBody.classList.add('_login');
            authForm = 'login';
            authFormAnimate(authForm);
            window.history.pushState({}, '', window.location.origin + window.location.pathname + "?auth=" + authForm + redirectToParamString);
        }
    })


    function authFormAnimate(form) {
        if (form === 'register') {
            _slideDown(confirmPasswordParent, 250);
        }
        if (form === 'login') {
            _slideUp(confirmPasswordParent, 250);
        }
        dynamicChangeable.forEach(el => {
            el.classList.add('_fade_out');
        });
        setTimeout(() => {
            dynamicChangeable.forEach(el => {
                el.classList.remove('_fade_out');
                el.classList.add('_fade_in');
                el.textContent = authFormText[form][el.dataset.name];
            })
            document.dispatchEvent(revalidateEvent);
        }, 250);
    
        setTimeout(() => {
            dynamicChangeable.forEach(el => {
                el.classList.remove('_fade_in');
            })
        }, 500);
    }
}

handleAuth();

const bindTabIndexElements = () => {
    document.addEventListener('keydown', e => {
        if (e.key === "Enter" && e.target.matches('[tabindex="0"]')) {
            e.target.click();
        }
    });
}

bindTabIndexElements();


const displayBenefitsWhyUsButton = () => {
    const isMobile = document.documentElement.classList.contains('_touch');
    const whyUs = document.querySelector('.advantages__title-mobile-arrow')
    if (isMobile && whyUs) {
        whyUs.classList.add('_show');
    }
}
displayBenefitsWhyUsButton();