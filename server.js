
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;



//Static middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        notes.push(req.body);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(notes);
        } );
    } );
} );

// API Route delete request
app.delete('/api/notes/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id);
    fs.readFileAsync('./db/db.json', 'utf8').then (data => {
        const notes = [].concat(JSON.parse(data));
        const newNotesData = [];
        notes.forEach(note => { if (note.id !== idToDelete) newNotesData.push(note); } );
        fs.writeFile('./db/db.json', JSON.stringify(newNotesData), (err) => {
            if (err) throw err;
            res.json(newNotesData);
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

