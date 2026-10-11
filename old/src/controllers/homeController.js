const Contact = require('../model/ContactModel')

exports.index = async(req, res) =>{
    const contacts = await Contact.searchContacts()
    res.render('index', {contacts})
}
