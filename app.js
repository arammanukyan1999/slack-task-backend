const express = require('express')
const bodyParser = require("body-parser")
require('dotenv').config()
const cors  = require("cors")
const {UserRouter,router} = require("./routers/router")
const db = require('./models')
const session = require('express-session');
const passport = require('passport')
const flash = require('connect-flash');


require('./config/passport')(passport)

// require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 4500

app.use(cors())
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')

    next()

})
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.json())
app.use(express.json());
app.use(UserRouter)
app.use(router)

app.listen(PORT, () => {
    console.log(`server started at${PORT}`), db.sequelize.sync()
})