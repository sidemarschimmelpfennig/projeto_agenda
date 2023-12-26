import 'core-js/stable'
import 'regenerator-runtime/runtime'



import Login from './modules/Login'
import RegisterUser from './modules/RegisterUser'

const login = new Login('#form-login')
const registerUser = new RegisterUser('#form-register')

login.init()
registerUser.init()

