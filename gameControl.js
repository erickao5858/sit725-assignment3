class GameControl {
    constructor(players, cards) {
        this.players = players
        this.cards = cards
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

}

module.exports = GameControl