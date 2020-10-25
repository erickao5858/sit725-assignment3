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
            enum: ['Bang!', 'Missed!', 'Beer', 'Saloon', 'Stagecoach', 'General store', 'Panic!', 'Cat Balou', 'Gatling', 'Indians!', 'Duel', 'Mustang', 'Scope', 'Barrel', 'Remington', 'Volcanic', 'Rev. Carabine', 'Winchester', 'Schofield']
        },
        description: {
            type: String
        },
        image: {
            type: String
        }
    }, {
        collection: 'cards'
    })
    let testModel = mongoose.model('TestModel', TestSchema)

    let module = {}
    module.insert = () => {
        const cards = require('../card.json')
        let title, image
        for (let i = 0; i < cards.length; i++) {
            switch (cards[i].text) {
                case 'Bang!':
                    title = "Offence card: shot a player within attack range";
                    image = "assets/game/cards/bang.png"
                    break;
                case 'Missed!':
                    title = "Defence card: evade an attack";
                    image = "assets/game/cards/missed.png"
                    break;
                case 'Beer':
                    title = "Utility card: regain a bullet";
                    image = "assets/game/cards/beer.png"
                    break;
                case 'Saloon':
                    title = "Utility card: everyone regain a bullet";
                    image = "assets/game/cards/saloon.png"
                    break;
                case 'Stagecoach':
                    title = "Utility card: draw two cards";
                    image = "assets/game/cards/stagecoach.png"
                    break;
                case 'General store':
                    title = "Utility card: everyone pick a card";
                    image = "assets/game/cards/general_store.png"
                    break;
                case 'Panic!':
                    title = "Offence card: draw a card from another player within attack range (ignore weapon range)";
                    image = "assets/game/cards/panic.png"
                    break;
                case 'Cat Balou':
                    title = "Offence card: discard a card from another player";
                    image = "assets/game/cards/cat_balou.png"
                    break;
                case 'Gatling':
                    title = "Offence card: shot a Bang! to all the other players";
                    image = "assets/game/cards/gatling.png"
                    break;
                case 'Indians!':
                    title = "Offence card: challenge all the other players";
                    image = "assets/game/cards/indians.png"
                    break;
                case 'Duel':
                    title = "Offence card: challenge another player";
                    image = "assets/game/cards/duel.png"
                    break;
                case 'Mustang':
                    title = "Equipment card: increase defence distance";
                    image = "assets/game/cards/mustand.png"
                    break;
                case 'Scope':
                    title = "Equipment card: increase attack range";
                    image = "assets/game/cards/scope.png"
                    break;
                case 'Barrel':
                    title = "Equipment card: chance to avoid attack";
                    image = "assets/game/cards/barrel.png"
                    break;
                case 'Remington':
                    title = "Gun: attack range 3";
                    image = "assets/game/cards/remington.png"
                    break;
                case 'Volcanic':
                    title = "Gun: attack range 1, can play any number of Bang!";
                    image = "assets/game/cards/volcanic.png"
                    break;
                case 'Rev. Carabine':
                    title = "Gun: attack range 4";
                    image = "assets/game/cards/rev_carabine.png"
                    break;
                case 'Winchester':
                    title = "Gun: attack range 5";
                    image = "assets/game/cards/winchester.png"
                    break;
                case 'Schofield':
                    title = "Gun: attack range 2";
                    image = "assets/game/cards/schofield.png"
                    break;
            }
            let instance = new testModel({ suit: cards[i].suit, number: cards[i].number, text: cards[i].text, description: title, image: image })
            instance.save((err) => {
                if (err) return console.log(err)
            })
        }
    }
    module.read = (res) => {
        testModel.find().select('_id suit number text image description').exec((err, records) => {
            res.json(records)
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