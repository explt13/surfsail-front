//let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
import {_slideToggle, _slideUp, _slideDown} from './functions.js'


export function initFormValidation() {
	let forms = document.querySelectorAll('._form_validate_v0');
	if (forms.length > 0) {
		for (let index = 0; index < forms.length; index++) {
			const el = forms[index];
			el.addEventListener('submit', form_submit);
		}
	}
}

async function form_submit(e) {
	let btn = e.target;
	let form = btn.closest('form');
	let error = form_validate(form);
	console.log(error);
	if (error == 0) {
		let formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
		let formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
		const message = form.getAttribute('data-message');
		const ajax = form.getAttribute('data-ajax');

		//SendForm
		if (ajax) {
			e.preventDefault();
			let formData = new FormData(form);
			form.classList.add('_sending');
			let response = await fetch(formAction, {
				method: formMethod,
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				form.classList.remove('_sending');
				if (message) {
					popup_open(message + '-message');
				}
				form_clean(form);
			} else {
				alert("Ошибка");
				form.classList.remove('_sending');
			}
		}
		// If test
		if (form.hasAttribute('data-test')) {
			e.preventDefault();
			if (message) {
				popup_open(message + '-message');
			}
			form_clean(form);
		}
	} else {
		let form_error = form.querySelectorAll('._error');
		if (form_error && form.classList.contains('_goto-error')) {
			_goto(form_error[0], 1000, 50);
		}
		e.preventDefault();
	}
}
function form_validate(form) {
	let error = 0;
	let form_req = form.querySelectorAll('._req');
	if (form_req.length > 0) {
		for (let index = 0; index < form_req.length; index++) {
			const el = form_req[index];
			if (!_is_hidden(el)) {
				error += form_validate_input(el);
			}
		}
	}
	return error;
}
function form_validate_input(input) {
	let error = 0;
	let input_g_value = input.getAttribute('data-value');

	if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
		if (input.value != input_g_value) {
			let em = input.value.replace(" ", "");
			input.value = em;
		}
		if (email_test(input) || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	} else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
		form_add_error(input);
		error++;
	} else {
		if (input.value == '' || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	}
	return error;
}
function form_add_error(input) {
	input.classList.add('_error');
	input.parentElement.classList.add('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
	let input_error_text = input.getAttribute('data-error');
	if (input_error_text && input_error_text != '') {
		input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
	}
}
function form_remove_error(input) {
	input.classList.remove('_error');
	input.parentElement.classList.remove('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
}
function form_clean(form) {
	let inputs = form.querySelectorAll('input,textarea');
	for (let index = 0; index < inputs.length; index++) {
		const el = inputs[index];
		el.parentElement.classList.remove('_focus');
		el.classList.remove('_focus');
		el.value = el.getAttribute('data-value');
	}
	let checkboxes = form.querySelectorAll('.checkbox__input');
	if (checkboxes.length > 0) {
		for (let index = 0; index < checkboxes.length; index++) {
			const checkbox = checkboxes[index];
			checkbox.checked = false;
		}
	}
	const selects = form.querySelectorAll('select');
	if (selects.length > 0) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_default_value = select.getAttribute('data-default');
			select.value = select_default_value;
			select_item(select);
		}
	}
}
function email_test(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}
function _is_hidden(el) {
	return (el.offsetParent === null)
}

//viewPass
export const setViewPassword = () => {
	const viewPasswordEls = document.querySelectorAll('input[type="password"][data-viewable]');	
	viewPasswordEls.forEach(passwordEl => {
		const showIcon = document.createElement('button');
        showIcon.innerHTML = "&#128065;";
        showIcon.classList.add("show-pass");
		showIcon.title = 'Show password';
		passwordEl.insertAdjacentElement("afterend", showIcon);
		showIcon.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			const isPassword = passwordEl.type === 'password' ? true : false;
			passwordEl.type = isPassword ? 'text' : 'password';
			showIcon.title = isPassword ? 'Show password' : 'Hide password';
			showIcon.classList.toggle('_display', isPassword);
		})
	})
}

