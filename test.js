/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 * @param {mongoose} mongoose database object 
 */

module.exports = (mongoose) => {
    const TestSchema = new mongoose.Schema({
        suit: {
            type: String,
            enum: ['clubs', 'hearts', 'diamonds', 'spades']
        },
        number: {
            type: Number,
            min: 1,
            max: 9
        },
        text: {
            type: String,
            enum: ['Bang!', 'Missed', 'Beer', 'Saloon', 'Stagecoach', 'General store', 'Panic!', 'Cat Balou', 'Gatling', 'Indians!', 'Duel', 'Mustang', 'Scope', 'Barrel', 'Remington', 'Volcanic', 'Rev. Carabine', 'Winchester', 'Schofield']
        },
        description: {
            type: String
        }
    }, {
        collection: 'cards'
    })
    let testModel = mongoose.model('TestModel', TestSchema)

    let module = {}
    module.insert = () => {
        const cards = require('./card.json')
        let title
        for (let i = 0; i < cards.length; i++) {
            switch (cards[i].text) {
                case 'Bang!':
                    title = "Offence card: shot a player within attack range";
                    break;
                case 'Missed!':
                    title = "Defence card: evade an attack";
                    break;
                case 'Beer':
                    title = "Utility card: regain a bullet";
                    break;
                case 'Saloon':
                    title = "Utility card: everyone regain a bullet";
                    break;
                case 'Stagecoach':
                    title = "Utility card: draw two cards";
                    break;
                case 'General store':
                    title = "Utility card: everyone pick a card";
                    break;
                case 'Panic!':
                    title = "Offence card: draw a card from another player within attack range (ignore weapon range)";
                    break;
                case 'Cat Balou':
                    title = "Offence card: discard a card from another player";
                    break;
                case 'Gatling':
                    title = "Offence card: shot a Bang! to all the other players";
                    break;
                case 'Indians!':
                    title = "Offence card: challenge all the other players";
                    break;
                case 'Duel':
                    title = "Offence card: challenge another player";
                    break;
                case 'Mustang':
                    title = "Equipment card: increase defence distance";
                    break;
                case 'Scope':
                    title = "Equipment card: increase attack range";
                    break;
                case 'Barrel':
                    title = "Equipment card: chance to avoid attack";
                    break;
                case 'Remington':
                    title = "Gun: attack range 3";
                    break;
                case 'Volcanic':
                    title = "Gun: attack range 1, can play any number of Bang!";
                    break;
                case 'Rev. Carabine':
                    title = "Gun: attack range 4";
                    break;
                case 'Winchester':
                    title = "Gun: attack range 5";
                    break;
                case 'Schofield':
                    title = "Gun: attack range 2";
                    break;
            }
            let instance = new testModel({ suit: cards[i].suit, number: cards[i].number, text: cards[i].text, description: title })
            instance.save((err) => {
                if (err) return handleError(err)
            })
        }
    }
    module.read = (res) => {
        testModel.find().select('suit number text').exec((err, records) => {
            res.send(records)
        })
    }
    return module
}

/* add this block to server.js
const Test = require('./test')(mongoose)
app.get('/readCards', (req, res) => {
    Test.read(res)
})

 */