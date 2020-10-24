exports.cardController = function (req, res){
    testModel.find().select('suit number text').exec((err, records) => {
        res.json(records)
    })
}

