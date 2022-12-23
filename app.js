if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const JOI = require('joi');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const MongoDBStore = require('connect-mongo');

const { nextTick } = require('process');
const { attempt } = require('joi');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const dbUrl = process.env.DB_URL 
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static( path.join(__dirname, 'public')))



const store = new MongoDBStore({
    mongoUrl:dbUrl,
    secret:"asdfghjkl",
    touchAfter:24*3600
})

store.on("error",function(e){
    console.log("session store error",e)
})

const sessionConfig = {
    store,
    secret:"thisisasecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)


app.get('/',(req,res)=>{
    res.redirect('/campgrounds');
})
    
app.all('*',(req,res,next)=>{
    res.send(new ExpressError('page not found',404))
})

app.use((err,req,res,next) => {
    const {statusCode=500,message='something went bad'} = err;
    res.status(statusCode).render('error',{err})
})

app.listen('3000',()=>{
    console.log("listening at 3000");
})
