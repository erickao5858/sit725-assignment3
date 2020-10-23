let cards, drawpileCards, discardpileCards

$(() => {
    getCards()
})

const initDrawpile = () => {
    drawpileCards = cards
    discardpileCards = cards.slice(0, 5)
    $('#draw-pile').children().eq(0).text(drawpileCards.length + ' cards')
}

const getCards = () => {
    $.get('/readCards', (data) => {
        cards = data
        initDrawpile()
        appendCards()
    })
}