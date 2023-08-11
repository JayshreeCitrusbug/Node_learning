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

const id = new ObjectId();
// console.log("id", id)
// console.log("id", id.getTimestamp())
// console.log("id", id.id.length)
 
async function main() {
    const client = await MongoClient.connect(connectionURL);
    const db = client.db(dbName)

    // Get by name
    db.collection('users').findOne({name: "Jayshree" }, (error, user) => {
        if (error) {
            return console.log("Unable to fetch user")
        }
        console.log(user)
    }).then( (response) => {
        console.log(response)
    })

    // Get record by id
    db.collection('users').findOne({ _id: new ObjectId("64d0f2037aaa6271134d6b61") }, (error, user) => {
        if (error) {
            return console.log("Unable to fetch user")
        }
        console.log(user)
    }).then( (response) => {
        console.log(response)
    })

    // Get many document
    db.collection('users').find( {name:"Jayshree"} ).toArray().then((response) => {
        console.log("response")
        console.log(response)
    })

}

main().catch(console.error);