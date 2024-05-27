import Swiper from "swiper/bundle"; // 'swiper/bundle' -> import all methods;


const mainSliders = document.querySelectorAll('.slider-main');



const handleMainScreenSlider = (sliderFractionActive) => {
    const mainScreenSwiper = new Swiper('.slider-main', {
        // ------------------------------------ BASE ------------------------------------ //
        init: true,
        enabled: true,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        speed: 700,
        slidesPerView: 1,
        initialSlide: 0,
        spaceBetween: 100,
        preventInteractionOnTransition: true,
        grabCursor: false,
        slideToClickedSlide: false, // click on slide to move on it
        loop: true,
        // autoHeight: true,
    
        pagination: {
            el: '.pagination-bullets',
            type: 'bullets',
        },
    
        autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            waitForTransition: false,
            disableOnInteraction: false,
            reverseDirection: false,
            pauseOnMouseEnter: true,
        },
        on: {
            slideChange: function(){
                if (this.realIndex + 1 < 10){
                    sliderFractionActive.textContent = `0${this.realIndex + 1}`;
                    
                } else {
                    sliderFractionActive.textContent = this.realIndex + 1;
                }
            },
        },
    });
}

if (mainSliders.length > 0){
    mainSliders.forEach(slider => {
        const sliderFractionActive = slider.querySelector('.pagination-fraction__active')
        const sliderFractionTotal = slider.querySelector('.pagination-fraction__total');
        const slideCount = slider.querySelectorAll('.slide-main-block').length;
        sliderFractionActive.textContent = '01';
        sliderFractionTotal.textContent = `/${slideCount}`;
        handleMainScreenSlider(sliderFractionActive);
    })
}






const handleCatalogSlider = () => {
    let productsSlider = null;
    const enableSwiper = () => {
        const sliders = document.querySelectorAll('.slider-products');
        if (sliders.length > 0){
            productsSlider = new Swiper(".slider-products", {
                init: true,
                enabled: true,
                watchOverflow: true,
                observer: true,
                observeParents: true,
                speed: 1000,
                slidesPerView: 1,
                slidesPerGroup: 1,
                initialSlide: 0,
                spaceBetween: 30,
                preventInteractionOnTransition: true,
                grabCursor: false,
                slideToClickedSlide: false, // click on slide to move on it
                pagination: {
                    enabled: true,
                    el: '.pagination-bullets',
                    type: 'bullets',
                },
                autoplay: {
                    delay: 3000,
                    stopOnLastSlide: false,
                    waitForTransition: false,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                },
                lazyPreloadPrevNext: 0,
                breakpoints: {
                    767: {
                        slidesPerView: 2,
                    },
                    992: {
                        slidesPerView: 3,
                    },
                    1101: {
                        slidesPerView: 4,
                    },
                }
            })
        }
    }
    const MOBILE = 768 / 16
    const mq = window.matchMedia(`(min-width: ${MOBILE}rem)`);
    const watchMq = () => {
        if (mq.matches) {
            if (!productsSlider) {
                enableSwiper();
            }
        } else {
            if (productsSlider && productsSlider.length > 1) {
                productsSlider.forEach(slider => {
                    slider.destroy(true, true);
                })
                productsSlider = null;
            } else if (productsSlider && productsSlider.length == 1){
                productsSlider.destroy(true, true);
                productsSlider = null;
            }
          
        }
    }
    watchMq();
    mq.addEventListener('change', watchMq);
}
handleCatalogSlider();


const handleNewCatalogSlider = () => {
    const sliders = document.querySelectorAll('.slider-new-products');
    if (sliders.length > 0){
        const newProductSlider = new Swiper('.slider-new-products', {
            init: true,
            enabled: true,
            watchOverflow: true,
            observer: true,
            observeParents: true,
            speed: 1000,
            slidesPerView: 1,
            slidesPerGroup: 1,
            initialSlide: 0,
            spaceBetween: 30,
            preventInteractionOnTransition: true,
            grabCursor: false,
            slideToClickedSlide: false, // click on slide to move on it
            loop: true,
            pagination: {
                enabled: true,
                el: '.pagination-bullets',
                type: 'bullets',
            },
            autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                waitForTransition: false,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
            },
            breakpoints: {
                767: {
                    slidesPerView: 1,
                },
                992: {
                    slidesPerView: 2,
                },
                1324: {
                    slidesPerView: 3,
                }
            }
        })
    }
}
handleNewCatalogSlider();