// set minifying placeholders
export const setPlaceholders = () => {
    const fields = document.querySelectorAll('.form__field:has(input:not([type="checkbox"]))');
    fields.forEach(field => {
        const input = field.querySelector('input');
        if (input.value.length > 0) {
            if (!field.classList.contains('_minimize-placeholder')) {
                field.classList.add('_minimize-placeholder');
            }
        }
        field.setAttribute('data-placeholder', input.placeholder ?? '');
        input.addEventListener('focusin', function() {
            if (!field.classList.contains('_minimize-placeholder')) {
                field.classList.add('_minimize-placeholder');
            }
        });
        input.addEventListener('focusout', function() {
            if (input.value.length > 0) return;
            if (field.classList.contains('_minimize-placeholder')) {
                field.classList.remove('_minimize-placeholder');
            }
        });
    });
}

//Select
export function intiSelects () {
	let selects = document.getElementsByTagName('select');
	if (selects.length > 0) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			select_init(select);
		}
		//select_callback();
		document.addEventListener('click', function (e) {
			selects_close(e);
		});
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') {
				selects_close(e);
			}
		});
	}
	
}

function selects_close(e) {
	const selects = document.querySelectorAll('.select');
	if (!e.target.closest('.select') && !e.target.classList.contains('_option')) {
		selects.forEach(function(select) {
			const select_body_options = select.querySelector('.select__options');
			select.classList.remove('_active');
			_slideUp(select_body_options, 100);
		})
	}
}
function select_init(select) {
	const select_parent = select.parentElement;
	const select_modificator = select.getAttribute('class');
	const select_selected_option = select.querySelector('option:checked');
	select.setAttribute('data-default', select_selected_option.value);
	select.style.display = 'none';

	select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modificator + '"></div>');

	let new_select = select.parentElement.querySelector('.select');
	new_select.appendChild(select);
	select_item(select);
}
function select_item(select) {
	const select_parent = select.parentElement;
	const select_items = select_parent.querySelector('.select__item');
	const select_options = select.querySelectorAll('option');
	const select_selected_option = select.querySelector('option:checked');
	const select_selected_text = select_selected_option.text;
	const select_type = select.getAttribute('data-type');

	if (select_items) {
		select_items.remove();
	}

	let select_type_content = '';
	if (select_type == 'input') {
		select_type_content = '<div class="select__value _ipl-after _icon-arrow_sh_d"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Error" data-value="' + select_selected_text + '" class="select__input"></div>';
	} else {
		select_type_content = '<div class="select__value _ipl-after _icon-arrow_sh_d"><span>' + select_selected_text + '</span></div>';
	}

	select_parent.insertAdjacentHTML('beforeend',
		'<div class="select__item">' +
		'<button class="select__title">' + select_type_content + '</button>' +
		'<div hidden class="select__options">' + select_get_options(select_options) + '</div>' +
		'</div></div>');

	select_actions(select, select_parent);
}
function select_actions(original, select) {
	const select_item = select.querySelector('.select__item');
	const selectTitle = select.querySelector('.select__title');
	const select_body_options = select.querySelector('.select__options');
	const select_options = select.querySelectorAll('.select__option');
	const select_type = original.getAttribute('data-type');
	const select_input = select.querySelector('.select__input');

	selectTitle.addEventListener('click', function (e) {
		selectItemActions();
	});

	function selectMultiItems() {
		let selectedOptions = select.querySelectorAll('.select__option');
		let originalOptions = original.querySelectorAll('option');
		let selectedOptionsText = [];
		for (let index = 0; index < selectedOptions.length; index++) {
			const selectedOption = selectedOptions[index];
			originalOptions[index].removeAttribute('selected');
			if (selectedOption.classList.contains('_selected')) {
				const selectOptionText = selectedOption.innerHTML;
				selectedOptionsText.push(selectOptionText);
				originalOptions[index].setAttribute('selected', 'selected');
			}
		}
		select.querySelector('.select__value').innerHTML = '<span>' + selectedOptionsText + '</span>';
	}
	function selectItemActions(type) {
		if (!type) {
			let selects = document.querySelectorAll('.select');
			for (let index = 0; index < selects.length; index++) {
				const select = selects[index];
				const select_body_options = select.querySelector('.select__options');
				if (select != select_item.closest('.select')) {
					select.classList.remove('_active');
					_slideUp(select_body_options, 100);
				}
			}
			_slideToggle(select_body_options, 100);
			select.classList.toggle('_active');
		}
	}
	for (let index = 0; index < select_options.length; index++) {
		const select_option = select_options[index];
		const select_option_value = select_option.getAttribute('data-value');
		const select_option_text = select_option.innerHTML;

		if (select_type == 'input') {
			select_input.addEventListener('keyup', select_search);
		} else {
			if (select_option.getAttribute('data-value') == original.value && !original.hasAttribute('multiple')) {
				select_option.style.display = 'none';
			}
		}
		select_option.addEventListener('click', function () {
			for (let index = 0; index < select_options.length; index++) {
				const el = select_options[index];
				el.style.display = 'block';
			}
			if (select_type == 'input') {
				select_input.value = select_option_text;
				original.value = select_option_value;
			} else {
				if (original.hasAttribute('multiple')) {
					select_option.classList.toggle('_selected');
					selectMultiItems();
				} else {
					select.querySelector('.select__value').innerHTML = '<span>' + select_option_text + '</span>';
					original.value = select_option_value;
					select_option.style.display = 'none';
				}
			}
			let type;
			if (original.hasAttribute('multiple')) {
				type = 'multiple';
			}
			selectItemActions(type);
		});
	}
}
function select_get_options(select_options) {
	if (select_options) {
		let select_options_content = '';
		for (let index = 0; index < select_options.length; index++) {
			const select_option = select_options[index];
			const select_option_value = select_option.value;
			if (select_option_value != '') {
				const select_option_text = select_option.innerHTML;
				select_options_content = select_options_content + '<button data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</button>';
			}
		}
		return select_options_content;
	}
}
function select_search(e) {
	let select_block = e.target.closest('.select ').querySelector('.select__options');
	let select_options = e.target.closest('.select ').querySelectorAll('.select__option');
	let select_search_text = e.target.value.toUpperCase();

	for (let i = 0; i < select_options.length; i++) {
		let select_option = select_options[i];
		let select_txt_value = select_option.textContent || select_option.innerText;
		if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
			select_option.style.display = "";
		} else {
			select_option.style.display = "none";
		}
	}
}
function selects_update_all() {
	let selects = document.querySelectorAll('select');
	if (selects) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			select_item(select);
		}
	}
}

