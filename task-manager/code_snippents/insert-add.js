// const mongodb =  require('mongodb')
// const MongoClient = mongodb.MongoClient

// // Connection URL
// const connectionURL = 'mongodb://127.0.0.1:27017'
// const databaseName = 'task-manager'

// MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
//     console.log("Connected Successfully")
//     if (error) {
//         return console.log("Unable to connect to the database")
//     }

// })

const { MongoClient, ObjectId } = require("mongodb");
 
const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";

// Explored General usage of ObjectId()....................................................
// const id = new ObjectId();
// console.log("id", id)
// console.log("id", id.getTimestamp())
// console.log("id", id.id.length)
 
async function main() {
    const client = await MongoClient.connect(connectionURL);
    const db = client.db(dbName)
// insert one....................................................
    // let finalData = await db.collection('users').insertOne({
    //     // _id: id,
    //     name: 'Testing with id',
    //     age: 10
    // }, (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert data in users")
    //     }
    //     console.log(result.result)
    // })
    // console.log(finalData)


// insert many....................................................
    // db.collection('users').insertMany([{
    //     name: "Testing user",
    //     age: 25
    // },
    // {
    //     name: "Testing user2",
    //     age: 23,
    // }]).then((response) => {
    //     console.log("response")
    //     console.log(response) 
    // })

// Task:....................................................
    // db.collection('tasks').insertMany([{
    //         description: "This is task description",
    //         completed: true
    //     },
    //     {
    //         description: "Second task description",
    //         completed: false
    //     },
    //     {
    //         description: "Third task description",
    //         completed: true
    //     }]).then((response) => {
    //         console.log("response")
    //         console.log(response)
    //     })

}
 
main().catch(console.error);