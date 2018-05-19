const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mondoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let todoID = new ObjectID('5b00110d8e5b4464a0c8855c');


// delete multiple > ALl > Todo.remove({});
// Todo.remove({}).then((res) => {
//     console.log(res);
// })

// Todo.findOneAndRemove({}).then((res) => {

// remove by id given
Todo.findByIdAndRemove(todoID).then((todo) => {
    console.log(todo);
}); 

