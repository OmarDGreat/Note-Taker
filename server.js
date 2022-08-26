
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

//Static middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Function to delete specific note based on id
function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
  }


//API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        // concat data with the notes array
        notes = [].concat(JSON.parse(data));
        res.json(notes);
    });
} );

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        notes = [].concat(JSON.parse(data));
        let newNote;
        if (!notes.length) {
            newNote = {
                id: 1,
                ...req.body
            };
        } else {
            newNote = {
                id: notes[notes.length-1].id + 1,
                ...req.body
            };
        }
        notes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(notes);
        } );
    } );
} );

// API Route delete request
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        notes = [].concat(JSON.parse(data));
        const note = findById(req.params.id, notes);
        notes.splice(notes.indexOf(note), 1);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(notes);
        } );
    } );
} );


//HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
} );

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
} );


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    });

