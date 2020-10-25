//Exporting from router
//@Author: Jasdeep kaur (kaurjasdee@deakin.edu.au)
exports.characters = function (req, res){
    character.find().select('name bullet ability').exec((err, records) => {
        res.json(records)
    })
}
