// const mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
//     useNewUrlParser: true,
//     useCreateIndex: true
// })

// const User = mongoose.model('User', {
//     name: {
//         type: String
//     },
//     age: {
//         type: Number
//     }
// })

// // initiate instance using constructor
// const me = new User({
//     name: "Jayshree",
//     age: 23
// })

// // Save model instance
// me.save().then( () => {
//     console.log(me)
// }).catch( (error) => {
//     console.log(error)
// })

//caused en error-----------------------------------------------------------------------------------------------


const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Define a schema is not necessary, we can define it in model itself as below
    // const NewUser = mongoose.model('NewUser', {
    //     name: {
    //         type: String
    //     },
    //     age: {
    //         type: Number
    //     },
    //     dob:{
    //         type: String
    //     }
    // });
    // const newMe = new NewUser({
    //     name: "Test",
    //     age: 20,
    //     dob: "2000/10/20"
    // });
    // newMe.save().then( () => {
    //     console.log(newMe)
    // }).catch( (error) => {
    //     console.log(error)
    // })

// schema -> model -> instance -> save()
// Step-1 : schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid")
            }
        }
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
    }
});

// step-2 : model
const User = mongoose.model('User', userSchema);

// step-3: INSTANCE OF CLASS FOR USER
// const me = new User({
//     name: "Test@",
//     email: "test@tempr.email",
//     password: 'Abcd@1234',
//     age: 20
// });

// step-4: save() with promises
// me.save().then( () => {
//     console.log(me)
// }).catch( (error) => {
//     console.log(error)
// })


// schema -> model -> instance -> save()
// const taskSchema = new mongoose.Schema({
//     description: {
//         type: String
//     },
//     completed: {
//         type: Boolean
//     }
// });

// Create index 
// schema.index({ someField: 1 }); // Using createIndexes method

const Task = mongoose.model('Tasks', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// INSTANCE OF CLASS FOR TASK
const task = new Task({
    description: "Description......",
});
task.save().then( () => {
    console.log(task)
}).catch( (error) => {
    console.log(error)
})