const handleProductSlider = () => {
    const sliders = document.querySelectorAll('.thumbs-images');
    if (sliders.length > 0){
        const thumbsSwiper = new Swiper('.images-product__thumbs', {
            init: true,
            enabled: true,
            watchOverflow: true,
            observer: true,
            observeParents: true,
            speed: 1000,
            slidesPerView: 3,
            slidesPerGroup: 1,
            initialSlide: 0,
            spaceBetween: 16,
            breakpoints: {
                1120: {
                    slidesPerView: 4,
                }
            }
        });
        new Swiper('.images-product__slider', {
            init: true,
            enabled: true,
            speed: 1000,
            slidesPerView: 1,
            slidesPerGroup: 1,
            initialSlide: 0,
            spaceBetween: 30,
            preventInteractionOnTransition: true,
            watchOverflow: true,
            observer: true,
            observeParents: true,
            thumbs: {
                swiper:  thumbsSwiper
            }
        });
    }
}
handleProductSlider();


// ------------------------------------ BASE ------------------------------------ //
// init: true,
// enabled: true,
// createElements: true, 
// speed: 700,
// slidesPerView: 3,
// initialSlide: 0,
// spaceBetween: 100,
// preventInteractionOnTransition: false,
// normalizeSlideIndex: true,
// grabCursor: false,
// slideToClickedSlide: false, // click on slide to move on it

    
// ------------------------------------ CENTER ------------------------------------ //
// centeredSlides: true,
// centerInsufficientSlides: true, // when slides less then slidesPerView -> center
// centeredSlidesBounds: true, // required above one / makes centered slide without gaps on left side e.g 2nd slide will be centered by default if all slidesPerView is 3



// ------------------------------------ GROUP ------------------------------------ //
// slidesPerGroup: 1, // slides to scroll
// slidesPerGroupAuto: false, // will skip slideNext & slidePrev | intended to be used only with slidesPerView: 'auto' and slidesPerGroup: 1.
// slidesPerGroupSkip: 2, // first N slides will be treated like single group



// ------------------------------------ LOOP ------------------------------------ //
// loop: false,
// loopAddBlankSlides: true // will add blank slides if number of slides is not even for grid.rows and slidesPerGroup
// loopAdditionalSlides: 1,
// loopPreventsSliding: true,



// ------------------------------------ NAVIGATION ------------------------------------ //
// uniqueNavElements: true, // works on pagination navigation arrwos scrollbar | looks for child elements first 
//
// scrollbar: {
//     el: '.swiper-scrollbar',
//     draggable: true,
// },
//
// navigation: {
//     enabled: true,
//     // nextEl: '' // selector
//     // prevEl: '' // selector
// },
//
// pagination: {
//     el: '.swiper-pagination',
//     type: 'bullets',
//     clickable: true,
// },
//
// thumbs: {
//     swiper: thumbsSwiper // thumb swiper (quantity of sliders must be equal)
// },
//
// controller:{
//     inverse: true,
// }
//
// hashNavigation: {
//     watchState: true, // -> nav using hash data-hash required on slides
//     replaceState: false, // true -> not saving in history (back arrow nav wont work)
// }
//
// history: { // data-history required
//     enabled: true,
//     replaceState: false
// }
//
// autoplay: {
//  delay: 1500,
//  stopOnLastSlide: false,
//  disableOnInteraction: true,
//  reverseDirection: false,
//  waitForTransition: true,
//  pauseOnMouseEnter: false
// },
//
// mousewheel: {
//     invert: false,
// },
//
// keyboard: {
//     enabled: true,
//     onlyInViewport: true,
// },
//
// freeMode: {
//     enabled: true,
//     // sticky: true, // true -> will focus on slide
// }



// ------------------------------------ STRUCTURE ------------------------------------ //
// direction: 'horizontal', // if vertical height on swiper
// watchSlidesProgress: false, // access to  swiper-slide-visible swiper-slide-fully-visible classes
// autoHeight: false,
// oneWayMovement: false,
// rewind: false, // go back to first slide if the last one
// parallax: true,
// updateOnWindowResize: true, // recaculate on window resize
//
// grid: {
//     rows: 2,
// }
//
// slidesOffsetBefore: 150,// add offset to container (before all slides)
// slidesOffsetAfter: 150, // add offset to container (after all slides)
// width: 1500, // useful when init swiper && SSR will make swiper not responsive
// height: 400, // -> force swiper height | ! will set swiper not responsive | useful if init when it's hidden && SSR



