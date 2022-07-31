const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://davem:" + process.env.MONGOKEY + "@studentdata-8hxes.gcp.mongodb.net/test?retryWrites=true&w=majority&family=4";

router.get('/', function (req, res, next) {
    res.clearCookie('user')
    res.render('/', {title: 'Logged out'})

});

module.exports = router;
