const generateMessage = (username, text) => {
    return {
        username,
        text,
        createAt: new Date().getTime()
    }
}

const generateLocation = (username, url) => {
    return {
        username,
        location: url,
        createAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}