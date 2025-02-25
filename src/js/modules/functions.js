

function setIsIE() {
    let ua = window.navigator.userAgent;
    ua = navigator.userAgent;
    let is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    if (is_ie) {
        document.documentElement.classList.add('ie');
    }
}

function setIsWebp() {
    function testWebP(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
        
    testWebP(function (support) { 
        if (support == true) {
            document.querySelector('html').classList.add('webp');
        }else{
            document.querySelector('html').classList.add('no-webp');
        }
    });
}

function setIsMobileClass(isMobile) {
    if (isMobile.any()) {
        document.querySelector('html').classList.add('_touch');
    } else{
        document.querySelector('html').classList.remove('_touch');
    }
}

function setIsMobile() {
    const isMobile = {
        Android: function () { return navigator.userAgent.match(/Android/i); },
        BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
        iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
        Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
        Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
        any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
    };

    setIsMobileClass(isMobile);
    window.addEventListener('resize', () => setIsMobileClass(isMobile));
}

export function setClientClasses() {
    setIsIE();
    setIsWebp();
    setIsMobile();
}

export function ibg() {
    if (document.documentElement.classList.contains('ie')) {
        let ibg = document.querySelectorAll(".ibg");
        ibg.forEach(el => {
            if (el.querySelector('img') && el.querySelector('img').getAttribute('src') != null) {
                el.style.backgroundImage = 'url(' + el.querySelector('img').getAttribute('src') + ')';
                el.querySelector('img').hidden = true;
            }
        });
    }
}

// Main function
export function initRatings() {
    const ratings = document.querySelectorAll('.rating');
    if (ratings.length === 0) return;


    for (let index = 0; index < ratings.length; index++) {
        const rating = ratings[index];
        initRating(rating);
    }

    // Init specific rating
    function initRating(rating) {
        const ratingActive = rating.querySelector('.rating__active');
        const ratingValue = rating.querySelector('.rating__value');
        // initRatingVars(rating);

        setRatingActiveWidth(ratingActive, ratingValue.innerHTML);

        if (rating.classList.contains('rating_set')) {
            setRating(rating, ratingActive, ratingValue);
        }
    }

    // Change width of active stars
    function setRatingActiveWidth(ratingActive, value) {
        const ratingActiveWidth = value / 0.05;
        ratingActive.style.width = `${ratingActiveWidth}%`;
    }
    
    // Set rating
    function setRating(rating, ratingActive, ratingValue) {
        const ratingItems = rating.querySelectorAll('.rating__item');
        for (let index = 0; index < ratingItems.length; index++) {
            const ratingItem = ratingItems[index];
            ratingItem.addEventListener("mouseenter", function (e) {
                setRatingActiveWidth(ratingActive, ratingItem.value);
            });
            ratingItem.addEventListener("mouseleave", function (e) {
                setRatingActiveWidth(ratingActive, ratingValue.innerHTML);
            });
            ratingItem.addEventListener("click", function (e) {
                rating.classList.add('rating_sending');
                const ratingSetEvent = new CustomEvent('ratingSet', {detail: {ratingValue: ratingItem.value, addEventTo: rating, eventName: 'successfulySet'}});
                document.dispatchEvent(ratingSetEvent);
            });

            rating.addEventListener('successfulySet', function(e) {
                const newRating = e.ratingValue;
                ratingValue.innerHTML = newRating;
                setRatingActiveWidth();
                rating.classList.remove('rating_sending');

            })
        }
    }
}

// SPOILERS
export function setSpoilers () {
    const spoilersArray = document.querySelectorAll('[data-spoilers]');
    if (spoilersArray.length > 0) {
        // Getting Spoilers
        const spoilersRegular = Array.from(spoilersArray).filter(function (item, index, self) {
            return !item.dataset.spoilers.split(",")[0];
        });
        // Init spoilers
        if (spoilersRegular.length > 0) {
            initSpoilers(spoilersRegular);
        }
    
        // Getting MQ Spoilers
        const spoilersMedia = Array.from(spoilersArray).filter(function (item, index, self) {
            return item.dataset.spoilers.split(",")[0];
        });
    
        // Init MQ spoilers
        if (spoilersMedia.length > 0) {
            const breakpointsArray = [];
            spoilersMedia.forEach(item => {
                const params = item.dataset.spoilers;
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });
    
            // Getting breakpoints
            let mediaQueries = breakpointsArray.map(function (item) {
                return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
            });
            mediaQueries = mediaQueries.filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });
    
            // Loop through each breakpoint
            mediaQueries.forEach(breakpoint => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);
    
                // Objects
                const spoilersArray = breakpointsArray.filter(function (item) {
                    if (item.value === mediaBreakpoint && item.type === mediaType) {
                        return true;
                    }
                });
                // Event
                matchMedia.addEventListener('change', function () {
                    initSpoilers(spoilersArray, matchMedia, false);
                });
                initSpoilers(spoilersArray, matchMedia);
            });
        }
        // Initialization
        function initSpoilers(spoilersArray, matchMedia = false, isInit = true) {
            spoilersArray.forEach(spoilersBlock => {
                spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
                // if match media matches or not specified
                if (matchMedia.matches || !matchMedia) {
                    spoilersBlock.classList.add('_init');
                    initSpoilerBody(spoilersBlock, false, isInit);
                    spoilersBlock.addEventListener("click", setSpoilerAction);
                } else {
                    spoilersBlock.classList.remove('_init');
                    initSpoilerBody(spoilersBlock, true, isInit);
                    spoilersBlock.removeEventListener("click", setSpoilerAction);
                }
            });
        }
        // Work with content
        function initSpoilerBody(spoilersBlock, breakSpoiler, isInit) {
            const spoilerTitles = [...spoilersBlock.querySelectorAll('[data-spoiler]')].filter(title => title.closest('[data-spoilers]') === spoilersBlock);
            // if slider is broken (only if breakpoint specified data-spoilers=[breakpoint,type] and breakpoint does NOT match), unset focus and show content
            if (breakSpoiler) {
                spoilerTitles.forEach(spoilerTitle => {
                    spoilerTitle.setAttribute('tabindex', '-1');
                    spoilerTitle.nextElementSibling.hidden = false;
                })
                return;
            }

            spoilerTitles.forEach(spoilerTitle => {
                spoilerTitle.setAttribute('tabindex', '0');
            })
            
            // by default spoilers are hidden
            if (!spoilersBlock.hasAttribute('data-spoiler-opened')) {
                spoilerTitles.forEach(spoilerTitle => {
                    // if no content element return
                    if (!spoilerTitle.nextElementSibling) return;
                    
                    // if title is active don't hide content
                    if (spoilerTitle.classList.contains('_active')) return;
                    
                    // hide content by default (assuming no [data-spoiler-opened] is set)
                    spoilerTitle.nextElementSibling.hidden = true;
                });
                return;
            }

            // spoilers have data-spoiler-opened at this point

            // extract options from data-spoiler-opened attribute
            const spoilerOpts = spoilersBlock.dataset.spoilerOpened.split(',');
            const type = spoilerOpts[1] ? spoilerOpts[1] : 'max';
            const width = spoilerOpts[0];
            let matchMedia = null;
            if (width && type) {
                matchMedia = window.matchMedia(`(${type}-width: ${width/16}em)`);
            }

            // If it's the first initialization, open spoilers based on the mode
            if (isInit) {
                // If only one spoiler should be open, activate the first one only
                if (spoilersBlock.hasAttribute('data-spoiler-single')) {
                    spoilerTitles[0].classList.add('_active');
                    spoilerTitles[0].nextElementSibling.hidden = false;
                } else {
                    spoilerTitles.forEach((spoilerTitle) => {
                        // if matchMedia is NOT specified or media DOES match open all spoilers, if not matchMedia matches - hide
                        if (!matchMedia || matchMedia.matches) {
                            spoilerTitle.classList.add('_active');
                            spoilerTitle.nextElementSibling.hidden = false;
                        } else {
                            spoilerTitle.nextElementSibling.hidden = true;
                        }
                    });
                }
                if (!matchMedia) return;
                matchMedia.addEventListener('change', function() {
                    if (matchMedia.matches) {
                        spoilerTitles.forEach((spoilerTitle) => {
                            spoilerTitle.classList.add('_active');
                            spoilerTitle.nextElementSibling.hidden = false;
                        });
                    } else {
                        spoilerTitles.forEach((spoilerTitle) => {
                            spoilerTitle.classList.remove('_active');
                            spoilerTitle.nextElementSibling.hidden = true;
                        });
                    }
                })
            }

            // if not media query specified for data-spoiler-opened
            if (!matchMedia) {
                spoilerTitles.forEach((spoilerTitle) => {
                    // if element was closed leave it hidden
                    if (!spoilerTitle.classList.contains('_active')) {
                        spoilerTitle.nextElementSibling.hidden = true;
                    }
                });
                return;
            }


            if (matchMedia.matches) {
                spoilerTitles.forEach((spoilerTitle) => {
                    if (!spoilerTitle.classList.contains('_active')) {
                        spoilerTitle.nextElementSibling.hidden = true;
                        return;
                    };
                });
            } else {
                spoilerTitles.forEach((spoilerTitle) => {
                    spoilerTitle.classList.remove('_active');

                });
            }
        }

        function setSpoilerAction(e) {
            // e.currentTarget is a spoilerBlock
            const el = e.target;
            if ((el.hasAttribute('data-spoiler') || el.closest('[data-spoiler]')) && el.closest('[data-spoilers]') === e.currentTarget) {
                const spoilerTitle = el.hasAttribute('data-spoiler') ? el : el.closest('[data-spoiler]');
                const spoilersBlock = spoilerTitle.closest('[data-spoilers]');
                let time = spoilersBlock.dataset.spoilerTime ? parseInt(spoilersBlock.dataset.spoilerTime) : 500;
                time = spoilerTitle.dataset.spoilerTime ? parseInt(spoilerTitle.dataset.spoilerTime) : time;
                const singleSpoiler = spoilersBlock.hasAttribute('data-spoiler-single') ? true : false;
                if (!spoilersBlock.querySelectorAll('._slide').length) {
                    if (singleSpoiler && !spoilerTitle.classList.contains('_active')) {
                        hideSpoilersBody(spoilersBlock, time);
                    }
                    spoilerTitle.classList.toggle('_active');
                    _slideToggle(spoilerTitle.nextElementSibling, time);
                }
                e.preventDefault();
            }
        }
        function hideSpoilersBody(spoilersBlock, time) {
            const spoilerActiveTitle = spoilersBlock.querySelector('[data-spoiler]._active');
            if (spoilerActiveTitle) {
                spoilerActiveTitle.classList.remove('_active');
                _slideUp(spoilerActiveTitle.nextElementSibling, time);
            }
        }
    }
    
}

export const _slideUp = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding' ;
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }
}

export const _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if (target.hidden === true) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }
}

export const _slideToggle = (target, duration = 500) => {
    if (target.hidden === true) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}

export function setTabs() {
    let tabs = document.querySelectorAll("._tabs");
    for (let index = 0, tabs_length = tabs.length; index < tabs_length; index++) {
        let tab = tabs[index];
        let tabs_items = tab.querySelectorAll("._tabs-item");
        let tabs_blocks = tab.querySelectorAll("._tabs-block");
        for (let index = 0, tabs_item_length = tabs_items.length; index < tabs_item_length; index++) {
            let tabs_item = tabs_items[index];
            tabs_item.addEventListener("click", function (e) {
                for (let index = 0, opened_tabs_length = tabs_items.length; index < opened_tabs_length; index++) {
                    let tabs_item = tabs_items[index];
                    tabs_item.classList.remove('_active');
                    tabs_blocks[index].classList.remove('_active');
                }
                tabs_item.classList.add('_active');
                tabs_blocks[index].classList.add('_active');
                e.preventDefault();
            });
        }
    }
}