const express = require('express')
const Task = require('../models/task')
const router = express.Router()

// TASK................................................................
router.post('/tasks', async (req, res) => {   
    const task = new Task(req.body)
    // Updated code with async/await
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch (e){
        res.status(400).send(e)
    }   
})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.get('/tasks', async (req, res) => {
    try{
        const allTasks = await Task.find({})
        res.send(allTasks)
    }
    catch (e){
        res.status(500).send(e)
    }
})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    // Updated code with async/await
    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send({
                "detail": "No task Found!"
            })
        }
        res.send(task)
    }
    catch (e){
        res.status(500).send(e)
    }
})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.patch('/tasks/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((item) => allowUpdates.includes(item))

    if (!isValidUpdate) {
        return res.status(400).send({
            "error": "Trying to update an instance that does not exists"
        })
    }
    try{
        const task = await Task.findById(req.params.id)

        updates.forEach((item) => task[item] = req.body[item])
        await task.save()
        
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send({
                "detail": "Task not found"
            })
        }
        res.status(200).send(task)
    }
    catch (e){
        res.status(500).send(e)
    }

})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.delete('/tasks/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
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