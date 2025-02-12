

function isIE() {
	let ua = window.navigator.userAgent;
	ua = navigator.userAgent;
	let is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
	return is_ie;
}

if (isIE()) {
	document.querySelector('html').classList.add('ie');
}

function isWebp() {
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
isWebp();

function setIsMobile(isMobile) {
	if (isMobile.any()) {
		document.querySelector('html').classList.add('_touch');
	} else{
		document.querySelector('html').classList.remove('_touch');
	}
}

function checkMobile() {
	let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

	setIsMobile(isMobile);
	window.addEventListener('resize', () => setIsMobile(isMobile));
}
checkMobile();

function ibg() {
	if (isIE()) {
		let ibg = document.querySelectorAll(".ibg");
		for (let i = 0; i < ibg.length; i++) {
			if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
				ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
				ibg[i].querySelector('img').hidden = true;
			}
		}
	}
}
ibg();

// Main function
function initRatings() {
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
initRatings();

// SPOILERS
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
				initSpoilers(spoilersArray, matchMedia);
			});
			initSpoilers(spoilersArray, matchMedia);
		});
	}
	// Initialization
	function initSpoilers(spoilersArray, matchMedia = false) {
		spoilersArray.forEach(spoilersBlock => {
			spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
			if (matchMedia.matches || !matchMedia) {
				spoilersBlock.classList.add('_init');
				initSpoilerBody(spoilersBlock);
				spoilersBlock.addEventListener("click", setSpoilerAction);
			} else {
				spoilersBlock.classList.remove('_init');
				initSpoilerBody(spoilersBlock, false);
				spoilersBlock.removeEventListener("click", setSpoilerAction);
			}
		});
	}
	// Work with content
	function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
		const spoilerTitles = spoilersBlock.querySelectorAll('[data-spoiler]');
		
		if (spoilersBlock.dataset.spoilerOpened) {
			const spoilerOpts = spoilersBlock.dataset.spoilerOpened.split(',');
			// empty value
			if (!spoilerOpts[0]) {
				spoilerTitles.forEach((spoilerTitle) => {
					if (!spoilerTitle.classList.contains('_active')) {
						spoilerTitle.classList.add('_active');	
					}
				});
			} else {
				const type = spoilerOpts[1] ? spoilerOpts[1] : 'max';
				const width = spoilerOpts[0];
				const matchMedia = window.matchMedia(`(${type}-width: ${width}px)`);
				if (matchMedia.matches) {
					spoilerTitles.forEach((spoilerTitle) => {
						if (!spoilerTitle.classList.contains('_active')) {
							spoilerTitle.classList.add('_active');
							spoilerTitle.nextElementSibling.hidden = false;
						}
					});
				}

				matchMedia.addEventListener('change', function () {
					if (matchMedia.matches) {
						spoilerTitles.forEach((spoilerTitle) => {
							if (!spoilerTitle.classList.contains('_active')) {
								spoilerTitle.classList.add('_active');
								spoilerTitle.nextElementSibling.hidden = false;
							}
						});
					} else {
						spoilerTitles.forEach((spoilerTitle) => {
							if (spoilerTitle.classList.contains('_active')) {
								spoilerTitle.classList.remove('_active');
								spoilerTitle.nextElementSibling.hidden = true;
							}
						});
					}
				})
			}
		}

		if (spoilerTitles.length > 0) {
			spoilerTitles.forEach(spoilerTitle => {
				if (hideSpoilerBody && !spoilerTitle.classList.contains('_active')) {
					spoilerTitle.removeAttribute('tabindex');
					spoilerTitle.nextElementSibling.hidden = true;
				} else {
					spoilerTitle.setAttribute('tabindex', '-1');
					spoilerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpoilerAction(e) {
		// spoilerBlock
		const el = e.target;
		if (el.hasAttribute('data-spoiler') || el.closest('[data-spoiler]')) {
			const spoilerTitle = el.hasAttribute('data-spoiler') ? el : el.closest('[data-spoiler]');
			const spoilersBlock = spoilerTitle.closest('[data-spoilers]');
			let time = spoilersBlock.dataset.spoilerTime ? parseInt(spoilersBlock.dataset.spoilerTime) : 500;
			time = spoilerTitle.dataset.spoilerTime ? parseInt(spoilerTitle.dataset.spoilerTime) : time;
			const oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler') ? true : false;
			if (!spoilersBlock.querySelectorAll('._slide').length) {
				if (oneSpoiler && !spoilerTitle.classList.contains('_active')) {
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
		if (target.hidden) {
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
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

function tabs() {
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
tabs();