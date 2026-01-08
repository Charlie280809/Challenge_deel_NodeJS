require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Bag = require('./models/Bag')
const User = require('./models/User')
const auth = require('./middleware/auth')

// const Config = require("./models/config");
const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

//MongoDB verbinding
const dbUrl = process.env.MONGO_URL;
if (!dbUrl) {
    console.error("Missing MONGO_URL environment variable. Set it and redeploy.");
    process.exit(1);
}
mongoose.connect(dbUrl)
    .then(() => { console.log(`connected to ${dbUrl}`); })
    .catch((err) => {
        console.error("MongoDB verbindingsfout:", err);
        process.exit(1);
    });


//Alle bags ophalen
app.get('/api/v1/bag', async (req, res) => {
    const bags = await Bag.find()
    res.json(bags)
})


//Nieuwe bag toevoegen
app.post('/api/v1/bag', auth, async (req, res) => {
    const bag = await Bag.create(req.body)
    res.json(bag)
})

//Bag verwijderen op id
app.delete('/api/v1/bag/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403)
    await Bag.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
})

//Nieuwe user registreren
app.post('/api/v1/user', async (req, res) => {
    const hashed = await bcrypt.hash(req.body.password, 10)
    const user = await User.create({ ...req.body, password: hashed })
    res.json(user)
})

//User login
app.post('/api/v1/user/auth', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.sendStatus(401)

    const ok = await bcrypt.compare(req.body.password, user.password)
    if (!ok) return res.sendStatus(401)

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET
    )

    res.json({ token })
})

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Mongo connected')

        app.listen(port, () => {
            console.log(`API running on port ${port}`)
        })
    } catch (err) {
        console.error(err)
    }
}

start()

// app.listen(port, () => {
//     console.log(`Server draait op poort ${port}!!`);
// });