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
    let req_fields = form.querySelectorAll('._req input');
    const errorEl = document.createElement('span');
    const authContainer = form.closest('.auth__container')
    errorEl.classList.add('_icon-notif_alert');
    errorEl.classList.add('form__field-result');
    errorEl.classList.add('form__field-result_error');
    const successEl = document.createElement('span');
    successEl.classList.add('_icon-notif_success');
    successEl.classList.add('form__field-result');
    successEl.classList.add('form__field-result_success');
    const fieldMap = new Map();
    let errors = 0;
    document.addEventListener('revalidate', function(e){
        req_fields = form.querySelectorAll('._req input');
    })
    
    const _addError = (field, msg, errAcc = true) => {
        const parentNode = field.parentNode;
        const errorElClone = errorEl.cloneNode(true);
        _clearStatus(parentNode);
        if (!parentNode.classList.contains('_error')){
            parentNode.classList.add('_error');
            parentNode.appendChild(errorElClone);
            setTimeout(() => {
                errorElClone.classList.add('_show-up');
                tippy(errorElClone, {
                    content: msg,
                    theme: 'error'
                });
            }, 5);
        }
        if (errAcc) {
            errors++;
        }
    }
    const _addSuccess = (field) => {
        const parentNode = field.parentNode;
        const successElClone = successEl.cloneNode(true);
        _clearStatus(parentNode);
        if (!parentNode.classList.contains('_success')){
            parentNode.classList.add('_success');
            parentNode.appendChild(successElClone);

            setTimeout(() => {
                successElClone.classList.add('_show-up');
            }, 5);
        }
    }
    const _clearStatus = (parentNode) => {
        if (parentNode.classList.contains('_error')){
            parentNode.classList.remove('_error');
            const errorElClone = parentNode.querySelector('.form__field-result_error');
            if (errorElClone){
                errorElClone.classList.remove('_show-up');
                parentNode.removeChild(errorElClone);
            }
        }
        if (parentNode.classList.contains('_success')){
            parentNode.classList.remove('_success');
            const successElClone = parentNode.querySelector('.form__field-result_success');
            if (successElClone){
                successElClone.classList.remove('_show-up');
                parentNode.removeChild(successElClone);
            }
        }
    }


   
    const initFields = () => {
        req_fields.forEach(field => {
            const debouncedValidation = debounce(() => {
                validateField(field);
            }, 500);
        
            field.addEventListener('input', debouncedValidation);
            field.addEventListener('blur', () => {
                validateField(field);
            });
    
            const minlen = parseInt(field.dataset.minlen) || 0;
            const maxlen = parseInt(field.dataset.maxlen) || 0;
            if (minlen + maxlen !== 0){
                fieldMap.set(field, {minlen, maxlen});
            }
            if (field.value){
                validateField(field);
            }

        })
    }

    form.addEventListener('submit', async(e) => {
        errors = 0;
        e.preventDefault();
        req_fields.forEach(field => {
            validateField(field);
        });
        if (errors === 0) {
            const event = new CustomEvent('formValidated');
            form.dispatchEvent(event);
        }
    })

    const validateField = (field) => {
        if (field.hasAttribute('alphanumeric') && !isAlphaNumeric(field.value)) {
            _addError(field, `${field.dataset.name} can contain: a-zA-Z0-9`);
            return;
        }

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
        if (field.type === 'checkbox' && field.checked !== true) {
            _addError(field, 'Field is required');
            return;
        }

        if (field.classList.contains('form__email') || field.type === 'email'){
            if (!validateEmail(field.value)) {
                _addError(field, "Email is not valid");
                return;
            }
        }
;
        if (!authContainer.classList.contains('_login')){
            if (field.classList.contains('form__password')){
                const pswdConfirm = form.querySelector('.form__password-confirm') || form.querySelector('[pswd-confirm]');
                if (pswdConfirm && !fieldsMatch(field, pswdConfirm)) {
                    return;
                }
            }
            if (field.classList.contains('form__password-confirm') || field.hasAttribute('pswd_confirm')) {
                const pswdField = form.querySelector('.form__password');
                if (!fieldsMatch(field, pswdField)) {
                    return;
                }
            }
        }
        
        _addSuccess(field);
    }
    const fieldsMatch = (field, matchTo) => {
        if (field.value !== matchTo.value) {
            _addError(field, "Passwords must match");
            _addError(matchTo, "Passwords must match",false);
            return false
        }
        _addSuccess(matchTo);
        return true;
    }


    initFields();
}

const checkLength = (fieldValue, minlen, maxlen) => {
    return (!minlen || fieldValue.length >= minlen) && (!maxlen || fieldValue.length <= maxlen);
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


function isAlphaNumeric(str) {
    let code, i, len;
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
      }
    }
    return true;
};

validateInit();