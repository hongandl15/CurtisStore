const mongoose = require('mongoose')
const User = require('./models/user.js')
const express = require('express')
const hbs = require('express-handlebars')
const session = require('express-session')
const app = express()
var path = require('path')
const port = process.env.PORT || 8181
const login = require('./controllers/login.js')
const register = require('./controllers/register.js')
const admin = require('./controllers/admin.js')
const user = require('./controllers/user.js')
const home = require('./controllers/home.js')
const product = require('./controllers/product.js')

const customhbs  = hbs.create({});

require('./server.js')

app.engine('handlebars', hbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, "views/Layouts")
    
}))

customhbs.handlebars.registerHelper("multiple",function(index,value){
    return index * value;
})


app.use(express.urlencoded())
app.use(session({ 
    secret: 'fafsdhalj',
    resave: true,
    saveUninitialized: true,
}))
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, './public')));

app.use(function(req, res, next) { // không hiển thị lại message session khi back lại trang
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});



app.use('/', login)
app.use('/', user)
app.use('/', register)
app.use('/', admin)
app.use('/', home)
app.use('/', product)

app.use((req, res, next) => {
    res.status(404);
    res.render('./Home/404', {layout:'main', title:'404 Not Found'});
  });

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(404).render('./Home/404', {layout:'main', title:'404 Not Found'})
  })


app.listen(port, () => console.log(`Express started on https:/localhost:${port};`))

// app.listen(port, () => console.log(`Express started on https:/localhost:${port};`))
