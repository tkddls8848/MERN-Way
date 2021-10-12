import mongoUrl from './url.js'
import { response, request } from 'express';
import Express from 'express';

const app = Express();
const MethodOverride = require('method-override');
app.use(Express.urlencoded({extended: true}));
app.use(Express.json({extended: true}));
app.use(MethodOverride('_method'));
app.set("view engine", "ejs");

const AuthUrl = mongoUrl;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(AuthUrl, (err, client) => {

    const db = client.db('todoapp');

    app.listen(8080, () => {
        console.log("listening port 8080")
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

});

app.get('/', (request, response) => {
    response.render(__dirname + "/view/home.ejs");
});

app.get('/register-todos', (request, response) => {
    response.render(__dirname + "/view/write.ejs");
});