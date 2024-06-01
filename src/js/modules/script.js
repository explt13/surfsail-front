
document.addEventListener("click", documentActions);


const menuBlocks = document.querySelectorAll(".sub-menu-catalog__block");
if (menuBlocks.length > 0){
    menuBlocks.forEach(block => {
        const categoryQty = block.querySelectorAll(".sub-menu-catalog__category").length;
        block.classList.add(`sub-menu-catalog__block_${categoryQty}`);
    })
}


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


const burgerMenu = () =>{
    const TABLET = 991 / 16
    const mql = matchMedia(`(max-width: ${TABLET}rem)`)
    const button = document.querySelector('.icon-menu');

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
            document.documentElement.classList.remove('sub-menu-open')
            $('html').removeClass('menu-open lock catalog-open sub-menu-open');
        }
    })
}
burgerMenu();


if (document.querySelector(".filter-catalog__title")){
    document.querySelector(".filter-catalog__title").addEventListener('click', function(){
        if (window.innerWidth < 992){
            document.querySelector(".filter-catalog__items").classList.toggle('_active');
        }
    })
}

const moreNone = document.querySelectorAll('[data-none]');
if (moreNone.length > 0){
    moreNone.forEach(more => {
        more.remove();
    })
}
import $ from 'jquery';


const imageZoom = () => {
    let zoom;
    let init = false;
    
    const initZoom = () => {
        const zoomElements = $('.xzoom, .xzoom-gallery');
      
        if (zoomElements.length > 0){
            zoom = $(".xzoom, .xzoom-gallery").xzoom({
                Xoffset: 15,
            });
            init = true;
        }
    }
    
    const handleZoom = () => {
        if (document.documentElement.classList.contains('_touch')) {
            if (init) {
                zoom.destroy();
                $('.xzoom-show-image').css('width', 'unset');
                init = false;
            }
        } else {
            if (!init) {
                $('.xzoom-show-image').addClass('xzoom');
                initZoom();
            }
        }
    }
    
    window.addEventListener('resize', handleZoom);
    handleZoom(); // Initial check on load
}
imageZoom();

const handleHeader = () => {
    const mq = window.matchMedia('(min-width: 992px)')
    const topHeader = document.querySelector('.top-header');
    const bodyHeader = document.querySelector('.body-header');
    const catalogHeader = document.querySelector('.catalog-header');
    const topHeaderHeight = topHeader.scrollHeight
    const bodyHeaderHeight = bodyHeader.scrollHeight;
    const catalogHeaderHeight = catalogHeader.scrollHeight;
  
    let scrollYLast = 0;

    const watchHeader = () => {
        const scrollY = window.scrollY;

        
        if (scrollY > topHeaderHeight + bodyHeaderHeight){
            bodyHeader.classList.add('_scrolled');
            topHeader.style.marginBottom = bodyHeaderHeight + "px";
        } else if (scrollY <= topHeaderHeight + bodyHeaderHeight){
            bodyHeader.classList.remove('_scrolled');
            bodyHeader.classList.remove('_hide');
            topHeader.style.marginBottom = 0;
        }
        if (scrollY > topHeaderHeight + bodyHeaderHeight + catalogHeaderHeight){
            bodyHeader.classList.add('_show');
        } else if (scrollY <= topHeaderHeight + bodyHeaderHeight + catalogHeaderHeight){
            bodyHeader.classList.remove('_show');   
        }
        if ((scrollY <= topHeaderHeight + bodyHeaderHeight + catalogHeaderHeight) && (scrollY > topHeaderHeight + bodyHeaderHeight) && (scrollYLast > scrollY)){
            bodyHeader.classList.add('_hide');
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
handleHeader();