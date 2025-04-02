const express = require('express') 
const app = express() 
const cors = require('cors') 
const port = 3000 

const phoneBook = {}

app.use(cors())
app.use(express.json());

// responsible to list contacts or get a specific contact
app.get('/blogposts', (req, res) => {
    if (req.query.id) {
        // it means that there's an id as a query string parameter (/contacts?id=5555)
        // i need to create an object and then populate it
        const toReturn = {} // creating an empty object
        toReturn[req.query.id] = phoneBook[req.query.id]
        res.send(toReturn)

    } else {
        res.send(phoneBook) // /contacts
    }
})

// responsible for adding new contacts to the phoneBook
app.post('/blogposts', (req, res) => {
    phoneBook[req.body.phone_number] = req.body.name
    res.send(phoneBook)
})

// responsible for updating a contact
app.put('/blogposts', (req, res) => {
    phoneBook[req.body.phone_number] = req.body.name
    if (req.body.phoneBook != req.body.old_id) {
        delete phoneBook[req.body.old_id]
    }
    res.send(phoneBook)
})

// responsible for deleting a contact 
app.delete('/blogposts', (req, res) => {
    const phoneNumber = req.query.id
    delete phoneBook[phoneNumber]
    res.send(phoneBook)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
