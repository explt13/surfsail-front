import { _slideDown, _slideUp } from "./functions.js";


document.addEventListener("click", documentClickActions);
document.addEventListener('keydown', documentKeyActions);

function documentClickActions(e){
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

function documentKeyActions(e) {
    if (e.key === "Enter" && e.target.matches('[tabindex="0"]')) {
        e.target.click();
    }
}

const burgerMenu = () => {
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

const handleStickHeader = () => {
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
handleStickHeader();

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

const notification = (timems = 3000) => {
    const host = document.querySelector('.notification__container');

    function getStyles() {
        return `
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        .notification__item {
            transform: translateX(-100%);
            transition: transform 0.35s ease-in-out;
            position: relative;
            border-top-right-radius: 0.3125rem;
            border-bottom-right-radius: 0.3125rem;
            padding: 0.625em;
        }
        .notification__item:not(:last-child) {
            margin: 0 0 1rem 0;
        }
        .notification__item._slide-in {
            transform: translateX(0);
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
            e.detail.reject();
            setTimeout(() => {
                e.detail.notification.style.visibility = 'hidden';
            }, 350);
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
                removeNotification(el, 0);
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

    function delay(callback, seconds, timer=null) {
        let timeId;
        const promise = new Promise((resolve, reject) => {
            timeId = setTimeout(() => {
                callback(resolve, reject);
            }, seconds)
        })
        if (timer) {
            timer.id = timeId;
        }
        return promise
    }

    function removeNotification(notification, seconds) {
        let timer = {};
        
        delay((resolve, reject) => {
            notification.classList.remove('_slide-in');
            document.dispatchEvent(new CustomEvent('notification-deleted', {detail: {notification, resolve, reject}}));
        }, seconds, timer)
        .then(() => delay((resolve, reject) => {
            _slideUp(notification, 200);
            resolve();
        }, 350))
        .then(() => delay((resolve, reject) => {
            notification.classList.remove('_active');
            notification.remove();
            resolve();
        }, 200))
        .catch(() => {})
        return timer.id;
    }
}
document.querySelector('.body-header__container').addEventListener('click', function() {
    notificationClient(200, Math.random());
})

const notificationClient = notification();
