const generateMessage = (text) => {
    return {
        text,
        createAt: new Date().getTime()
    }
}

const generateLocation = (url) => {
    return {
        location: url,
        createAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}