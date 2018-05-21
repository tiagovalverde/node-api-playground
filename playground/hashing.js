const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

// create
var data = {
    id: 15   
};

let token = jwt.sign(data, '123abc');
console.log(token);

// validate
var decoded = jwt.verify(token, '123abc');
console.log(decoded);

// let message = 'I am user number 3';
// let hash = SHA256(message).toString();
 
// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// let data = {
//     id: 4
// };

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'salt_secret').toString()
// }

// // MiM simulation
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'salt_secret').toString();

// if( resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Dont trust');
// } 