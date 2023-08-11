const add = (callback) => {
    setTimeout(() => {
        callback("this is error", undefined)
        // callback(undefined, "Success")
    }, 2000)

}

add((error, result) => {
    if (error) {
        return console.log(error)
    }
    console.log(result)
})