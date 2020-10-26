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

const emptyHandsUI = () => {
    $('#card-wrapper').empty()
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

const playerWin = () => {
    updateTips(TIPS_WIN)
}

const playerLose = () => {
    updateTips(TIPS_LOSE)
}

const updateCardCountUI = (playerID, amount) => {
    $('#' + playerID).find('.player-counter-card').html(amount + ' in hands')
}

let isInDiscardPhase = false
const cardOnClick = (event) => {
    let card = event.data.card
    if (isInDiscardPhase) {
        discardCard([me.id, card._id])
        return
    }
    if (isWin || isLose) {
        M.toast({ html: 'Game is over' })
        return
    }
    if (isMyTurn) {
        M.toast({ html: event.data.card._id + " clicked!" })
        discardPile.push(event.data.card)
        updateDiscardPile();
        if (card.text == 'Bang!' || card.text == 'Panic!' || card.text == 'Cat Balou' || card.text == 'Duel') {
            let cardContainer = $('#card-wrapper'),
                targetContainer = $('#target-wrapper')
            cardContainer.hide()
            targetContainer.show()
            updateTargetUI(card._id)
            updateTips(TIPS_CHOOSETARGET)
            return
        }
        if (card.text == 'Scope' || card.text == 'Mustang' || card.text == 'Barrel' || card.text == 'Remington' || card.text == 'Rev. Carabine' || card.text == 'Winchester' || card.text == 'Volcanic' || card.text == 'Schofield') {
            playerEquipmentCard([me.id, card._id])
        }
    } else
        M.toast({ html: 'Not your turn' })
}

const pass = () => {
    if (isWin || isLose) {
        M.toast({ html: 'Game is over' })
        return
    }
    if (!isMyTurn) {
        M.toast({ html: 'Not your turn' })
        return
    }
    if (me.cards.length <= me.bullets) {
        isMyTurn = false
        isInDiscardPhase = false
        updateTips(TIPS_WAITING)
        endTurn(me.id)
    } else {
        updateTips(TIPS_DISCARD)
        isInDiscardPhase = true
    }
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
                    cancel()
                    playCardTo([me.id, players[i].id, cardID])
                })
        }
    }
}

const playerDie = (player) => {
    $('#' + player.id).find('.player-name').css('text-decoration', 'line-through')
    $('#' + player.id).find('.player-counter-card').css('text-decoration', 'line-through')
    $('#' + player.id).find('.player-equipments').css('text-decoration', 'line-through')
    if (player.id != me.id)
        appendBadge(player.id)
}

const TIPS_MYTURN = 0,
    TIPS_CHOOSETARGET = 1,
    TIPS_WAITING = 2,
    TIPS_DEAD = 3,
    TIPS_DISCARD = 4,
    TIPS_WIN = 5,
    TIPS_LOSE = 6

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
        case TIPS_DEAD:
            tips.html('Game Over')
            break
        case TIPS_DISCARD:
            tips.html('Cards over bullets, please discard cards')
            break
        case TIPS_WIN:
            tips.html('Congratulation, you win!')
            break
        case TIPS_LOSE:
            tips.html('You lose!')
            break
    }
}