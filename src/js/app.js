import './modules/script.js';
import {intiSelects, initQuantityButtons} from "./modules/forms.js";
import {setClientClasses, setSpoilers, ibg, setTabs, initRatings} from './modules/functions.js'
import {Relocator} from "./modules/relocator.js";


const page = document.body.dataset.page;

const relocator = new Relocator("max");
relocator.init();
setClientClasses();
intiSelects();
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

if (page === 'product') {
    const zoom = await import("./modules/driftzoom.js");
    const sliders = await import("./modules/sliders.js");
    zoom.initZoom();
    sliders.handleCatalogSlider();
    sliders.handleProductSlider();
}