import tippy from "tippy.js";

const validateInit = () => {
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
        forms.forEach(form => {
            validateForm(form);
        })
    }
}


const validateForm = (form) => {
    const isAjax = form.getAttribute('data-ajax');

    const fields = form.querySelectorAll('input:not([type="checkbox"])');
    const errorEl = document.createElement('span');
    errorEl.classList.add('_icon-notif_alert');
    errorEl.classList.add('form__field-result');
    errorEl.classList.add('form__field-result_error');
    const successEl = document.createElement('span');
    successEl.classList.add('_icon-notif_success');
    successEl.classList.add('form__field-result');
    successEl.classList.add('form__field-result_success');

    let errors = 0;
    
    const _addError = (field, msg) => {
        const fieldParent = field.parentNode;
        const errorElClone = errorEl.cloneNode(true);
        if (!fieldParent.classList.contains('_error')){
            fieldParent.classList.add('_error');
            fieldParent.appendChild(errorElClone);
            setTimeout(() => {
                errorElClone.classList.add('_show-up');
                tippy(errorElClone, {
                    content: msg,
                    theme: 'error'
                });
            }, 5);
        }
        errors++;
    }
    const _addSuccess = (field) => {
        const fieldParent = field.parentNode;
        const successElClone = successEl.cloneNode(true);
        if (!fieldParent.classList.contains('_success')){

            fieldParent.classList.add('_success');
            fieldParent.appendChild(successElClone);

            setTimeout(() => {
                successElClone.classList.add('_show-up');
            }, 5);
        }
    }
    const _clearStatus = (field) => {
        const fieldParent = field.parentNode;
        if (fieldParent.classList.contains('_error')){
            fieldParent.classList.remove('_error');
            const errorElClone = fieldParent.querySelector('.form__field-result_error');
            if (errorElClone){
                errorElClone.classList.remove('_show-up');
            }
            
            setTimeout(() => {
                fieldParent.removeChild(errorElClone);
            }, 100);
        }
        if (fieldParent.classList.contains('_success')){
            fieldParent.classList.remove('_success');
            const successElClone = fieldParent.querySelector('.form__field-result_success');
            if (successElClone){
                successElClone.classList.remove('_show-up');
            }
            
            setTimeout(() => {
                fieldParent.removeChild(successElClone);
            }, 100);
        }
    }


    const fieldMap = new Map();
    fields.forEach(field => {
        const debouncedValidation = debounce(() => {
            _clearStatus(field);
            validateField(field);
        }, 500);
    
        field.addEventListener('keyup', debouncedValidation);

        const minlen = parseInt(field.dataset.minlen) || 0;
        const maxlen = parseInt(field.dataset.maxlen) || 0;
        if (minlen + maxlen !== 0){
            fieldMap.set(field, {minlen, maxlen});
        }
    })


    form.addEventListener('submit', async(e) => {
        e.preventDefault();
        fields.forEach(field => {
            validateField(field);
        });

        if (errors === 0){
            
        }
        errors = 0;
        
    })


    const validateField = (field) => {
        const fieldVals = fieldMap.get(field);
        if (fieldVals){
            const minlen = parseInt(fieldVals.minlen);
            const maxlen = parseInt(fieldVals.maxlen);
            const fieldAb = field.dataset.name;
        
            const HAS_MINLEN = minlen > 0 ? 2 : 0;
            const HAS_MAXLEN = maxlen > 0 ? 1 : 0;
            const R_VAL = HAS_MINLEN | HAS_MAXLEN;
            
            if (!checkLength(field.value, minlen, maxlen)){
                switch (R_VAL) {
                    case 0b11:
                        _addError(field, `${fieldAb} must be between ${minlen} and ${maxlen} characters`);
                        break;
                    case 0b10:
                        _addError(field, `${fieldAb} must be at least ${minlen} characters`);
                        break;
                    case 0b01: 
                        _addError(field, `${fieldAb} must be fewer than ${maxlen} characters`);
                        break;
                    default:
                        break;
                }
                return;
            }
        }

        if (field.classList.contains('form__email')){
            if (!validateEmail(field.value)) {
                _addError(field, "Email is not valid");
                return;
            }
        }
        if (field.classList.contains('form__password') || field.classList.contains('form__password-confirm')){
            const isFieldConfirm = field.dataset.for;
            if (isFieldConfirm){
                const passwordField = field.closest('form').querySelector(`#${field.dataset.for}`);
                if (passwordField.value !== field.value) {
                    _addError(field, "Passwords must match");
                    _addError(passwordField, "Passwords must match");
                    return;
                } else {
                    _clearStatus(passwordField)
                    _addSuccess(passwordField);
                }
            } else{
                const confirmField = field.closest('form').querySelector(`[data-for="${field.id}"]`);
                if (field.value !== confirmField.value) {
                    _addError(field, "Passwords must match");
                    _addError(confirmField, "Passwords must match");
                    return;
                } else {
                    _clearStatus(passwordField)
                    _addSuccess(confirmField);
                }
            }
            
        }

        _addSuccess(field);
    }
}

const checkLength = (value, minlen, maxlen) => {
    return (!minlen || value.length >= minlen) && (!maxlen || value.length <= maxlen);
}

const validateEmail = (email) => {
    return String(email).match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}


validateInit();