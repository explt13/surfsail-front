import { validateInit } from './validate.js';
import { setViewPassword, setPlaceholders } from './forms.js'
import { _slideDown, _slideUp } from './functions.js';

export const initAuth = () => {
    validateInit();
    setViewPassword();
    setPlaceholders();
    
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
            dynamicChangeable.forEach(el => {
                el.textContent = authFormText[authForm][el.dataset.name];
                confirmPasswordParent.hidden = false;
            })
        } else if (authForm === 'login') {
            dynamicChangeable.forEach(el => {
                el.textContent = authFormText[authForm][el.dataset.name];
                confirmPasswordParent.hidden = true;
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