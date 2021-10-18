import { response, request } from 'express';
import Express from 'express';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MethodOverride = require('method-override');

const app = Express();
require('dotenv').config();

app.use(Express.urlencoded({extended: true}));
app.use(Express.json({extended: true}));
app.use(MethodOverride('_method'));
app.set("view engine", "ejs");
app.use(session({secret : process.env.SECRET, resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

const login_check = (request, response, next) => {
    if(request.user) {
        next()
    } else {
        response.send({message:'Not Login'})
    }
};
const AuthUrl = process.env.DB_URL;
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(AuthUrl, (err, client) => {

    const db = client.db('todoapp');

    app.listen(process.env.PORT, () => {
        console.log("listening port " + process.env.PORT)
    }); 

    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw',
        session: true,
        passReqToCallback: false,
    }, (userid, userpw, done) => {
        db.collection('login').findOne({ id: userid }, (err, result) => {
            if (err) return done(err)        
            if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
            if (userpw == result.pw) {
                console.log('asdf', result)
                return done(null, result)
            } else {
                return done(null, false, { message: '비번틀렸어요' })
            }
        })
    }));

    passport.serializeUser((user, done) => {
        console.log('asdfsdf', user, user.id)
        done(null, user)
    });
    
    passport.deserializeUser((user, done) => {
        db.collection('login').findOne({id: user.id}, (err, result) => {
            done(null, result)
        });
    }); 

    app.post('/add', (request, response) => {
        try {
            db.collection('counter').findOne({name: 'totalcount'}, (err, result) => {
                console.log("result.count", result.count);
                let cnt = result.count;
                db.collection('post').insertOne({cnt: cnt, title: request.body.title, date: request.body.date});
                console.log("cnt, request.body.title, request.body.date", cnt, request.body.title, request.body.date);
                response.render(__dirname + "/view/home.ejs");
                db.collection('counter').updateOne({name: 'totalcount'}, {$inc: {count: 1}});
            });
        } catch (e) {
            console.log(e);
        };
    });

    app.put('/add', (request,response) => {
        try {
            db.collection('post').updateOne({cnt : parseInt(request.body.cnt)}, {$set: {title: request.body.title, date: request.body.date}},(err,result) => {
                response.redirect("/");
            });
        } catch (e) {
            console.log(e);
        }
    });

    app.delete('/delete', (request, response) => {
        console.log("DELETE", request.body)
        try {
            db.collection('post').deleteOne({cnt : parseInt(request.body.cnt)},(err,result) => {
                response.render(__dirname + "/view/home.ejs");
            });
        } catch (e) {
            console.log(e);
        }
    });

    app.get('/lists', (request, response) => {
        try {
            db.collection('post').find().toArray((err, result) => {
                console.log("result", result);
                response.render(__dirname + "/view/list.ejs", {posts : result});
            });
        } catch (e) {
            console.log('e' + e);
        }
    });

    app.get('/edit/:id', (request, response) => {
        try {
            db.collection('post').findOne({cnt : parseInt(request.params.id)}, (err, result) => {
                if (result){
                    console.log("result", result);
                    response.render(__dirname + '/view/edit.ejs', {post : result});
                } else {
                    response.status(400).send("wrong todo number");
                }
            });
        } catch (e) {
            console.log(e);
        }
    });

    app.get('/', (request, response) => {
        response.render(__dirname + "/view/home.ejs");
    });

    app.get('/register-todos', (request, response) => {
        response.render(__dirname + "/view/write.ejs");
    });

    app.get('/login', (request, response) => {
        response.render(__dirname + '/view/login.ejs')
    });

    app.post('/login', passport.authenticate('local', {failureRedirect : '/fail'}), (request, response) => {
        response.redirect('/')
    });

    app.get('/fail', (request,response) => {
        response.render(__dirname + '/view/fail.ejs')
    });

    app.get('/mypage', login_check, (request, response) => {
        console.log(request)
        response.render(__dirname + "/view/mypage.ejs", {username: request.user})
    });
    
});