// *** shortHand

const name = "Jayshree"
const userAge = 23
const country = "India"

    // When variable and object property reference is same
const user = {
    name,
    age: userAge,
    country
}
console.log(user)






// *** Object Destructuring

const product = {
    label: "Book-1",
    price: 200,
    stoke: 100,
    seller: undefined
}
    // Lengthy process 
    // const label = product.label
    // const stoke = product.stoke

    // Alternative
// const {label, stoke, seller} = product
// console.log(label, stoke, seller)





// Renaming variable using Destructuring
// const {label:renamedLabelProduct} = product
// console.log(renamedLabelProduct)

// Assign default value when property not defined in object
// const {rating=5} = product
// console.log(rating)


// Destructure in function argument

const transaction = (type, count, {label, price}) => {
    console.log("Total order for below labeled book", label ," and final price is:", count*price)
}

transaction('order', 2, product)