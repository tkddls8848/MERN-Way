import Express, { request, response } from 'express';
import { MongoClient } from 'mongodb'
import multer from 'multer';
import router from './routes/route';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';

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
app.use('/route', router)

const http = createServer(app)
const io = new Server(http)

let storage = multer.diskStorage({
    destination:(request, file, cb) => {
        cb(null, __dirname + '/upload')
    },
    filename:(request, file, cb) => {
        let ext = path.extname(file.originalname)
        let newfilename = String(path.basename(file.originalname, ext) + '-' + Date.now() + ext)
        cb(null, newfilename)
    }
})
const upload = multer({storage:storage})

const login_check = (request, response, next) => {
    if(request.user) {
        next()
    } else {
        response.send({message:'Not Login'})
    }
};

const AuthUrl = process.env.DB_URL;

http.listen(process.env.PORT, () => {
    console.log("listening port " + process.env.PORT)
});

io.on('connection', (socket) => {
    console.log("socket id" + socket.id)

    socket.on("message", (chat) => {
        console.log(chat)
        io.emit("broadcast", socket.id + " 님 : " + chat)
    })
})

MongoClient.connect(AuthUrl, (err, client) => {

    const db = client.db('todoapp');

    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw',
        session: true,
        passReqToCallback: false,
    }, (userid, userpw, done) => {
        db.collection('login').findOne({ id: userid }, (err, result) => {
            if (err) return done(err)        
            if (!result) return done(null, false, { message: '존재하지않는 아이디입니다.' })
            if (userpw == result.pw) {
                console.log('asdf', result)
                return done(null, result)
            } else {
                return done(null, false, { message: '잘못된 비밀번호입니다.' })
            }
        })
    }));

    passport.serializeUser((user, done) => {
        console.log('serializeUser', user, user.id)
        done(null, user)
    });
    
    passport.deserializeUser((user, done) => {
        db.collection('login').findOne({id: user.id}, (err, result) => {
            done(null, result)
        });
    }); 

    app.post('/add', (request, response) => {
        db.collection('counter').findOne({name: 'totalcount'}, (err, result) => {
            let cnt = result.count;
            let writer = request.user
            console.log(writer)
            db.collection('post').insertOne({cnt: cnt, title: request.body.title, date: request.body.date, author : writer});
            console.log("cnt, request.body.title, request.body.date", cnt, request.body.title, request.body.date);
            response.render(__dirname + "/view/home.ejs");
            db.collection('counter').updateOne({name: 'totalcount'}, {$inc: {count: 1}});
        });
    });

    app.put('/add', (request,response) => {
        //front와 별개로 backend에서 user 검사
        if(request.user.id == request.body.author){
            db.collection('post').updateOne({cnt : parseInt(request.body.cnt)}, {$set: {title: request.body.title, date: request.body.date}},(err,result) => {
                response.redirect("/lists");
            });
        }
    });

    app.delete('/delete', (request, response) => {
        //front와 별개로 backend에서 user 검사
        db.collection('post').findOne({cnt : parseInt(request.body.cnt)}, (err, result) => {
            let sessionUser = request.user
            let dataUser = result.author
            if (sessionUser.id == dataUser.id) {
                db.collection('post').deleteOne({cnt : parseInt(request.body.cnt)}, (err,result) => {
                    response.render(__dirname + "/view/home.ejs");
                });
            }
        })
    });

    app.get('/lists', (request, response) => {
        try {
            db.collection('post').find().toArray((err, result) => {
                console.log("result", result);
                response.render(__dirname + "/view/list.ejs", {posts : result, user : request.user});
            });
        } catch (e) {
            console.log('e' + e);
        }
    });

    app.post('/register', (request, response) => {
        console.log(request.body.id,request.body.pw)
        db.collection('login').insertOne({id : request.body.id, pw: request.body.pw}, (err, result) => {
            response.redirect("/");
        })
    })

    app.get('/search', (request, response) => {
        console.log(request.query)
        let title_search = [{
            $search: {
                index: 'titleSearch',
                text: {
                    query: request.query.text,
                    path: "title"
                }
            }
        }]      
        console.log(title_search)
        db.collection('post').aggregate(title_search).toArray((err, result) => {
            console.log('re', result)
            response.render(__dirname + '/view/list.ejs', {posts: result})
        })
    })

    app.get('/edit/:id', (request, response) => {
        db.collection('post').findOne({cnt : parseInt(request.params.id)}, (err, result) => {
            if (result){
                response.render(__dirname + '/view/edit.ejs', {post : result});
            } else {
                response.status(400).send("wrong todo number");
            }
        });
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
    
    app.get('/upload', (request, response) => {
        response.render(__dirname + "/view/upload.ejs")
    })

    app.post('/upload', upload.single('title'), (request, response) => {
        response.send("UPLOAD Complete")
    })

    app.get('/upload/:name', (request, response) => {
        response.sendFile(__dirname + '/upload/' + request.params.name)
    })

    app.get('/chat', (request, response) => {    
        response.render(__dirname + '/view/chat.ejs')
    })

    
});