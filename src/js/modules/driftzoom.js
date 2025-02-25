import Drift from "drift-zoom";

const mql = matchMedia(`(max-width: ${991 / 16}em)`);

const imgs = document.querySelectorAll(".images-product__show-image img");
const pane = document.querySelector('.zoom-pane');
const paneContainer = document.querySelector('.zoom-pane__container');
const imageContainer = document.querySelector(".images-product__show-image.show-image");

const showPane = () => {
    pane.hidden = false;
}

const hidePane = (img) => {
    const timeid = setTimeout(() => {
        pane.hidden = true;
    }, 150);
    img.addEventListener('mouseenter', function(){
        clearTimeout(timeid);
    })
}
const initPictureZoom = (img) => {
    let zoom = new Drift(img, {
        onShow: showPane,
        onHide: () => hidePane(img),
        paneContainer:  paneContainer,
        zoomFactor: 2,
        hoverBoundingBox: true,
        showWhitespaceAtEdges: false,
        handleTouch: true,

        inlinePane: 991,
        containInline: true,
        touchDelay: 150,
    });
}


const measurePaneSize = () => {
    if (mql.matches) {
        if (document.querySelector('.zoom-pane') !== null) {
            document.querySelector(".images-product").removeChild(document.querySelector('.images-product .zoom-pane'));
        }
    } else {
        if (document.querySelector('.zoom-pane') === null) {
            document.querySelector(".images-product").appendChild(pane);
        }
    }
    const height = imageContainer.offsetHeight;
    const width = imageContainer.offsetWidth;
    pane.style.height = height + 'px';
    pane.style.width = width + 'px';
    
}

export const initZoom = () => {
    if (imgs.length > 0) {
        measurePaneSize();
        imgs.forEach(img => {
            initPictureZoom(img);
        });
        window.addEventListener('resize', () => {
            measurePaneSize();
        })
        
    }
}
initZoom();