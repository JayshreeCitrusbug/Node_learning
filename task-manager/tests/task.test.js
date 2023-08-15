const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { successUserId, successUser, successUser2Id, successUser2, failureUser, setupTestData } = require('./__mocks__/fixtures/db')

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

test('Success get all task of user-1', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .expect(200)
    
    expect(response.body.length).toEqual(2)
})

// Failure Test Case