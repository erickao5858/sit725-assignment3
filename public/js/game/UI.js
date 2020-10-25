const initUI = () => {
    // Disable drag function on image
    $('img').attr('draggable', false);
    reorderPlayers()
    appendPlayerUILower()
    appendPlayerUIMiddle()
    appendPlayerUIUpper()
    appendSheriffBadge()
    appendBadge(me.id)
    updateHandsUI()
    initCardCountUI()
    updateDrawpile()
}

const updateDrawpile = () => {
    $('#draw-pile').find('b').html(drawpile.length + ' cards')
}

const appendBadge = (playerID) => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].role == 'Sheriff') continue
        if (players[i].id == playerID) {
            $('#' + players[i].id).find('.player-status').append($('#template-badge').html())
            $('#' + players[i].id).find('.player-badge').find('img').attr('src', 'assets/game/roles/' + players[i].role.toLowerCase() + '.png').attr('title', players[i].role)
        }
    }
}

const lostBullet = (playerID) => {
    let player = $('#' + playerID).find('.player-counter-life')
    let bullets = player.find('img')
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets.eq(i).attr('src') == 'assets/game/misc/bullet.png') {
            bullets.eq(i).attr('src', 'assets/game/misc/bullet1.png')
            break
        }
    }
}

const regainBullet = (playerID) => {
    let player = $('#' + playerID).find('.player-counter-life')
    let bullets = player.find('img')
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets.eq(i).attr('src') == 'assets/game/misc/bullet1.png') {
            bullets.eq(i).attr('src', 'assets/game/misc/bullet.png')
            break
        }
    }
}

const updateHandsUI = () => {
    $('#card-wrapper').children().slice(1).remove()
    for (let i = 0; i < me.cards.length; i++) {
        $('#card-wrapper').append($('#template-card').html())
        let card = $('#card-wrapper').children().last().find('img')
        $('#card-wrapper').children().last().append('<div style="font-size:90%;">' + me.cards[i].text + '</div>')
        card.attr('id', me.cards[i]._id)
            .attr('src', me.cards[i].image)
            .attr('title', me.cards[i].description)
            .on('click', { card: me.cards[i] }, cardOnClick)
    }
}


const updateCardCountUI = (playerID, amount) => {
    $('#' + playerID).find('.player-counter-card').html(amount + ' in hands')
}

let discardPile = []

// card: event.data.card
const cardOnClick = (event) => {
    let card = event.data.card
    if (isMyTurn) {
        if (card.text == 'Bang!' || card.text == 'Panic!' || card.text == 'Cat Balou' || card.text == 'Duel') {
            let cardContainer = $('#card-wrapper'),
                targetContainer = $('#target-wrapper')
            cardContainer.hide()
            targetContainer.show()
            updateTargetUI(card._id)
            updateTips(TIPS_CHOOSETARGET)
        }
    } else
        M.toast({ html: 'not your turn' })
}

let isPassClicked = false

const pass = () => {
    if (!isMyTurn) {
        M.toast({ html: 'not your turn' })
        return
    }
    if (!isPassClicked) {
        M.toast({ html: 'Click pass again to confirm!' })
        isPassClicked = true
        setTimeout(() => {
            isPassClicked = false
        }, 2000)
        return
    }
    isMyTurn = false
    updateTips(TIPS_WAITING)
    socket.emit('endTurn', me.id)
}

const cancel = () => {
    let cardContainer = $('#card-wrapper'),
        targetContainer = $('#target-wrapper')
    cardContainer.show()
    targetContainer.hide()
    updateTips(TIPS_MYTURN)
}

const updateTargetUI = (cardID) => {
    let targetContainer = $('#target-wrapper')

    // clear targets
    targetContainer.children().slice(1).remove()
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == me.id || players[i].isDead == true) continue
        else {
            $('#target-wrapper').append($('#template-card').html())
            let target = $('#target-wrapper').children().last()
            $('#target-wrapper').remove('img')

            target.html(players[i].character + '(' + players[i].name + ')')
                .css('text-align', 'center')
                .on('click', () => {
                    me.cards.splice(me.cards.indexOf(me.cards.find((card) => card._id == cardID)), 1)
                    cancel()
                    updateHandsUI()
                    playCardTo([me.id, players[i].id, cardID])
                })
        }
    }
}

const playerDie = (player) => {
    updateCardCountUI(player.id, 0)
    $('#' + player.id).find('.player-name').css('text-decoration', 'line-through')
    $('#' + player.id).find('.player-counter-card').css('text-decoration', 'line-through')
    $('#' + player.id).find('.player-equipments').css('text-decoration', 'line-through')
    appendBadge(player.id)
}

const TIPS_MYTURN = 0,
    TIPS_CHOOSETARGET = 1,
    TIPS_WAITING = 2

const updateTips = (mode) => {
    let tips = $('#tips').children().eq(0)
    switch (mode) {
        case TIPS_MYTURN:
            tips.html('Your turn')
            break
        case TIPS_CHOOSETARGET:
            tips.html('Choose a target')
            break
        case TIPS_WAITING:
            tips.html('Waiting for other players to perform an action')
            break
    }
}