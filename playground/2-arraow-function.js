// simple function
const square = function (x){
    return x*x
}
console.log(square(2))

// Arrow function
const squareWithArrow = (x) => {
    return x*x
}
console.log(squareWithArrow(3))

const newType = (x) => x * x
console.log(newType(4))


const event = {
    eventName: "Birthday party",
    guestList: ["a", "b", "c"],
    printGuestList(){
        console.log("Guest list for", this.eventName)

        this.guestList.forEach((guest) => {
            console.log(guest, "is attending", this.eventName)
        })
    }
}
event.printGuestList()