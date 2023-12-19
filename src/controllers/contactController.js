const Contact = require('../model/ContactModel')

exports.indexContact = (req, res) =>{
    res.render('contact')
}

exports.register = async(req, res) => {
    try{
        const contact = new Contact(req.body)
        await contact.register()

        if(contact.errors.length > 0){
            req.flash('errors', contact.errors)
            req.session.save(()=> res.redirect('back'))
            return
        }
        req.flash('success', 'Contato criado com sucesso.')
        req.session.save(() => res.redirect(`back`))
        return
    }catch(e){
        console.log(e)
        res.render('404')
    }
   

}




module.exports = exports