const appendSheriffBadge = () => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].role == 'Sheriff') {
            $('#' + players[i].id).find('.player-status').append($('#template-badge').html())
            $('#' + players[i].id).find('.player-badge').find('img').attr('src', 'assets/game/roles/' + players[i].role.toLowerCase() + '.png').attr('title', players[i].role)
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

            // Status
            for (let i = 0; i < player.maxBullet; i++)
                playerContainer.find('.player-counters').append($('#template-bullet').html())
            break
        }
    }
}

const initCardCountUI = () => {
    for (let i = 0; i < players.length; i++) {
        $('#' + players[i].id).find('.player-counter-card').html(players[i].cards.length + ' in hands')
    }
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