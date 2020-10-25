const { shuffle } = require('./js/utility')
const { ROLE_PRESET, CHARACTER_PRESET } = require('./js/preset')
class GameControl {
    constructor(cards) {
        this.players = []
        this.drawpile = cards
        this.discardpile = []
    }

    initDraw = () => {
        for (let i = 0; i < this.players.length; i++) {
            let card = this.drawpile.splice(0, 1)[0]
            this.players[i].cards.push(card)
            card = this.drawpile.splice(0, 1)[0]
            this.players[i].cards.push(card)
        }
    }
    preparePlayerData = (roomUsers) => {
        for (let i = 0; i < roomUsers.length; i++) {
            let player = {}
            player.id = roomUsers[i].id
            player.name = roomUsers[i].name
            player.isBot = roomUsers[i].isBot
            player.isDead = false
            this.players.push(player)
        }

        this.players = shuffle(this.players)

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].role = ROLE_PRESET[this.players.length - 4][i]
            let character = CHARACTER_PRESET[Math.floor(Math.random() * CHARACTER_PRESET.length)]
            this.players[i].character = character[0]
            this.players[i].ability = character[1]
            this.players[i].maxBullet = this.players[i].role == 'Sheriff' ? character[2] + 1 : character[2]
            this.players[i].cards = []
        }
    }
}

module.exports = GameControl