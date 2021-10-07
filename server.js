import mongoUrl from './url.js'
import { response, request } from 'express';
import Express from 'express';

const app = Express();
app.use(Express.urlencoded({extended: true}));
app.use(Express.json({extended: true}));
app.set("view engine", "ejs");

const AuthUrl = mongoUrl;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(AuthUrl, (err, client) => {

    const db = client.db('todoapp');

    app.listen(8080, () => {
        console.log("listening port 8080")
    }); 

    app.post('/posting-todos', (request, response) => {

        try {
            db.collection('post').insertOne({title: request.body.title, date: request.body.date});
            console.log(request.body.title, request.body.date);
            response.sendFile(__dirname + "/view/home.html");
        } catch (e) {
            console.log(e);
        };

    });

    app.get('/lists', (request, response) => {

        try {
            db.collection('post').find().toArray((err, result) => {
                console.log(result);
                response.render(__dirname + "/view/list.ejs", {posts : result});
            });
        } catch (e) {
            console.log('e' + e);
        }

    })
});

app.get('/', (request, response) => {
    response.sendFile(__dirname + "/view/home.html");
});

app.get('/register-todos', (request, response) => {
    response.sendFile(__dirname + "/view/write.html");
});