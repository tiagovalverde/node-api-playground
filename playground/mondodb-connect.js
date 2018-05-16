//const MongoClient = require('mongodb').MongoClient;
// create object id on the fly
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);


// localhost url
// db - object used to issue commands to mongo
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    //INSERT ONE DOCUMENT
    // todo collection and user collection
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, res) => {
    //     if(err) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    // Insert new doc into users (name, age, location)
    // db.collection('Users').insertOne({
    //     name: 'Tiago',
    //     age: 27,
    //     location: 'Toronto'
    // }, (err, res) => {
    //     if(err) {
    //         return console.log('Unable to insert user', err);
    //     }
    //     //console.log(JSON.stringify(res.ops, undefined,2));
    //     console.log(res.ops[0]._id.getTimestamp());
    // })



    db.close();
});

