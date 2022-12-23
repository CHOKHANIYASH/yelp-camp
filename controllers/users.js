const User = require('../models/user')

module.exports.registerForm  = (req,res) => {
    res.render('users/register')

}

module.exports.register =    async(req,res) => {
    try{
    const {email,username,password} = req.body
    const user = new User({email,username})
    const registeredUser = await User.register(user,password)
    req.login(registeredUser,(err) => {
        if(err){
            return(err)
        }
    req.flash('success','welcome to yelpcamp')
    res.redirect('/campgrounds')
    })
    
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/campgrounds')
    }
   
}

module.exports.renderLogin = (req,res) => {
    res.render('users/login')

}

module.exports.login =(req,res) => {
    req.flash('success','welcome back')
    const redirectUrl ='/campgrounds' || req.session.url
    res.redirect(redirectUrl)
} 

module.exports.logout = (req,res) => {
    req.logout(()=>{
        req.flash('success','logged out successfully')
        res.redirect('/campgrounds')
    
    })
    
}