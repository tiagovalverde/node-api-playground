const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server', err);
    }
    console.log('Connected to MongoDb server');

    // find one and update
    // (filter, update, options, callback)
    // db.collection('Todos').findOneAndUpdate(
    //     {_id: new ObjectID('5afbff198e5b4464a0c7f2aa')},
    //     {$set: {completed: true}},
    //     {returnOriginal: false}
    // ).then((res) => {
    //     console.log(res);
    // })

    // USers - update name and inc age
    db.collection('Users').findOneAndUpdate(
        {_id: new ObjectID('5afb8f10d4f87718f8cbaaa8')},
        {
            $set: {name: 'Magic Mike'},
            $inc: {age: 1},
        },
        {returnOriginal: false}
    ).then((res) => {
        console.log(res);
    })

    db.close();
})