// ------------------------------------ EFFECTS ------------------------------------ //
// effect: 'fade',
// fadeEffect: {
//  crossFade:
// }
//
// effect: 'cards',
// cardsEffect: {
//     slideShadows: true,
// },
//
// effect: 'coverflow',
// coverflowEffect: {
//   rotate: 20,
//   slideShadows: false,
// },
//
// effect: 'creative',
// creativeEffect: {
//     prev: {
//     // will set `translateZ(-400px)` on previous slides
//     translate: [0, 0, -750],
//     },
//     next: {
//     // will set `translateX(100%)` on next slides
//     translate: ['150%', 0, 0],
//     },
// },
//
// effect: 'cube', // width and height on swiper 
// cubeEffect: {
//     slideShadows: false,
// },



// ------------------------------------ TOUCH ------------------------------------ //
// touchAngle: 45, // touch angle to slide
// threshold: 5, // threshold in px (swiper wont move if touch distance is lower)
// touchEventsTarget: 'wrapper', // container | wrapper
// touchMoveStopPropagation: false, // ?false
// touchRatio: 1,
// touchReleaseOnEdges: true, // true -> disable touch events on the edges | threshold must be 0
// touchStartForcePreventDefault: false, 
// touchStartPreventDefault: true, //If disabled, pointerdown event won't be prevented
// simulateTouch: true, // swiper will treat mouse events like touch events



// ------------------------------------ SWIPES ------------------------------------ //
// longSwipes: true, // false -> disable longSwipes / moving back to slide
// longSwipesMs: 300, // time needed to disable longSwipes | less then that time long swipes will behave as True
// longSwipesRatio: 0.5,
// shortSwipes: true,
// noSwiping: true, // -> els with noSwipingClass wont swipe
// noSwipingClass: 'swiper-no-swiping', 
// noSwipingSelector: 'selector' // replace for noSwipingClass -> e.g input
// edgeSwipeDetection: true, //  prevent slider when swipe back work e.g go back using swipe on IOS/Android
// edgeSwipeThreshold: 450, // from edge | in px
// nested: false, // for touch events when slider in slider same dir as parent
// followFinger: false, // false -> slider will move only on finger release
// swipeHandler: '.swiper-handler', // ? makes swipe available only on specified class
// resistance: true,
// resistanceRatio: 0.85,
        


// ------------------------------------ ADVANCED ------------------------------------ //
// modules: [],
// lazyPreloadPrevNext: 0, // num of next and prev slides to preload used with data-lazy
// lazyPreloaderClass: 'swiper-lazy-preloader',
// focuableElements: 'input, select, option, textarea, button, video, label' // disable swiper if they are focused
// on: {}, // register events
// onAny(){} // register event listener on all events
// allowSlideNext: true,
// allowSlidePrev: true,
// allowTouchMove: true,
//
// observeParents: false,
// observeSlideChildren: true,
// observer: true, // slider will reinit when children?parents has been changed
//
// breakpoints: { // MB First  '@0.75' - ratio endpoints
//     320: { // >= 320 
//     }
// },
//
// a11y: {
//     nextSlideMessage: 'asd',
//     prevSlideMessage: 'as',
// },
//
// zoom: {
//     maxRatio: 3,
// },



// ------------------------------------ OTHER ------------------------------------ //
// preventClicks: true, // prevent accidental clicks
// preventClicksPropagation: true,
// cssMode: true, // ?
// injectStyles: string[], // -> need for shadow DOM. Only for usage with Swiper Element
// injectStylesUrls: string[],
// eventsPrefix: 'swiper', // prefix for all DOM events emitted by Swiper
// virtual: {
//     slides: ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5'],
// },
// virtualTranslate: false, // ?useful when making custom transition
// watchOverflow: true, // ?
// passiveListeners: true, // improve scrolling perfomance
// maxBackfaceHiddenSlides: 10,
// resizeObserver: true // observe container resize not window
// roundLengths: false // ?blurry def -> false 
// runCallbacksOnInit: true, // Fire Transition/SlideChange/Start/End on init in case initialSlide is not 0
// setWrapperSize: false // true -> to compatibility \w browsers that doesn't support flexbox well
// url: 'string' // ??
// userAgent: 'string' // ??


// const innerSwiper = new Swiper('.share-swiper-inner', {
//     // direction: 'vertical',
//     spaceBetween: 20,
//     nested: true,
// })

