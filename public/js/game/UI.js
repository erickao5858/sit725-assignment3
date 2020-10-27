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

const updateBullet = (playerID, maxBullet, currentBullet) => {
    let player = $('#' + playerID).find('.player-counters')
    player.children().slice(1).remove()
    for (let i = 0; i < currentBullet; i++) {
        player.append($('#template-bullet').html())
    }
    for (let i = currentBullet; i < maxBullet; i++) {
        player.append($('#template-bullet').html())
        player.children().last().children().attr('src', 'assets/game/misc/bullet1.png')
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

let isInDiscardPhase = false,
    isInResponsePhase = false,
    isInWaitingResponsePhase = false,
    responsePlayerID, isPlayedBang = false

const cardOnClick = (event) => {
    let card = event.data.card
    if (isInResponsePhase) {
        responseBang(card)
        return
    }
    if (isInWaitingResponsePhase) {
        M.toast({ html: 'Someone is responsing to your action, please wait' })
        return
    }
    if (isInDiscardPhase) {
        discardCard([me.id, card._id])
        return
    }
    if (isWin || isLose) {
        M.toast({ html: 'Game is over' })
        return
    }
    if (!isMyTurn) {
        M.toast({ html: 'Not your turn' })
        return
    }
    if (isMyTurn) {
        if (card.text == 'Bang!') {
            if (isPlayedBang) {
                if (me.character == 'Willy the kid' || $('#' + me.id).find('.equipment-gun').find('b').html() == 'Volcanic') {

                } else {
                    M.toast({ html: 'Cannot play Bang! in this turn anymore unless you play a Volcanic' })
                    return
                }
            }
            isPlayedBang = true
            let cardContainer = $('#card-wrapper'),
                targetContainer = $('#target-wrapper')
            cardContainer.hide()
            targetContainer.show()
            updateTargetUI(card)
            updateTips(TIPS_CHOOSETARGET)
            return
        }
        if (card.text == "Beer") {
            if (me.bullets == me.maxBullet) {
                M.toast({ html: 'Your health is full' })
                return
            }
            playBeer([me.id, card._id])
        }
        if (card.text == "Saloon") {
            playSaloon([me.id, card._id])
        }
        if (card.text == 'Scope' || card.text == 'Mustang' || card.text == 'Barrel' || card.text == 'Remington' || card.text == 'Rev. Carabine' || card.text == 'Winchester' || card.text == 'Volcanic' || card.text == 'Schofield') {
            playEquipment([me.id, card._id])
            return
        }
        if (card.text == "Stagecoach") {
            playStagecoach([me.id, card._id])
            return
        }
        if (card.text == "General store") {
            playGeneralStore([me.id, card._id])
            return
        }
    }
}

const pass = () => {
    if (isWin || isLose) {
        M.toast({ html: 'Game is over' })
        return
    }
    if (isInWaitingResponsePhase) {
        M.toast({ html: 'Someone is responsing to your action, please wait' })
        return
    }
    if (isInResponsePhase) {
        isInResponsePhase = false
        updateTips(TIPS_WAITING)
        endResponse(false)
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

const updateTargetUIBang = (card) => {
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
                    playBang([me.id, players[i].id, card._id])
                })
        }
    }
}

const updateTargetUI = (card) => {
    let targetContainer = $('#target-wrapper')

    // clear targets
    targetContainer.children().slice(1).remove()
    switch (card.text) {
        case 'Bang!':
            updateTargetUIBang(card)
            break
    }
}

const playerDie = (playerID) => {
    $('#' + playerID).find('.player-name').css('text-decoration', 'line-through')
    $('#' + playerID).find('.player-counter-card').css('text-decoration', 'line-through').html('')
    $('#' + playerID).find('.player-equipments').css('text-decoration', 'line-through')

    if (playerID != me.id)
        appendBadge(playerID)
}

const responseBang = (card) => {
    if (card.text == 'Missed!') {
        isInResponsePhase = false
        updateTips(TIPS_WAITING)
        discardCard([me.id, card._id])
        endResponse(true)
    } else {
        M.toast({ html: 'You must discard a Missed! to repel a Bang!' })
    }
}