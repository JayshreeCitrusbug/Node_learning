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

    // db.collection('users').updateOne( {
    //     _id: new ObjectId("64d1dd2ec885078a4b9361af")
    // }, {
    //     $set: {
    //         name: "Jayshree J"
    //     }
    // }).then( (result) => {
    //     console.log(result)
    // }).catch( (error) => {
    //     console.log(error)
    // })

// Update many....................................................
    db.collection('users').updateMany({
        name: "Test user"
    }, {
        $set: {
            age: 20
        }
    }).then( (result) => {
        console.log(result)
    }).catch( (error) => {
        console.log(error)
    })

}

main().catch(console.error);