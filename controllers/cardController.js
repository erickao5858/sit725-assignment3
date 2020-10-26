//Exporting from router
//@Author: Jasdeep kaur (kaurjasdee@deakin.edu.au)

const cards = require('../models/card');
exports.cardController = function (req, res){
    cards.find().select('suit number text').exec((err, records) => {
        res.json(records)
    })
}

