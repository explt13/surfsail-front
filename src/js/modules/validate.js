import tippy from "tippy.js";


export const validateInit = () => {
    const forms = document.querySelectorAll('.form-validate');
    if (forms.length > 0) {
        forms.forEach(form => {
            validateForm(form);
        })
    }
}

const createErrorEl = () => {
    const errorEl = document.createElement('span');
    errorEl.classList.add('_icon-notif_alert');
    errorEl.classList.add('form__field-result');
    errorEl.classList.add('form__field-result_error');
    return errorEl;
}

const createSuccessEl = () => {
    const successEl = document.createElement('span');
    successEl.classList.add('_icon-notif_success');
    successEl.classList.add('form__field-result');
    successEl.classList.add('form__field-result_success');
    return successEl;
}

const addError = (field, errorEl, msg, errors, errAcc = true) => {
    const parentNode = field.parentNode;
    const errorElClone = errorEl.cloneNode(true);
    clearAlertStatus(parentNode);
    if (!parentNode.classList.contains('_error')){
        parentNode.classList.add('_error');
        parentNode.appendChild(errorElClone);
        setTimeout(() => {
            errorElClone.classList.add('_show-up');
            const tooltip = tippy(errorElClone, {
                content: msg,
                theme: 'error',
            });
            errorElClone.addEventListener("touchstart", (e) => {
                e.stopPropagation();
                tooltip.show();
            });
        }, 5);
    }
    if (errAcc) {
        errors++;
    }
}

const addSuccess = (field, successEl) => {
    const parentNode = field.parentNode;
    const successElClone = successEl.cloneNode(true);
    clearAlertStatus(parentNode);
    if (!parentNode.classList.contains('_success')){
        parentNode.classList.add('_success');
        parentNode.appendChild(successElClone);

        setTimeout(() => {
            successElClone.classList.add('_show-up');
        }, 5);
    }
}

const clearAlertStatus = (parentNode) => {
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

const validateForm = (form) => {
    let req_fields = form.querySelectorAll('.form__field._req:not([hidden]) input');
    const errorEl = createErrorEl();
    const successEl = createSuccessEl();

    const fieldMap = new Map();
    let errors = 0;

    document.addEventListener('revalidate', function(e){
        req_fields = form.querySelectorAll('.form__field._req:not([hidden]) input');
    })
    const debouncedValidateField = debounce(validateField, 500);
    
    const initFieldsValidation = () => {
        req_fields.forEach(field => {
            field.addEventListener('input', function () {debouncedValidateField(form, field, fieldMap, successEl, errorEl, errors)});
            field.addEventListener('blur', () => {
                validateField(form, field, fieldMap, successEl, errorEl, errors);
            });
    
            const minlen = parseInt(field.dataset.minlen) || 0;
            const maxlen = parseInt(field.dataset.maxlen) || 0;
            if (minlen + maxlen !== 0){
                fieldMap.set(field, {minlen, maxlen});
            }
            if (field.value){
                validateField(form, field, fieldMap, successEl, errorEl, errors);
            }

        })
    }

    initFieldsValidation();
    registerSubmitForm(form, errors, req_fields);
}

const registerSubmitForm = (form, errors, req_fields) => {
    form.addEventListener('submit', async(e) => {
        errors = 0;
        e.preventDefault();
        req_fields.forEach(field => {
            validateField(form, field, fieldMap, successEl, errorEl, errors);
        });
        if (errors === 0) {
            const event = new CustomEvent('formValidated');
            form.dispatchEvent(event);
        }
    })
}

const validateField = (form, field, fieldMap, successEl, errorEl, errors) => {
    if (field.hasAttribute('alphanumeric') && !isAlphaNumeric(field.value)) {
        addError(field, errorEl, `${field.dataset.name} can contain: a-zA-Z0-9`, errors);
        return;
    }

    const fieldVals = fieldMap.get(field);
    if (fieldVals){
        const minlen = parseInt(fieldVals.minlen);
        const maxlen = parseInt(fieldVals.maxlen);
        const fieldName = field.dataset.name;
    
        const HAS_MINLEN = minlen > 0 ? 2 : 0;
        const HAS_MAXLEN = maxlen > 0 ? 1 : 0;
        const R_VAL = HAS_MINLEN | HAS_MAXLEN;
        
        if (!checkLength(field.value, minlen, maxlen)){
            switch (R_VAL) {
                case 0b11:
                    addError(field, errorEl, `${fieldName} must be between ${minlen} and ${maxlen} characters`, errors);
                    break;
                case 0b10:
                    addError(field, errorEl, `${fieldName} must be at least ${minlen} characters`, errors);
                    break;
                case 0b01: 
                    addError(field, errorEl, `${fieldName} must be fewer than ${maxlen} characters`, errors);
                    break;
                default:
                    break;
            }
            return;
        }
    }
    if (field.type === 'checkbox' && field.checked !== true) {
        addError(field, errorEl, 'Field is required', errors);
        return;
    }

    if (field.classList.contains('form__email') || field.type === 'email'){
        if (!validateEmail(field.value)) {
            addError(field, errorEl, "Email is not valid", errors);
            return;
        }
    }
    const authBody = form.closest('.auth__body');
    if (!authBody.classList.contains('_login')){
        if (field.classList.contains('form__password')){
            const pswdConfirm = form.querySelector('.form__password-confirm') || form.querySelector('[pswd-confirm]');
            if (pswdConfirm && !fieldsMatch(field, successEl, errorEl, errors, pswdConfirm)) {
                return;
            }
        }
        if (field.classList.contains('form__password-confirm') || field.hasAttribute('pswd_confirm')) {
            const pswdField = form.querySelector('.form__password');
            if (!fieldsMatch(field, successEl, errorEl, errors, pswdField)) {
                return;
            }
        }
    }
    
    addSuccess(field, successEl);
}

const fieldsMatch = (field, successEl, errorEl, errors,matchTo) => {
    if (field.value !== matchTo.value) {
        addError(field, errorEl, "Passwords must match", errors);
        addError(matchTo, errorEl, "Passwords must match", errors, false);
        return false
    }
    addSuccess(matchTo, successEl);
    return true;
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