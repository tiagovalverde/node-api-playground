let express = require('express');
let bodyParser = require('body-parser');


//local imports
let {mongoose} = require('./db/mondoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

var app = express();

//middleware (server now handles json)
app.use(bodyParser.json());

//routes
// POST 
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
// GET /todos/{id}

const port = 3000;
app.listen(port, () => {
    console.log(`Started on server ${port}`);
})