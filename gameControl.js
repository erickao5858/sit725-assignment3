const { shuffle } = require('./js/utility')
const { ROLE_PRESET, CHARACTER_PRESET } = require('./js/preset')
class GameControl {
    constructor(cards) {
        this.players = []
        this.drawpile = cards
        this.discardpile = []
    }

    draw = (playerID, times) => {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id == playerID) {
                for (let j = 0; j < times; j++) {
                    this.players[i].cards.push(this.drawpile.splice(Math.floor(Math.random() * this.drawpile.length), 1)[0])
                }
            }
        }
    }

    initDraw = () => {
        for (let i = 0; i < this.players.length; i++) {
            this.draw(this.players[i].id, 2)
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

        this.initDraw()
    }
}

module.exports = GameControl