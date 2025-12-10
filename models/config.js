const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    naam: {
        type: String,
        required: true
    },
    kleur: {
        type: String,
    },
    smaak: {
        type: String,
        required: true
    },
    datum: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Config', configSchema);