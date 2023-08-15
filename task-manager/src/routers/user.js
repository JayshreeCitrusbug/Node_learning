// packages
const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

//  models, middleware
const User = require('../models/user')
const Task = require('../models/task')
const auth = require("../middleware/auth")
const { sendWelcomeEmail, sendDeleteAccountEmail } = require('../emails/account')

const router = new express.Router()


router.get('/user/me', auth, async (req, res) => {
    res.send(req.user)
})

//USER..............................................................
router.post('/users', async (req, res) => {
    // Updated code with async/await
    const user = new User(req.body)
    try {     
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const jwtToken = await user.generateAuthToken()
        res.status(201).send({ user, jwtToken })
    }
    catch (error) {
        console.log(error.message)
        res.status(400).send({ error: error.message });
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
// router.get('/users', auth, async (req, res) => {
    //     // Updated code with async/await
    //     try{
        //         const allUsers = await User.find({})
        //         res.send(allUsers)
        //     }
        //     catch (e){
//         res.status(500).send()
//     }

// })


//:::::::::::::::::::::::::::::::::::::::::::::::
router.patch('/users/me', auth, async (req, res) => {
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
        // const user = await User.findById(req.params.id)
        
        updates.forEach((item) => req.user[item] = req.body[item])
        
        await req.user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        // if(!user){
            //     return res.status(404).send({
                //         "detail": "User not found"
        //     })
        // }
        res.status(200).send(req.user)
    }
    catch (e){
        console.log(e)
        res.status(400).send(e)
    }
})

//:::::::::::::::::::::::::::::::::::::::::::::::
router.delete('/users/me', auth, async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.user._id)
        if(!user){
            return res.status(404).send({
                "error": "User not Found"
            })
        }
        const task = await Task.deleteMany({ owner: req.user._id})
        // NOT WORKING -> ERROR: TypeError: req.user._id.remove is not a function
        // await req.user.remove()
        
        
        sendDeleteAccountEmail(req.user.email, req.user.name)
        res.send(req.user)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
    
})

// multer set up for file upload
const userAvatarUpload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be image with jpg, jpeg or png formate.'))
        }

        cb(undefined, true)
    }
})

// Add user profile
router.post('/users/me/avatar', auth, userAvatarUpload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        'error': error.message
    })
})  


// Delete user profile
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})  

// Get user avatar
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
})

module.exports = router