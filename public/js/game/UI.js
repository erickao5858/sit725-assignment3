const initUI = () => {
    // Disable drag function on image
    $('img').attr('draggable', false);
    reorderPlayers()
    appendPlayerUILower()
    appendPlayerUIMiddle()
    appendPlayerUIUpper()
    appendBadges()
    updateHandsUI()
    updataCardCountUI()
    updateDrawpile()
}

const updateDrawpile = () => {
    $('#draw-pile').find('b').html(drawpile.length + ' cards')
}

const shift = (arr, n) => {
    let times = n > arr.length ? n % arr.length : n;
    return arr.concat(arr.splice(0, times));
}

const reorderPlayers = () => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == currentUserId) {
            players = shift([...players], i)
            break
        }
    }
}

const appendBadges = () => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].role == 'Sheriff') {
            $('#' + players[i].id).find('.player-status').append($('#template-badge').html())
            $('#' + players[i].id).find('.player-badge').find('img').attr('src', 'assets/game/roles/' + players[i].role.toLowerCase() + '.png').attr('title', players[i].role)
        } else if (players[i] == me) {
            $('#' + players[i].id).find('.player-status').append($('#template-badge').html())
            $('#' + players[i].id).find('.player-badge').find('img').attr('src', 'assets/game/roles/' + me.role.toLowerCase() + '.png').attr('title', me.role)
        }
    }
}
const appendPlayerUILower = () => {
    $('.lower-row').prepend($('#template-player').html())
    let playerContainer = $('.lower-row').children().eq(0)
    playerContainer.removeClass('s2')
    appendPlayerInformation(playerContainer, players[0])
}

const appendPlayerUIMiddle = () => {
    $('.middle-row').prepend($('#template-player').html())
    let playerContainer = $('.middle-row').children().eq(0)
    playerContainer.removeClass('s2')

    appendPlayerInformation(playerContainer, players[1])

    $('.middle-row').append($('#template-player').html())
    playerContainer = $('.middle-row').children().eq(3)
    playerContainer.removeClass('s2')
    appendPlayerInformation(playerContainer, players[players.length - 1])
    playerContainer.css('margin-left', '20%')
}
const appendPlayerUIUpper = () => {
    // s1 s4 s7 s10
    let offsets = []

    // Setup offset for different layout
    switch (players.length) {
        case 4:
            offsets = ['offset-s5']
            break
        case 5:
            offsets = ['offset-s3', 'offset-s2']
            break
        case 6:
            offsets = ['offset-s2', 'offset-s2', 'offset-s2']
            break
        case 7:
            offsets = ['offset-s1', 'offset-s1', 'offset-s1', 'offset-s1']
            break
    }
    // Append Player UI
    for (let i = 0; i <= players.length - 4; i++) {
        // Generate UI set using template
        $('.player-grid').append($('#template-player').html())

        // Get player
        let player = $('.player-grid').children().last()
        player.addClass(offsets[i])
        appendPlayerInformation(player, players[i + 2])
    }
}

const appendPlayerInformation = (playerContainer, player) => {
    for (let i = 0; i < players.length; i++) {
        if (players[i] == player) {

            playerContainer.attr('id', player.id)

            // Name
            playerContainer.find('.player-name').attr('title', player.ability).html('<b>' + player.character + '(' + player.name + ')' + '</b>')

            // Equipments
            playerContainer.find('.equipment-gun').attr('title', 'Default weapon: range 1').html('<b>Colt .45</b>')

            // TODO: play card and put equipment
            /*
            playerContainer.find('.equipment-barrel').attr('title', BARREL).html('<b>Barrel</b>')
            playerContainer.find('.equipment-mustang').attr('title', MUSTANG).html('<b>Mustang</b>')
            playerContainer.find('.equipment-scope').attr('title', SCOPE).html('<b>Scope</b>')
            */

            // TODO: update hand cards
            //

            // Status
            for (let i = 0; i < player.maxBullet; i++)
                playerContainer.find('.player-counters').append($('#template-bullet').html())
            break
        }
    }
}

const lostBullet = (playerID) => {
    let player = $('.player-container').eq(playerID)
    let bullets = player.find('img')
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets.eq(i).attr('src') == 'assets/game/misc/bullet.png') {
            bullets.eq(i).attr('src', 'assets/game/misc/bullet1.png')
            break
        }
    }
}

const regainBullet = (playerID) => {
    let player = $('.player-container').eq(playerID)
    let bullets = player.find('img')
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets.eq(i).attr('src') == 'assets/game/misc/bullet1.png') {
            bullets.eq(i).attr('src', 'assets/game/misc/bullet.png')
            break
        }
    }
}

const updateHandsUI = () => {
    for (let i = 0; i < me.cards.length; i++) {
        $('#card-wrapper').append($('#template-card').html())
        let card = $('#card-wrapper').children().last().find('img')
        $('#card-wrapper').children().last().append('<div style="font-size:90%;">' + me.cards[i].text + '</div>')
        card.attr('id', me.cards[i]._id)
        card.attr('src', me.cards[i].image)
        card.attr('title', me.cards[i].description)
        card.on('click', () => {
            M.toast({ html: me.cards[i]._id + " cliced!" })
        })
    }
}

const updataCardCountUI = () => {
    for (let i = 0; i < players.length; i++) {
        $('#' + players[i].id).find('.player-counter-card').html(players[i].cards.length + ' in hands')
    }
}