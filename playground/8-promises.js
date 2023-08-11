const workPromise = new Promise( (resolve, reject) => {
    setTimeout( () => {
        // resolve([1,2,3])
        reject("Error!")
    }, 2000)
})


workPromise.then( (result) => {
    console.log("success", result)
}).catch( (error) => {
    console.log("Error", error)
})