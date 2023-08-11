// const validator = require("validator")
// const chalk = require("chalk")
const yargs = require("yargs")
const notes = require("./notes.js")

// const  title = require("process")


// const note = notes.getNotes("First note")
// console.log(note)

// console.log(validator.isURL('email.com'))
// console.log(chalk.blue.bold.inverse('Success!'));  

// console.log(process.argv)
console.log("---------------------------------------")



// Custom commands using yargs
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title:{
            describe: 'Title of note',
            demandOption: true,
            type: 'string',
        },
        body:{
            describe: 'Body of note',
            demandOption: true,
            type: 'string',
        }
    },
    handler(argv) {
        notes.addNote(argv.title, argv.body)
    }
})
// Remove note
yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder: {
        title: {
            describe: 'Title of note',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.removeNotes(argv.title)
    }
})
// List all notes
yargs.command({
    command: 'list',
    describe: 'List all notes',
    handler() {
        notes.listNotes()
    }
})
yargs.command({
    command: 'read',
    describe: 'read a specific note',
    builder: {
        title: {
            describe: 'Title of note',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.readNote(argv.title)
    }
})


yargs.parse()
// console.log(yargs.argv)