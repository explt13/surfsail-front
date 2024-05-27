
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