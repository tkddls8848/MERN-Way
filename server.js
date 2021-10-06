import mongoUrl from './url.js'
import { response, request } from 'express';
import Express from 'express';

const app = Express();
app.use(Express.urlencoded({extended: true}));
app.use(Express.json({extended: true}));

const AuthUrl = mongoUrl;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(AuthUrl, (err, client) => {

    const db = client.db('todoapp');

    app.listen(8080, () => {
        console.log("listening port 8080")
    }); 

    app.post('/posting-todos', (request, response) => {

        try{
            db.collection('post').insertOne({title: request.body.title, date: request.body.date});
            console.log(request.body.title, request.body.date);
        } catch (e){
            console.log(e);
        };

        response.send("<h2>posting-todos</h2>");
    })
});

app.get('/pet', (request, response) => {
    response.send("petsadfasdf");
    console.log('pet');
});

app.get('/beauty', (request, response) => {
    response.send("This is beauty page");
});

app.get('/', (request, response) => {
    response.sendFile(__dirname + "/index.html");
});

app.get('/register-todos', (request, response) => {
    response.sendFile(__dirname + '/write.html');
});
