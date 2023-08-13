const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

const multer = require('multer')
const upload = multer({ 
    dest: 'images/',
    limits: {
        fileSize: 1000000  // 1 MegaBite
    },
    fileFilter(req, file, cb){
        if(!file.originalname.endsWith('.pdf')){
            return cb(new Error('File must be in .PDF formate'))
        }    
        cb(undefined, true)
    }
})

// Customize middleware for error handling
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })


// const errorMiddleware = (req, res, next) => {
//     throw new Error("Error from middleware...")
// }
// app.post('/upload', errorMiddleware, (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send()
// })



app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ 'error': error.message })
})



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port, ()=> {
    console.log("Server is set up on Port " + port )
})