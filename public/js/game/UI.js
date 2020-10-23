const PLAYER_ABILITY = '1 increased defence distance',
    PLAYER_CARDS = 5,
    GUN_ABILITY = 'Default weapon: range 1',
    BARREL = 'Defence equipment',
    MUSTANG = '1 increased defence distance',
    SCOPE = '1 decreased attack distance',
    NAME_COLT = 'Colt .45',
    NAME_BARREL = 'Barrel',
    NAME_MUSTANG = 'Mustang',
    NAME_SCOPE = 'Scope'

const PLAYER_COUNT = 5,
    SHERIFF_POSITION = 2

$(() => {
    // Disable drag function on image
    $('img').attr('draggable', false);
    appendPlayerUIUpper()
    appendPlayerUIMiddle()
    appendPlayerUILower()
    appendSheriffBadge()
})

const appendSheriffBadge = () => {
    $('.player-status').eq(SHERIFF_POSITION).append($('#template-badge').html())
}
const appendPlayerUILower = () => {
    $('.lower-row').prepend($('#template-player').html())
    let player = $('.lower-row').children().eq(0)
    player.removeClass('s2')
    appendPlayerInformation(player)
}

const appendPlayerUIMiddle = () => {
    $('.middle-row').prepend($('#template-player').html())
    let player = $('.middle-row').children().eq(0)
    player.removeClass('s2')

    appendPlayerInformation(player)

    $('.middle-row').append($('#template-player').html())
    player = $('.middle-row').children().eq(3)
    player.removeClass('s2')
    appendPlayerInformation(player)
    player.css('margin-left', '20%')
}
const appendPlayerUIUpper = () => {
    // s1 s4 s7 s10
    let offsets = []

    // Setup offset for different layout
    switch (PLAYER_COUNT) {
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
    for (let i = 0; i <= PLAYER_COUNT - 4; i++) {
        // Generate UI set using template
        $('.player-grid').append($('#template-player').html())

        // Get player
        let player = $('.player-grid').children().last()
        player.addClass(offsets[i])
        appendPlayerInformation(player)
    }
}

const appendPlayerInformation = (player) => {
    // Name
    player.find('.player-name').attr('title', PLAYER_ABILITY).html('<b>Paul Regret(Luise)</b>')

    // Equipments
    player.find('.equipment-gun').attr('title', GUN_ABILITY).html('<b>Colt .45</b>')
    player.find('.equipment-barrel').attr('title', BARREL).html('<b>Barrel</b>')
    player.find('.equipment-mustang').attr('title', MUSTANG).html('<b>Mustang</b>')
    player.find('.equipment-scope').attr('title', SCOPE).html('<b>Scope</b>')
    player.find('.player-counter-card').text(5 + ' in hand')

    // Status
    player.find('.player-counters').append($('#template-bullet').html())
    player.find('.player-counters').append($('#template-bullet').html())
}

const lostBullet = (playerID) => {
    let player = $('.player-container').eq(playerID)
    let bullets = player.find('img')
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets.eq(i).attr('src') == 'assets/game/bullet.png') {
            bullets.eq(i).attr('src', 'assets/game/bullet1.png')
            break
        }
    }
}

const regainBullet = (playerID) => {
    let player = $('.player-container').eq(playerID)
    let bullets = player.find('img')
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets.eq(i).attr('src') == 'assets/game/bullet1.png') {
            bullets.eq(i).attr('src', 'assets/game/bullet.png')
            break
        }
    }
}