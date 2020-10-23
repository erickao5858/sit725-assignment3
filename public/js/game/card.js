let cards, drawpileCards

$(() => {
    getCards()
})

const initDrawpile = () => {
    drawpileCards = cards
    $('#draw-pile').children().eq(0).text(drawpileCards.length + ' cards')
}

const getCards = () => {
    $.get('/readCards', (data) => {
        cards = data
        initDrawpile()
    })
}