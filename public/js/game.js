/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 */

const PLAYER_ABILITY = '1 increased defence distance',
    PLAYER_CARDS = 5,
    GUN_ABILITY = 'Default weapon: range 1',
    BARREL = 'Defence equipment',
    MUSTANG = '1 increased defence distance',
    SCOPE = '1 decreased attack distance'

const PLAYER_COUNT = 7

// TODO: ADD BUDGE
const SHERIFF_POSITION = 5

$(() => {　　
    // Disable drag function on image
    $('img').attr('draggable', false);
    appendPlayer()
})

const appendPlayer = () => {
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

        // Name
        player.find('.player-name').attr('title', PLAYER_ABILITY).html('<b>Paul Regret(Luise)</b>')

        // Status
        player.find('.player-counters').append($('#template-bullet').html())
        player.find('.player-counters').append($('#template-bullet').html())
        player.find('.player-counter-card').text(i + ' in hand')

        // Equipments
        player.find('.equipment-gun').attr('title', GUN_ABILITY).html('<b>Colt .45</b>')
        player.find('.equipment-barrel').attr('title', BARREL).html('<b>Barrel</b>')
        player.find('.equipment-mustang').attr('title', MUSTANG).html('<b>Mustang</b>')
        player.find('.equipment-scope').attr('title', SCOPE).html('<b>Scope</b>')
    }
}