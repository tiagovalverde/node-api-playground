const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mondoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = '5afce5ab56e7d11824fdee5000';
let id_user = '5afcca6631c16480379c0417';

if(!ObjectID.isValid(id)) {
    console.log('ID not valid');
}


// queries
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

// find by id
// works no user, user found, erro occurred
User.findById(id_user).then((user) => {
    if(!user) {
        // not found
        return console.log('user Id not found');
    }
    // found
    console.log(JSON.stringify(user, undefined,2))
}).catch((e) => console.log(e)); //invalid id