//QUANTITY
export function initQuantityButtons() {
	let quantityButtons = document.querySelectorAll('.quantity__button');
	if (quantityButtons.length > 0) {
		for (let index = 0; index < quantityButtons.length; index++) {
			const quantityButton = quantityButtons[index];
			quantityButton.addEventListener("click", function (e) {
				let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
				if (quantityButton.classList.contains('quantity__button_plus')) {
					value++;
				} else {
					value = value - 1;
					if (value < 1) {
						value = 1
					}
				}
				quantityButton.closest('.quantity').querySelector('input').value = value;
			});
		}
	}
}



//RANGE
import * as noUiSlider from 'nouislider';
import wNumb from 'wnumb';
const initRange = () => {
	const rangeItems = document.querySelectorAll('[data-range]');

	if (rangeItems.length > 0){
		rangeItems.forEach(rangeItem => {
			const fromValue = rangeItem.querySelector('[data-range-from]');
			const toValue = rangeItem.querySelector('[data-range-to]');
			const item = rangeItem.querySelector('[data-range-item]');
			const inputs = [fromValue, toValue];
			noUiSlider.create(item, {
				start: [Number(fromValue.value), Number(toValue.value)],
				connect: true,
				tooltips: [true, true],
				range: {
					'min': [Number(fromValue.dataset.rangeFrom)],
					'max': [Number(toValue.dataset.rangeTo)]
				},
				format: wNumb({
					decimals: 0, // default is 2
					thousand: ' ', // thousand delimiter
					prefix: '$ ', // appended after the number
				})
			});
			item.noUiSlider.on('update', function (values, handle) {
				inputs[handle].value = values[handle];
			});
			fromValue.addEventListener('change', function(){
				item.noUiSlider.set([this.value, null]);
			});
			toValue.addEventListener('change', function(){
				item.noUiSlider.set([null, this.value]);
			});

		})
	}
}

initRange();