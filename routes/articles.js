const express = require('express');
const router = express.Router();



//Bringing article model
var Article = require('../models/article');


//Add-new route, GET method
router.get('/add',function (req,res) {
    res.render('add',{
        message : 'Add new article'
    });
});


//Add-new route, POST method. Adds new article to Database
router.post('/add',function (req,res) {

    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    //Get Errors
    var errors = req.validationErrors();

    if(errors){
        res.render('add',{
            title:'Add Article',
            errors:errors
        });
    }else{

        var article = new Article();

        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;

        article.save(function (err){
            if(err){
                console.log(err);
            }else{
                req.flash('success','Article Added');
                res.redirect('/');
            }
        });
    }

});


//Edit Single Article
router.get('/edit/:id',function (req,res) {

    Article.findById(req.params.id,function (err,article) {
        res.render('edit_article',{
            title : 'Edit ',
            article : article
        });
    });
});


//Update submit Posrt route
router.post('/edit/:id',function (req,res) {

    var article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    //Where _id matches req.params.id
    var query = {_id:req.params.id};

    Article.update(query, article, function (err) {
        if(err){
            console.log(err);
        } else {
            req.flash('success','Article Updated');
            res.redirect('/');
        }
    });
});


//Get Single Article
router.get('/:id',function (req,res) {

    Article.findById(req.params.id,function (err,article) {
        if(err){
            console.log(err);
        } else {
            res.render('article',{
                article : article
            });
        }
    });

});

//Delete route
router.delete('/:id', function (req,res) {

    var query = {_id:req.params.id}

    Article.remove(query,function (err) {

        if(err){
            console.log(err);
        }

        res.send('Success');
    });
});

module.exports = router;