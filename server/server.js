require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//local imports
let {mongoose} = require('./db/mondoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

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

// PATCH /todos/:id (UPDATE)
app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    // filter params that can be updated
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send({
            success: false,
            message: "Invalid id"
        })
    }
 
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, 
        {$set: body},
        {new: true}
    ).then((todo) => {
        if(!todo) {
            res.status(404).send({
                success: false,
                message: 'Todo not found'
            })
        }

        res.status(200).send({
            todo,
            success: true,
            message: 'Todo updated'
        });

    }).catch((e) => {
        res.status(400).send({
            success: false,
            message: 'Bad request'
        });
    });
});

// user request
// POST /users
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User({
        email: body.email,
        password: body.password
    });

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
})



// GET /users
// GET /users/:id
// DELETE /users/:id
// PATCH /users/:id

app.listen(port, () => {
    console.log(`Started on server ${port}`);
})

module.exports = {app};