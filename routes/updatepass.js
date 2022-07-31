const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://davem:" + process.env.MONGOKEY + "@studentdata-8hxes.gcp.mongodb.net/test?retryWrites=true&w=majority&family=4";

router.get('/', function (req, res, next) {
    MongoClient.connect(uri, function (err, client) {
        if (err) {
            console.log('Error connecting to Atlas...\n', err);
        }
        console.log('Connected to Atlas');
        const collection = client.db("all").collection("allstudents");
        let newpass = req.query.newpass;
        let nameselection = req.query.name;
        nameselection = nameselection.toLowerCase();
        console.log("updating " + nameselection + '\'s password');
        collection.updateOne(
            {name: nameselection},
            {
                $set: {
                    password: newpass
                }
            }
        );
        client.close();
        res.render('/', {title: 'Updated'})
    });
});

module.exports = router;
