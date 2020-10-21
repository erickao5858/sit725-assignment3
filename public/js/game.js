/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 */

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

/**
 * Remove an equipment from a player
 * @param {string} playerID 
 * @param {string} equipmentClass equipment position: 0 - Weapon, 1 - Barrel, 2 - Mustang, 3 - Scope
 */
const removeEquipment = (playerID, equipmentClass) => {
    let margin = ['49%', '37%', '25%']
    let player = $('.player-grid').children().eq(playerID)
    player.find(equipmentClass).remove()
    let equipmentContainer = player.find('.player-equipments')
    equipmentContainer.css('margin-top', margin[equipmentContainer.children().length - 1])
}

const addEquipment = (playerID, equipmentClass) => {
    let margin = ['37%', '25%', '13%']
    let player = $('.player-grid').children().eq(playerID)
    let equipmentContainer = player.find('.player-equipments')
    equipmentContainer.css('margin-top', margin[equipmentContainer.children().length - 1])
    equipmentContainer.append('<div class="row ' + equipmentClass + '"></div>')
    let equipment = equipmentContainer.children().last()
    let title, name
    switch (equipmentClass) {
        case '.equipment-barrel':
            title = BARREL, name = NAME_BARREL
            break
        case '.equipment-mustang':
            title = MUSTANG, name = NAME_MUSTANG
            break
        case '.equipment-scope':
            title = SCOPE, name = NAME_SCOPE
            break
    }
    equipment.attr('title', title).html('<b>' + name + '</b>')
}

const equipGun = (playerID, gunID) => {

}