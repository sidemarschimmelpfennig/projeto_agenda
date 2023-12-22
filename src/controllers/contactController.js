const Contact = require('../model/ContactModel')

exports.indexContact = (req, res) =>{
    res.render('contact', {contact : {}})
    return
}

exports.registerContact = async(req, res) => {
    try{
        const contact = new Contact(req.body)
        await contact.register()

        if(contact.errors.length > 0){
            req.flash('errors', contact.errors)
            req.session.save(()=> res.redirect('back'))
            return
        }
        req.flash('success', 'Contato criado com sucesso.')
        req.session.save(() => res.redirect(`/contact/${contact.contact._id}`))
        return
    }catch(e){
        console.log(e)
        res.render('404')
    }
   
}

exports.editContact = async (req, res) => {
    try{
        if (!req.params.id)return res.render('404')

        const contact = await Contact.searchForId(req.params.id)
        if(!contact) return res.render('404')
        
        res.render('contact', {contact})
    }catch(e){
        console.log(e)
        res.render('404')
    }

}
 
exports.editContactSave = async (req, res) => {
    try{
        if (!req.params.id)return res.render('404')
        const contact = new Contact(req.body)
        await contact.edit(req.params.id)

        if(contact.errors.length > 0){
            req.flash('errors', contact.errors)
            req.session.save(()=> res.redirect('back'))
            return
        }
        req.flash('success', 'Contato criado com sucesso.')
        req.session.save(() => res.redirect(`/contact/${contact.contact._id}`))
        return
    }catch(e){
        console.log(e)
        res.render('404')
    }

}

exports.deleteContact = async (req , res)=>{
    if (!req.params.id)return res.render('404')

    const contact = await Contact.deleteContact(req.params.id)
    if(!contact) return res.render('404')
    
    req.flash('success', 'Contato deletado com sucesso')
    req.session.save(() => res.redirect(`back`))
    return
}

module.exports = exports