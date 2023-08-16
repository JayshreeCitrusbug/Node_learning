const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { successUserId, successUser, successUser2Id, successUser2, task1, task2, task3, task4, setupTestData, failureUser } = require('./__mocks__/fixtures/db')

beforeEach(setupTestData)


// Success Test Case
test('Success create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .send({
            description: 'Task created by Jayshree'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()

    expect(task.completed).toEqual(false)
})

test('Success get all own tasks', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .expect(200)
    
    expect(response.body.length).toEqual(2)
})

test('Success get own task by id-1', async() => {
    const response = await request(app)
        .get(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .expect(200)

    const task = await Task.findById(task1._id)
    expect(task).toMatchObject({
            description: "Test task description- 1",
            completed: false,
            owner: successUserId
    })
})

test('Success get own completed task', async() => {
    const response = await request(app)
        .get('/tasks/?completed=true')
        .set('Authorization', `Bearer ${ successUser2.tokens[0].token }`)
        .expect(200)
    
    const task = await Task.findById(task4._id)
    expect(task.completed).toEqual(true)
})


test('Success update task owned by user', async() => {
    await request(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .send({
            "completed": true
        })
        .expect(200)

    const task = await Task.findById(task1._id)
    expect(task.completed).toEqual(true)
})

test('Success delete own task', async() => {
    const response = await request(app)
        .delete(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .expect(200)
    
    expect(response.body).toEqual({"detail": "Task deleted Successfully"})
})


// Failure Test Case
test('Failure create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .send({
            description: 'Task created by Jayshree'
        })
        .expect(401)

    expect(response.body).toEqual({"error": "Please authenticate."});
})

test('Failure create task without required field', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .send({
            completed: true
        })
        .expect(400)
})

test('Failure get task with different owner', async() => {
    const response = await request(app)
        .get(`/tasks/${task3._id}`)
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .expect(404)
})

test('Failure update task with different key', async() => {
    const response = await request(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .send({
            "details": "data"
        })
        .expect(400)
    expect(response.body).toEqual({
        "error": "Trying to update an instance that does not exists"
    })
})

test('Failure update task with unauthenticated user', async() => {
    const response = await request(app)
        .patch(`/tasks/${task1._id}`)
        .send({
            "description": "Task -1 description updated",
            "completed": true
        })
        .expect(401)
    const task = await Task.findById(task1._id)
    expect(task.description).not.toEqual("Task -1 description updated")
    
})

test('Failure update task owner', async() => {
    const response = await request(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .send({
            "owner": successUser2Id
        })
        .expect(400)
})

test('Failure update task of other owner', async() => {
    await request(app)
        .patch(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${ successUser2.tokens[0].token }`)
        .send({
            "completed": true
        })
        .expect(404)
})

test('Failure delete task with unauthenticated user', async() => {
    const response = await request(app)
        .delete(`/tasks/${task1._id}`)
        .expect(401)
    
    expect(response.body).toEqual({
        "error": "Please authenticate."
    })
})

test('Failure delete task with different owner', async() => {
    const response = await request(app)
        .delete(`/tasks/${task1._id}`)
        .set('Authorization', `Bearer ${ successUser2.tokens[0].token }`)
        .expect(404)
    
    expect(response.body).toEqual({
        "error": "Task not found within your task lists"
    })
})