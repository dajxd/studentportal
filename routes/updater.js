const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://davem:" + process.env.MONGOKEY + "@studentdata-8hxes.gcp.mongodb.net/test?retryWrites=true&w=majority&family=4";
let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); // zero indexed
let yyyy = today.getFullYear();
lessonDate = mm + '/' + dd + '/' + yyyy;

router.get('/', function (req, res, next) {
    function encode(str) {
        // rfc3986EncodeURIComponent was too long of a name
        return encodeURIComponent(str).replace(/[!'()*]/g, escape);
    }

    let nameselection = req.query.nameselection;
    let newNotes = encode(req.query.notes);

    if (req.query.newname != undefined) {
        nameselection = req.query.newname.toLowerCase()
    }

    MongoClient.connect(uri, function (err, client) {
        if (err) {
            console.log('Error connecting to Atlas\n', err);
        }
        console.log('Connected to Atlas.');
        const collection = client.db("all").collection("allstudents");
        const logCollection = client.db("all").collection("log");

        let namePromise = new Promise((resolve, reject) => {
            collection.find().toArray((err, results) => {
                let allnames = [];
                for (i in results) {
                    allnames.push(results[i].name)
                }
                resolve(allnames);
                reject('name promise came up empty. not nice, name promise.')
            });

        });

        let newLinks = {};
        let newHomework = {};
        let homeworks = [encode(req.query.homework1), encode(req.query.homework2), encode(req.query.homework3), encode(req.query.homework4)];
        let hwc = 1
        for (hw in homeworks) {
            if (homeworks[hw].length > 1) {
                newHomework[hwc] = homeworks[hw];
                hwc = hwc + 1;
            }
        }

        newLinks[req.query.link1title] = encode(req.query.link1);
        newLinks[req.query.link2title] = encode(req.query.link2);
        newLinks[req.query.link3title] = encode(req.query.link3);
        newLinks[req.query.link4title] = encode(req.query.link4);

        namePromise.then((allnames) => {
            if (allnames.includes(nameselection)) {
                collection.updateOne(
                    {name: nameselection},
                    {
                        $set: {
                            homework: newHomework,
                            notes: newNotes,
                            links: newLinks
                        }
                    }
                );
            } else {
                collection.insertOne(
                    {name: nameselection, homework: newHomework, notes: newNotes, links: newLinks}
                )
            }
            logCollection.insertOne(
                {name: nameselection, homework: newHomework, notes: newNotes, links: newLinks, ldate: lessonDate}
            )
            client.close();
            res.render('updater', {title: 'Updated'})
        });


    });
});

module.exports = router;
