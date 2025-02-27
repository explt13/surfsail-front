import './modules/script.js';
import {initSelects, initQuantityButtons, initRange} from "./modules/forms.js";
import {setClientClasses, setSpoilers, ibg, setTabs, initRatings} from './modules/functions.js'
import {Relocator} from "./modules/relocator.js";


const page = document.body.dataset.page;

const relocator = new Relocator("max");
relocator.init();

setClientClasses();
initSelects();
initQuantityButtons();

if (page === 'auth') {
    const auth = await import('./modules/auth.js');
    auth.initAuth();
}

if (page !== 'auth') {
    setSpoilers();
    ibg();
    setTabs();
    initRatings();
}

if (page === 'main') {
    const sliders = await import("./modules/sliders.js");
    const home = await import('./modules/home.js');

    home.setTippies();
    home.displayBenefitsWhyUsButton();
    sliders.handleMainScreenSlider();
    sliders.handleNewCatalogSlider();
    sliders.handleCatalogSlider();
}

if (page === 'catalog') {
    initRange();
}

if (page === 'product') {
    const zoom = await import("./modules/driftzoom.js");
    const sliders = await import("./modules/sliders.js");
    zoom.initZoom();
    sliders.handleCatalogSlider();
    sliders.handleProductSlider();
}