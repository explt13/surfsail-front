import { _slideUp } from "./functions.js";

const notificationEl = document.querySelector('.notification');
export const notification = (timems = 3000) => {
    if (notification.initialized) return;
    notification.initialized = true;
    
    const host = document.querySelector('.notification__container');
    let slideInTime = 350;
    if (document.documentElement.classList.contains('_touch')) {
        slideInTime = 200;
    }
    let reduceTime = 200;

    function getStyles() {
        return `
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        .notification__item {
            transform: translateX(-100%);
            transition: transform ${slideInTime}ms ease-in-out;
            position: relative;
            border-top-right-radius: 0.3125rem;
            border-bottom-right-radius: 0.3125rem;
            padding: 0.625em;
            cursor: default;
        }
        .notification__item:not(:last-child) {
            margin: 0 0 1rem 0;
        }
        .notification__item._slide-in {
            transform: translateX(0);
        }
        .notification__item._invisible {
            visibility: hidden;
        }
        .notification__item._success{
            background-color: #228B22;
        }
        .notification__item._alert{
            background-color: #f6b817;
        }
        .notification__item._failure{
            background-color: #e7401b;
        }

        .notification__message {
            color: white;
            display: flex;
            align-items: center;
            gap: 0.625em;
            max-width: 25rem;
            width: 100%;
            overflow: hidden;
            text-wrap: balance;
            word-wrap: anywhere;
        }
        .notification__message::after{
            font-family: "icons"!important;
            font-style: normal;
            font-weight: normal;
            font-variant: normal;
            text-transform: none;
            align-self: flex-start;
            line-height: 1;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            display: inline-block;
            cursor: default;
            font-size: 2em;
        }
        .notification__item._success .notification__message::after{
            content: "\\e910";
        }
        .notification__item._alert .notification__message::after{
            content: "\\e911";
        }
        .notification__item._failure .notification__message::after{
            content: "\\e90f";
        }

        .notification__close {
            outline: none;
            background: transparent;
            cursor: pointer;
            border: none;
            position: absolute;
            top: 0;
            right: 0;
            transform: translateX(50%) translateY(-50%);
            box-sizing: content-box;
            width: 1rem;
            height: 1rem;
            background-color: #fefefe;
            border-radius: 50%;
            padding: 0;
            &::before,
            &::after {
                content: "";
                display: block;
                width: 0.75rem;
                height: 0.0625rem;
                left: 50%;
                top: 50%;
                position: absolute;
                background-color: black;
            }
            &::before {
                transform: translateX(-50%) translateY(-50%) rotateZ(-45deg);
            }
            &::after {
                transform: translateX(-50%) translateY(-50%) rotateZ(45deg);
            }
        }
        
        .notification__time {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0.125rem;
            border-bottom-right-radius: 0.3125rem;
            background-color: white;
        }

        .notification__item._active .notification__time {
            animation: timeout 3s linear forwards;
        }

        @keyframes timeout {
            to{
                width: 0%;
            }
        }

        @media (max-width: 47.9375em) {
            .notification__close {
                display: none;
            }
            .notification__item:not(:last-child) {
                margin: 0 auto 1rem;
            }
            .notification__item {
                width: calc(100% - 1rem);
                margin: 0 auto;
                border-radius: 0.25em;
                transform: translateY(-100%);
                transition: transform ${slideInTime}ms ease-in-out;
            }
            .notification__item._slide-in {
                transform: translateY(0);
            }
            .notification__message {
                justify-content: center;
                align-items: center;
                max-width: unset;
            }
            .notification__message::after{
                align-self: center;
                font-size: 1.5em;    
            }
        }
        ` 
    }
    
    const shadowRoot = host.attachShadow({mode: "open"});
    const notificationItemTemplate = document.getElementById('notification-item-template');
    const style = document.createElement('style');
    style.innerHTML = getStyles();
    shadowRoot.appendChild(style);
    
    function getNotifictionType(code) {
        return '_alert'
    }

    document.addEventListener('notification-deleted', function(e) {
        const hovered = shadowRoot.querySelector('.notification__item:hover');
        const notificationsArray = Array.from(shadowRoot.children);

        // first notification has index 1 because there is a style element
        const hoveredIndex = notificationsArray.indexOf(hovered);
        const currentNotificationIndex = notificationsArray.indexOf(e.detail.notification);

        // if the current notification lower than the hovered one, do NOT delete, but just hide
        if (currentNotificationIndex < hoveredIndex) {
            e.detail.reject('Upper than hovered!');
        }
        e.detail.resolve();
    })
    
    return function (code, msg) {
        let timeId;
        let startedAt = Date.now();
        let seconds = timems;
        const type = getNotifictionType(code);
        const clonedContent = notificationItemTemplate.content.cloneNode(true);
       
        const message = clonedContent.querySelector('.notification__message');
        const item = clonedContent.querySelector('.notification__item');
        const time = clonedContent.querySelector('.notification__time');
        const closeBtn = clonedContent.querySelector('.notification__close');
        item.classList.add('_success');
        requestAnimationFrame(() => {
            void item.offsetWidth;
            item.classList.add('_slide-in');
            item.classList.add('_active');
        });

        item.addEventListener('touchstart', function(e) {
            removeNotification(item, 0);
        })

        item.addEventListener('mouseenter', function() {
            time.style.animationPlayState = 'paused';
            clearTimeout(timeId);
            seconds -= Date.now() - startedAt;
        });
        item.addEventListener('mouseleave', function() {
            time.style.animationPlayState = 'running';
            startedAt = Date.now();
            timeId = removeNotification(item, seconds);
            const elsArray = Array.from(shadowRoot.children)
            const itemIndex = elsArray.indexOf(item);
            const prevEls = elsArray.filter((item, index) => index > 0 && index < itemIndex);
            prevEls.forEach(el => {
                if (!el.classList.contains('_slide-in')) {
                    removeNotification(el, 0);
                }
            })
        });

        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            timeId = removeNotification(item, 0);
        });

        message.textContent = msg;
        timeId = removeNotification(item, seconds);
        shadowRoot.appendChild(clonedContent);
    }

    function delay(callback, seconds, timer=null, delegatePromiseResolving=false) {
        let timeId;
        const promise = new Promise((resolve, reject) => {
            timeId = setTimeout(() => {
                if (delegatePromiseResolving) {
                    callback(resolve, reject);
                    return;
                }
                callback();
                resolve();
            }, seconds)
        })
        if (timer) {
            timer.id = timeId;
        }
        return promise
    }

    function removeNotification(notification, seconds) {
        let timer = {};
        
        delay(() => {
            notification.classList.remove('_slide-in');
        }, seconds, timer)
        .then(() => delay((resolve, reject) => {
            document.dispatchEvent(new CustomEvent('notification-deleted', {detail: {notification, resolve, reject}}));
            notification.classList.add('_invisible');
        }, slideInTime, null, true))
        .then(() => delay(() => {
            _slideUp(notification, reduceTime);
        }, 5))
        .then(() => delay(() => {
            notification.classList.remove('_active');
            notification.remove();
        }, reduceTime))
        .catch(() => {});
        return timer.id;
    }
}

const notificationClient = notification();
notificationEl.addEventListener('notification-sent', function(e) {
    notificationClient(e.detail.code, e.detail.msg)
});