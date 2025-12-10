require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Config = require("./models/config");
const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

//MongoDB verbinding
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    })
    .then(() => { console.log("MongoDB verbonden"); })
    .catch((err) => { console.error("MongoDB verbindingsfout:", err); });


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
    console.log(`Server draait op poort ${port}`);
});