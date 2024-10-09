
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
    
    const emails = form.querySelectorAll('input[type="email"]');
    emails.forEach(email => {
        validateEmail(email);
    })
}



const validateEmail = (email) => {
    return String(email).match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
console.log(validateEmail(11565));

validateInit();