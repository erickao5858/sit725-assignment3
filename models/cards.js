//Setting up the schema for card model.
//@Author: Jasdeep kaur (kaurjasdee@deakin.edu.au)
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cards = Schema({
    suit: {
        type: String
    },
    number: {
        type: Number
    },
    text: {
        type: String,
    },
    description: {
        type: String
    },
    image: {
        type: String
    }
}, {
    collection: 'cards'
});
const cardsData = mongoose.model('cards', cards);

module.exports = cardsData;
// module.exports = mongoose.model('cards',cards);