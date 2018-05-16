const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server', err);
    }
    console.log('Connected to MongoDb server');

    //delete many
    // db.collection('Todos').deleteMany({text: 'Code for 1h'}).then((res) => {
    //     console.log(res);
    // });

    //delete one
    // db.collection('Todos').deleteOne({text: 'Code for 1h'}).then((res) => {
    //     console.log(res);
    // });

    //find one and delete (delete and return deleted doc)
    // db.collection('Todos').findOneAndDelete({completed:false}).then((res) => {
    //     console.log(res);
    // });

    // Users - find and delete by id
    // db.collection('Users').findOneAndDelete({_id: new ObjectID('5afb8fc0711cf01c40e872eb')}).then((res) => {
    //     console.log(res);
    // });

    //users - delete many
    db.collection('Users').deleteMany({name: 'Tiago'}).then((res) => {
        console.log(res);
    });


    


    db.close();
})