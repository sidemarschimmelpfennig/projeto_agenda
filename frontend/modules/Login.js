import validator from 'validator'

export default class Login {
    constructor(formClass) {
      this.form = document.querySelector(formClass);
    }
  
    init() {
      this.events();
    }
  
    events() {
      if(!this.form) return;
      this.form.addEventListener('submit', e => {
        e.preventDefault();
        this.validate(e)
      });
    }
  
    validate(e){
        const element = e.target
        const emailInput = element.querySelector('input[name="email"]')
        const passwordInput = element.querySelector('input[name="password"]')
        let error = false
        if (!validator.isEmail(emailInput.value)){
            alert('Email inválido')
            error = true
        }
        if(passwordInput.value.length < 3 || passwordInput.value.length > 50 ){
            alert('Senha precisa ter entre 3 e 50  caracteres')
            error = true
        }
        if(!error)element.submit()
    }
}