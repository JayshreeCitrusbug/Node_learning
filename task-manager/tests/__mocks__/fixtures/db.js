const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../../src/models/user')
const Task = require('../../../src/models/task')

const successUserId = new mongoose.Types.ObjectId
const successUser = {
    _id: successUserId,
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'Abcd@1234',
    tokens: [{
        token: jwt.sign({ _id:successUserId }, process.env.JWT_SECRET)
    }]
}

const successUser2Id = new mongoose.Types.ObjectId
const successUser2 = {
    _id: successUser2Id,
    name: 'Test User 2',
    email: 'testuser2@example.com',
    password: 'Abcd@1234',
    tokens: [{
        token: jwt.sign({ _id:successUser2Id }, process.env.JWT_SECRET)
    }]
}

const failureUserId = new mongoose.Types.ObjectId
const failureUser = {
    _id: failureUserId,
    name: 'Failure Test User',
    email: 'Failuretestuser@example.com',
    password: 'Abcd@1234',
    tokens: [{
        token: jwt.sign({ _id:failureUserId }, process.env.JWT_SECRET)
    }]
}

const task1 = {
    _id: new mongoose.Types.ObjectId,
    description: "Test task description- 1",
    completed: false,
    owner: successUser._id

}

const task2 = {
    _id: new mongoose.Types.ObjectId,
    description: "Test task description- 2",
    completed: true,
    owner: successUser._id


}
const task3 = {
    _id: new mongoose.Types.ObjectId,
    description: "Test task description- 3",
    completed: false,
    owner: successUser2._id

}

const task4 = {
    _id: new mongoose.Types.ObjectId,
    description: "Test task description- 4",
    completed: true,
    owner: successUser2._id

}

const setupTestData = async () => {
    await User.deleteMany()
    await Task.deleteMany()

    await new User(successUser).save()
    await new User(successUser2).save()
 
    await new Task(task1).save()
    await new Task(task2).save()
    await new Task(task3).save()
    await new Task(task4).save()
}

module.exports = {
    successUserId,
    successUser,
    successUser2Id,
    successUser2,
    failureUser,
    task1,
    task2,
    task3,
    task4,
    setupTestData
}