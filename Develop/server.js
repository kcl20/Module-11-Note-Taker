const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
// const api = require('./assets/js/index.js');
const fs = require("fs");
var savedNotes = require("./db/db.json");

var noteID = 0;
function autoIncrementNoteID() {
    return noteID++;
}

const PORT = process.env.PORT || 3001;
const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

// GET Route for savedNotes triggered by API call when save button is clicked
app.get("/api/notes", (req,res) => { 
    res.json(savedNotes)
});

// Wildcard route to direct users to index page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);



// POST Route for savedNotes triggered by API call when save button is clicked
app.post("/api/notes", (req,res) => {
    // receive API call, save the request body to a variable
    let addNewNote = req.body;
    console.log(req.body);
    // add an id to the note
    addNewNote.id = autoIncrementNoteID();
    console.log(addNewNote);

    // add to array
    savedNotes.push(addNewNote);

    // write to db.json
    fs.writeFile("./db/db.json", JSON.stringify(savedNotes), (err) => {
        if (err) throw err;
        console.log("Note saved!");
        res.json(savedNotes);
        });
    });
    
// New Note ("+" write icon)

// Delete note
app.delete("/api/notes/:id", (req,res) => {
    const id = req.params.id;
    console.log("ID to delete:" + id);
    // keep only notes that don't match the id
    savedNotes = savedNotes.filter((note) => note.id != id);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes), (err) => {
        if (err) throw err;
        console.log("Note deleted!");
        });
    });


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
