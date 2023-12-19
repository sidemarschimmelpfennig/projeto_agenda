const Login = require('../model/LoginModel')

exports.renderLogin = (req,res) =>{
    if(req.session.user) return res.render('index')
    return res.render('login')   
}
exports.login = async function(req, res){
    try {
        const login = new Login(req.body) 
        await login.login()

        if(login.errors.length > 0){
          req.flash('errors' , login.errors)
          req.session.save(function(){
              return res.redirect('back')
          })
          return
        } 
  
        req.flash('success', 'Login conclúido.')
        req.session.user = login.user
        req.session.save(function(){
          return res.redirect('back')
        })
      } catch (e) {
          console.log(e)
          return res.render('404')}
}
exports.renderRegister = (req,res) =>{
    res.render('register')
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


exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}

module.exports = exports