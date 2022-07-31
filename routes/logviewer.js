const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://davem:" + process.env.MONGOKEY + "@studentdata-8hxes.gcp.mongodb.net/test?retryWrites=true&w=majority&family=4";


router.get('/', function (req, res, next) {
    let locked = true;
    if (req.cookies['user'] == process.env.ADMINCOOKIE) {
        locked = false;
    }
    MongoClient.connect(uri, function (err, client) {
        if (err) {
            console.log('Error connecting to Atlas\n', err);
        }
        console.log('Connected to Atlas');
        const collection = client.db("all").collection("log");

        let namePromise = new Promise((resolve, reject) => {
            collection.find().toArray((err, results) => {
                resolve(results);
                reject('nothing there');
            }); //coll find
        }); //promise dec
        namePromise.then((results) => {
            client.close();

            res.render('logviewer', {title: 'Log Viewer', data: results, pass: "public", lock: locked});

        });//then
    }); //mongo
});//router

module.exports = router;
