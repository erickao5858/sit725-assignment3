//Setting up the schema for card model.
//@Author: Jasdeep kaur (kaurjasdee@deakin.edu.au)
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cards = Schema({
    index:{
        type: Number,
        required: true,
        trim: true,
    },
    suit:{
        type: String,
        required: true,
        trim: true,
    },
    Number:{
        type: Number,
        required: true,
        trim: true,
    },
    isActive:{
        type: Boolean,
        required: true,
    },
    text:{
        type: String,
        required: true,
        trim: true,
    }
});
module.exports = mongoose.model('cards',cards);