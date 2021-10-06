import mongoUrl from './url.js'
import { response, request } from 'express';
import Express from 'express';

const app = Express();
app.use(Express.urlencoded({extended: true}));

const AuthUrl = mongoUrl;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(AuthUrl, (err, client) => {

    app.listen(8080, () => {
        console.log("listening port 8080")
    });

    app.get('/pet', (request, response) => {
        response.send("petsadfasdf");
        console.log('pet');
    });
})

app.get('/beauty', (request, response) => {
    response.send("This is beauty page");
});

app.get('/', (request, response) => {
    response.sendFile(__dirname + "/index.html");
});

app.get('/register-todos', (request, response) => {
    response.sendFile(__dirname + '/write.html');
});

app.post('/posting-todos', (request, response) => {
    response.send("asdf")
    console.log(request.body.title);
});