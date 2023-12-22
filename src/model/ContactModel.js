const mongoose = require("mongoose");
const validator = require("validator");

const ContactSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  telefone: { type: String, required: false, default: "" },
  criadoEm: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model("Contact", ContactSchema);

// Global Function 

function Contact(body) {
  this.body = body;
  this.errors = [];
  this.contact = null;
}

// Public Methods

Contact.prototype.register = async function () {
  this.validate();
  if (this.errors.length > 0) return;
  this.contact = await ContactModel.create(this.body);
};

Contact.prototype.validate = function () {
  this.cleanUp();

  //validacao
  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push("E-mail inválido");
  if (!this.body.nome) this.errors.push("Campo nome é obrigatório");
  if (!this.body.email && !this.body.telefone)
    this.errors.push("Pelo menos o telefone ou o emailprecisam ser enviados");
};

Contact.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }
  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  };
};

Contact.prototype.edit = async function (id) {
  try{
    if(typeof id !== 'string') return
    this.validate()
    if(this.errors.length > 0) return 
    this.contact = await ContactModel.findByIdAndUpdate(id, this.body , {new : true}) 
  }
  catch(e){
    console.log(e)
  }
}

//Static Methods 

Contact.searchForId = async function (id) {
  if (typeof id !== "string") return;
  const contact = await ContactModel.findById(id);
  return contact;
};

Contact.searchContacts = async function () {
  const contacts = await ContactModel.find()
  .sort({criadoEm : -1});
  return contacts;
};

Contact.deleteContact = async function (id){
  if (typeof id !== "string") return;
  const contact = await ContactModel.findOneAndDelete(id)
  return contact
}

module.exports = Contact;
