const Login = require('../model/LoginModel')


exports.login = (req, res) =>{
    res.render('login')
    return
}

exports.register = async (req, res) => {
    try{
    const login = new Login(req.body)
    await login.register()
    if(login.errors.length > 0){
        req.flash('errors', login.errors)
        req.session.save(function(){
           return res.redirect('back')
        })
        return
    }
    
    req.flash('success', 'Usuario criado com sucesso.')
        req.session.save(function(){
           return res.redirect('back')
        })
    return
    }catch(e){
        console.log(e)
        return res.render('404')
    }
    
}


module.exports = exports