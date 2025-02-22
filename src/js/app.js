
import "./modules/forms.js";

import "./modules/tippy.js";
import './modules/script.js';

const page = document.body.dataset.page;

import {DynamicAdapt} from "./modules/dynamic_adapt.js";
const da = new DynamicAdapt("max");
da.init();

const functions = await import('./modules/functions.js')
functions.setClientClasses();


if (page !== 'auth') {
    functions.ibg();
    functions.setSpoilers();
    functions.setTabs();
    functions.initRatings();
}
if (page === 'main') {
    const sliders = await import ("./modules/sliders.js");
    sliders.handleMainScreenSlider();
    sliders.handleNewCatalogSlider();
    sliders.handleCatalogSlider();
}

if (page === 'product') {
    const zoom = await import("./modules/driftzoom.js");
    const sliders = await import ("./modules/sliders.js");
    zoom.initZoom();
    sliders.handleCatalogSlider();
    sliders.handleProductSlider();
}