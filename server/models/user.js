const mongoose = require('mongoose');
const _ = require('lodash');

// mongoose.set('debug', true)

const validator = require('validator');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail, 
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String, 
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    
}, {
    usePushEach: true
});

UserSchema.methods.toJSON = function () {
    let user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

// arrow fn do not bind keyword
UserSchema.methods.generateAuthToken = function () {
    
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, '123456').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

let User = mongoose.model('User',UserSchema);

module.exports = {User}; 