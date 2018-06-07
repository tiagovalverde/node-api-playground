require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//local imports
let {mongoose} = require('./db/mondoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

//middleware (server now handles json)
app.use(bodyParser.json());

//routes
// POST /todos
app.post('/todos', authenticate, (req, res) => {
    
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    })

    todo.save(todo).then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

// GET /todos
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
})


// GET /todos/:id
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    // validate id
    if(!ObjectID.isValid(id)) {
        res.status(404).send({
            success: false,
            message: 'id not valid'
        });
    }
    //Query DB
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
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
app.delete('/todos/:id', authenticate, async (req, res) => {

    const id = req.params.id;
    // not valid id 404
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({
            success: false,
            message: "Invalid id"
        })
    }

    try {
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
    
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
    } catch(e) {
        res.status(400).send({
            todo: {},
            success: false,
            message: e
        })
    }
});

// PATCH /todos/:id (UPDATE)
app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, 
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
app.post('/users',async  (req, res) => {
    
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        
        await user.save();
        const token = user.generateAuthToken();
    
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send({
            todo: {},
            success: false,
            message: e.errmsg
        });
    }
})

app.get('/users/me', authenticate, (req, res) => {
   res.send(req.user);
})

// loggin in
app.post('/users/login', async (req, res) => {

    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send();
    }
});

// logging out
app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch(e) {
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Started on server ${port}`);
})

module.exports = {app};