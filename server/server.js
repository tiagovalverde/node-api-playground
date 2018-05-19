let express = require('express');
let bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//local imports
let {mongoose} = require('./db/mondoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

var app = express();

//middleware (server now handles json)
app.use(bodyParser.json());

//routes
// POST /todos
app.post('/todos', (req, res) => {
    
    var todo = new Todo({
        text: req.body.text
    })

    todo.save(todo).then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

// GET /todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
})


// GET /todos/:id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    // validate id
    if(!ObjectID.isValid(id)) {
        res.status(404).send({
            success: false,
            message: 'id not valid'
        });
    }
    //Query DB
    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send({
                success: false,
                message: 'Todo not found'
            });
        }
        res.status(200).send({todo});
    }).catch((e) => res.status(400).send({
        sucess: false,
        message: 'Bad Request'
    }))
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {

    let id = req.params.id;
    // not valid id 404
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({
            success: false,
            message: "Invalid id"
        })
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        // no record in mongo
        if(!todo) {
            return res.status(404).send({
                success: false,
                message: 'Todo not found'
            })
        }
        res.status(200).send({
            todo,
            success: true,
            message: 'Todo deleted'
        })
    }).catch((e) => {
        res.status(400).send({
            todo: {},
            success: false,
            message: e
        })
    });

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Started on server ${port}`);
})

module.exports = {app};