const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
// const api = require('./assets/js/index.js');
const fs = require("fs");
var savedNotes = require("./db/db.json");

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

// Wildcard route to direct users to a 404 page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/404.html'))
);

// GET Route for savedNotes triggered by API call when save button is clicked
app.get("/api/notes", (req,res) => { 
    res.json(savedNotes)
});

// POST Route for savedNotes triggered by API call when save button is clicked
app.post("/api/notes", (req,res) => {
    // receive API call, save the request body to a variable
    let addNewNote = req.body;
    // add to array
    savedNotes.push(addNewNote);
    // write to db.json
    fs.writeFile("./db/db.json", JSON.stringify(savedNotes), (err) => {
        if (err) throw err;
        console.log("Note saved!");
        });
    });
    




app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
