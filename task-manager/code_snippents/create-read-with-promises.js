const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)
    
    user.save().then( () => {
        res.status(201).send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })    
})

app.get('/users', (req, res) => {
    
    User.find({}).then((allUsers) => {
        res.send(allUsers)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if(!user){
            return res.status(404).send({
                "detail": "No user Found!"
            })
        }
        res.send(user)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

app.post('/tasks', (req, res) => {   
    const task = new Task(req.body)

    task.save().then( () => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })    
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((allTasks) => {
        res.send(allTasks)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        if(!task){
            return res.status(404).send({
                "detail": "No task Found!"
            })
        }
        res.send(task)
    }).catch((e) => {
        res.status(500).send(e)
    })
})


app.listen(port, ()=> {
    console.log("Server is set up on Port " + port )
})