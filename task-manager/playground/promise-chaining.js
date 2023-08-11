require('../src/db/mongoose')
// const User = require('../src/models/user')

// //64d381a5f57b1c2b61a094d4

// User.findByIdAndUpdate('64d381a5f57b1c2b61a094d4', {
//     age:1
// }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age:1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })



const Task = require('../src/models/task')

//64d381a5f57b1c2b61a094d4

Task.findOneAndRemove('64d38309460d9f132121bb10').then((task) => {
    console.log(task)
    return Task.countDocuments({ completed:false })
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})