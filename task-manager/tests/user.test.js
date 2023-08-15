const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {successUserId, successUser, failureUser, setupTestData} = require('./__mocks__/fixtures/db')


beforeEach(setupTestData)

// Success Test Case
test('Success user signup', async () => {
    const response = await request(app).post('/users').send({
        name: 'Jayshree',
        email: 'jayshree.citrusbug@gmail.com',
        password: 'Abcd@1234'
    }).expect(201)

    // Assert the database updated with new user details
    const user = User.findOne({ email: response.body.user.email})
    expect(user).not.toBeNull()

    // console.log(user)

    expect(response.body).toMatchObject({
        user: {
            name: 'Jayshree',
            email: 'jayshree.citrusbug@gmail.com'
        }
    })
})

test('Success user login', async() => {
    const response = await request(app).post('/user/login').send({
        email: successUser.email,
        password: successUser.password
    }).expect(200)

    const user = await User.findById(successUserId)
    expect(response.body.jwtToken).toBe(user.tokens[1].token)
})

test('Success get user profile', async() => {
    await request(app)
        .get('/user/me')
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .send()
        .expect(200)
})

test('Success delete user account', async() => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${ successUser.tokens[0].token }`)
        .send()
        .expect(200)
    
        const user = await User.findById(successUserId)
        expect(user).toBeNull()

})

test('Success upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${successUser.tokens[0].token}`)
        .attach('avatar', 'tests/__mocks__/fixtures/profile-pic.png')
        .expect(200)

    const user = await User.findById(successUserId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Success update user', async() => {
    const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${successUser.tokens[0].token}`)
    .send({
        name: 'Jayshree',
        email: 'jayshree.citrusbug@yopmail.com'
    })
    .expect(200)

    const user = await User.findById(successUserId)
    expect(user.name).toEqual('Jayshree')
    expect(user.email).toEqual('jayshree.citrusbug@yopmail.com')
})


// Failure Test Case
test('Failure user login', async () => {
    await request(app).post('/user/login').send({
        email: successUser.email,
        password: ''
    }).expect(400)
})

test('Failure get user profile', async() => {
    const response = await request(app)
        .get('/user/me')
        .send()
        .expect(401)
    
        expect(response.body).toEqual({"error": "Please authenticate."});
})

test('Failure delete user account without authentication', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Failure delete user account with user not found', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${ failureUser.tokens[0].token }`)
        .send()
        .expect(404)
})

test('Failure update user with invalid key update', async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${successUser.tokens[0].token}`)
    .send({
        location: "India"
    })
    .expect(400)
})