const express = require('express')
const User = require('../models/user')
const auth = require("../middleware/auth")
const router = express.Router()


router.get('/user/me', auth, async (req, res) => {
    res.send(req.user)
})

//USER..............................................................
router.post('/users', async (req, res, next) => {
    // Updated code with async/await
    const user = new User(req.body)
    try {     
        await user.save()
        const jwtToken = await user.generateAuthToken()
        res.status(201).send({ user, jwtToken })
    }
    catch (e) {
        // console.log(e)
        res.status(400).send(e)
        // return next(e)
    }   
})

//::::::::::::::::::User login
router.post('/user/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const jwtToken = await user.generateAuthToken()
        res.send({ user, jwtToken })
    }
    catch(e) {
        res.status(400).send(e)
    }
})

router.post('/user/logout', auth, async(req, res) => {
    try{    
        req.user.tokens = req.user.tokens.filter( (t) => {
            return t.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.get('/users', auth, async (req, res) => {
    // Updated code with async/await
    try{
        const allUsers = await User.find({})
        res.send(allUsers)
    }
    catch (e){
        res.status(500).send()
    }
 
})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    // Updated code with async/await
    try {
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send({
                "detail": "No user Found!"
            })
        }
        res.send(user)
    }
    catch (e){
        res.status(500).send(e)
    }
})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'email', 'password', 'age']
    const isValidUpdate = updates.every((item) => allowUpdates.includes(item))

    if (!isValidUpdate){
        return res.status(400).send({
            "error": "Invalid Update data"
        })
    }
    try{
        
        // Update because want to use middleware pre save functionality
        const user = await User.findById(req.params.id)
        console.log("before", user)
        updates.forEach((item) => user[item] = req.body[item])

        await user.save()
        const updated = await User.findById(req.params.id)
        console.log("after", updated)

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!user){
            return res.status(404).send({
                "detail": "User not found"
            })
        }
        res.status(200).send(user)
    }
    catch (e){
        console.log(e)
        res.status(400).send(e)
    }
})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send({
                "error": "User not Found"
            })
        }
        res.status(204)
    }
    catch (e) {
        res.status(500).send(e)
    }

})

module.exports = router