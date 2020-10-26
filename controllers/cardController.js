//Exporting from router
//@Author: Jasdeep kaur (kaurjasdee@deakin.edu.au)

const cards = require('../models/cards');
exports.cardController = function(req, res) {
    cards.find().select('_id suit number text image description').exec((err, records) => {
        res.json(records)
    })
}