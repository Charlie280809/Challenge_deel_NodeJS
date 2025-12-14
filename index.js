require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Config = require("./models/config");
const config = require('config');
const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

//MongoDB verbinding
// const dbUri = process.env.MONGO_URI || config.get('db.uri');
// const dbOptions = config.has('db.options') ? config.get('db.options') : {};
// console.log(dbUri);
// mongoose.connect(dbUri, dbOptions)
//     .then(() => { console.log(`connected to ${dbUri}`); })
//     .catch((err) => { 
//         console.error("MongoDB verbindingsfout:", err); 
//         process.exit(1);
//     });
const dbUri = process.env.MONGO_URI;
mongoose.connect(dbUri)
    .then(() => { console.log(`connected to ${dbUri}`); })
    .catch((err) => { 
        console.error("MongoDB verbindingsfout:", err); 
        process.exit(1);
    });


//Alle bags ophalen
app.get('/bag', async (req, res) => {
    try {
        const items = await Config.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//Nieuwe bag toevoegen
app.post('/bag', async (req, res) => {
    try {
        const nieuwItem = await Config.create(req.body);
        res.json(nieuwItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Bag verwijderen op id
app.delete('/bag/:id', async (req, res) => {
    try {
        const verwijderdItem = await Config.findByIdAndDelete(req.params.id);
        if(!verwijderdItem) {
            return res.status(404).json({ message: 'Item niet gevonden' });
        }
        res.json({ message: 'Item verwijderd', item: verwijderdItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server draait op poort ${port}!!`);
});