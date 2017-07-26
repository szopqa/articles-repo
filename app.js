const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

//App init
var app = express();

//Express session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));


//Express-message Middleware
app.use(require('connect-flash')());
app.use(function (req,res,next) {
   res.locals.messages = require('express-messages')(req,res);
   next();
});


//Express Validator Middleware
app.use(expressValidator({

    errorFormatter: function (param,msg,value) {
        var namespace = param.split('.')
            ,root = namespace.shift()
            ,formParam = root;

        while(namespace.length){
            formParam +='[' + namespace.shift() +']';
        }
        return{
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));


//Database connection
mongoose.connect('mongodb://localhost/nodekb');
var db = mongoose.connection;


//Checking connection
db.once('open',function () {
    console.log('Database connected');
});

//Checking error
db.on('error',function (err) {
    console.log(err);
});



//Loading view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : false}));
//Parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname,'public')));

//Bringing Models
var Article = require('./models/article');



//Home route GET Method
app.get('/',function (req,res) {

    Article.find({},function (err,articles) {
       if(err){
           console.log(err);
       }else{
           res.render('index',{
               message : 'Available articles',
               articles : articles
           });
       }
    });

});


//Route files
var articles = require('./routes/articles');
app.use('/articles',articles);



app.listen(8888,function () {
    console.log('Server has started on port 3000 ......');
});

