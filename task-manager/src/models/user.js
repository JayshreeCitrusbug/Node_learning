const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { use } = require('../routers/user');

// schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        // validate(value) {
        //     if(!validator.isEmail(value)){
        //         throw new Error("Email is not valid")
        //     }
        // }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.includes('password')){
                throw new Error("password can not contain password characters")
            }
        }
    },
    age: {
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject  = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//.methods is used for model instance only
userSchema.methods.generateAuthToken = async function () {
    const user = this
    console.log("user", user)
    const token = jwt.sign({ _id: user._id.toString() }, "signature")

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token

}



// .statics is used for model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("No matching email address found")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error("Unable to login")
    }
    return user
}

//use of middleware---> Have to define standard function not an Arrow function
// Hash plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(user.email)) {
        next(new Error('Please enter a valid email'));
    }

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();

})
// step-2 : model
const User = mongoose.model('User', userSchema)

module.exports = User