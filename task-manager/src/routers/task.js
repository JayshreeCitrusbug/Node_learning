const express = require('express')
const Task = require('../models/task')
const auth = require("../middleware/auth")
const router = new express.Router()

// TASK................................................................
router.post('/tasks', auth, async (req, res) => {   
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{

        await task.save()
        res.status(201).send(task)
    }
    catch (e){
        res.status(400).send(e)
    }   
})

//:::::::::::::::::::::::::::::::::::::::::::::::
// GET /tasks/?completed=true
// GET /tasks/?limit=10&skip=0
// GET /tasks/?sortBy=createdAt:asc  or ?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    try{
        // METHOD-1:
        // const allTasks = await Task.find({owner: req.user._id})
        // res.send(allTasks)
        // Example: await Author.findOne().populate('posts');

        // METHOD-2:
        // NOT WORKING : execPopulate() is not supported to mongo now
        // await req.user.populate('tasks').execPopulate()

        const match = {}
        const sort = {}

        if (req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(":")
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    }
    catch (e){
        console.log(e)
        res.status(500).send(e)
    }
})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    // Updated code with async/await
    try{
        // const task = await Task.findById(_id)

        const task = await Task.findOne({ _id, owner: req.user._id })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (e){
        res.status(500).send(e)
    }
})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((item) => allowUpdates.includes(item))

    if (!isValidUpdate) {
        return res.status(400).send({
            "error": "Trying to update an instance that does not exists"
        })
    }
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        // const task = await Task.findById(req.params.id)

        
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send({
                "detail": "Task not found"
            })
        }

        updates.forEach((item) => task[item] = req.body[item])
        await task.save()

        res.status(200).send(task)
    }
    catch (e){
        res.status(500).send(e)
    }

})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({ _id:req.params.id, owner:req.user._id})
        if (!task){
            return res.status(404).send({
                "error": "Task not found"
            })
        }
        res.send({
            "detail": "Task deleted Successfully"
        })
    }
    catch (e){
        res.status(500).send(e)
    }

})

module.exports = router