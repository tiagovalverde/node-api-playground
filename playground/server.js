const mongoose = require('mongoose');
// set up promises instead of callbacks
mongoose.Promise = global.Promise; 
// mantains connection over time (takes care of that)
mongoose.connect('mongodb://localhost:27017/TodoApp');

// model 
let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

// instant of model
// let newTodo = new Todo({
//     text: 'Cook dinner'
// })

// newTodo.save().then((doc) => {
//     console.log('Saved Todo', doc);
// }, (e) => {
//     console.log('Unable to save Todo');
// });

let otherTodo = new Todo({
    text: '   Edit this video   '
});

otherTodo.save().then((doc) => {
    console.log('Saved Todo', JSON.stringify(doc, undefined, 2));
}, (e) => {
    console.log('Unable to save Todo', e);
});

// User
// email - required, trim, type, min length 1
let User = mongoose.model('User',{
    email : {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    }
});

let newUser = new User({
    email: 'test@test.com'
});

newUser.save().then((res) => {
    console.log('Saved User', JSON.stringify(res,undefined,2))
}, (e) => {
    console.log('Unable to save user', e);
})