const mongoose = require('mongoose')
const validator = require('validator')

const ContactSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
  });

const ContactModel = mongoose.model('Contact', ContactSchema)

function Contact(body){
    this.body  = body
    this.errors = [] 
    this.contact = null
}

Contact.prototype.register = async function(){
    this.validate()
    if (this.errors.length > 0) return
    this.contact = await ContactModel.create(this.body)
}

Contact.prototype.validate = function(){
    this.cleanUp()
    
    //validacao
    if(this.body.email && !validator.isEmail(this.body.email) )this.errors.push('E-mail inválido')
    if(!this.body.nome) this.errors.push('Campo nome é obrigatório')
    if(!this.body.email && !this.body.telefone)this.errors.push('Pelo menos o telefone ou o emailprecisam ser enviados')
}

Contact.prototype.cleanUp = function(){
    for(const key in this.body){
        if (typeof this.body[key] !== 'string'){
            this.body[key] = ''
        }
    } 
    this.body = {
        nome : this.body.nome,
        sobrenome : this.body.sobrenome,
        email : this.body.email,
        telefone : this.body.telefone
    }
   
}

module.exports = Contact

