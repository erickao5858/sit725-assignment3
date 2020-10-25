//Setting up the schema for character model.
//@Author: Jasdeep kaur (kaurjasdee@deakin.edu.au)
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var characters = Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    bullets:{
        type: Number,
        required: true,
        trim: true,
    },
    ability:{
        type: String,
        required: true,
        trim: true,
    },
    
    
});
module.exports = mongoose.model('characters',characters);