const fs = require('fs')
const chalk = require("chalk")



// const getNotes = (note) => { 
//     return note
// }

// Add new Note
const addNote = (title, body) => {
    const notes = loadNotes()
    // const isDuplicates = notes.filter((note) => note.title === title)
    const isDuplicate = notes.find((note) => note.title === title)

    debugger
    
    if (!isDuplicate) {
        notes.push({
            title: title,
            body: body
        })
        console.log(chalk.green("New note added successfully!"))
    }
    else{
        console.log(chalk.red("Note already exists with this title"))
    }

    saveNotes(notes)
}

// Remove Note
const removeNotes = (title) => {
    const allNotes = loadNotes()
    const noteAfterRemoved = allNotes.filter((item) => item.title !== title)

    if(noteAfterRemoved.length < allNotes.length) {
        saveNotes(noteAfterRemoved)
        console.log(chalk.green("Note removed with title: ", title))
    }
    else{
        console.log(chalk.red("No matching data found"))
    }

}

// list Notes with all all notes title
const listNotes = () => {
    const allNotes = loadNotes()

    console.log(chalk.blue.underline.bold.bgYellow("Your notes with title..."))
    allNotes.forEach((note) => {
        console.log(note.title)
    });
}

// Read specific note data
const readNote = (title) => {
    const allNotes = loadNotes()

    const findNote = allNotes.find((note) => note.title === title)

    if(findNote){
        console.log(chalk.bold.blue.italic("Title: ", findNote.title))
        console.log(chalk.yellow("Body: ", findNote.body))
    }
    else{
        console.log(chalk.red("No matching Note found"))
    }
}

const saveNotes = (notes) => {
    const updatedNotesJson = JSON.stringify(notes)
    fs.writeFileSync('notes.json', updatedNotesJson)
}

const loadNotes = () => {
    try{
        const bufferData = fs.readFileSync('notes.json')
        const jsonData = bufferData.toString()
        return JSON.parse(jsonData)
    }
    catch (e) {
        return []
    }
}



// Export function into other file
module.exports = {
    // getNotes: getNotes,
    addNote: addNote,
    removeNotes: removeNotes,
    listNotes: listNotes,
    readNote: readNote,
}