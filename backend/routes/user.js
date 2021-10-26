import Express from 'express'
import { MongoClient } from 'mongodb'
import connectDB from '../db/conn.js';

require('dotenv').config()
const recordRoutes = Express.Router();

recordRoutes.get('/register', (request, response) => {
    console.log("GET")
    response.send("GET /user/register PAGE")
})

recordRoutes.post('/register', async (request, response) => {
    const DBconnetion = connectDB.getDb()
    console.log(DBconnetion)
    DBconnetion.collection('login').insertOne({id : request.body.id, pw: request.body.pw}, (err, result) => {
        response.redirect("/");
    })
})

export default recordRoutes