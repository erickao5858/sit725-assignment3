/**
 * Remove an equipment from a player
 * @param {string} playerID 
 * @param {string} equipmentClass equipment position: 0 - Weapon, 1 - Barrel, 2 - Mustang, 3 - Scope
 */
const removeEquipment = (playerID, equipmentClass) => {
    let margin = ['66%', '55%', '42%']
    let player = $('.player-grid').children().eq(playerID)
    player.find('.' + equipmentClass).remove()
    let equipmentContainer = player.find('.player-equipments')
    equipmentContainer.css('margin-top', margin[equipmentContainer.children().length - 1])
}

const addEquipment = (playerID, equipmentClass) => {
    let margin = ['55%', '42%', '29%']
    let player = $('.player-grid').children().eq(playerID)
    let equipmentContainer = player.find('.player-equipments')
    equipmentContainer.css('margin-top', margin[equipmentContainer.children().length - 1])
    equipmentContainer.append('<div class="row ' + equipmentClass + '"></div>')
    let equipment = equipmentContainer.children().last()
    let title, name
    switch (equipmentClass) {
        case 'equipment-barrel':
            title = BARREL, name = NAME_BARREL
            break
        case 'equipment-mustang':
            title = MUSTANG, name = NAME_MUSTANG
            break
        case 'equipment-scope':
            title = SCOPE, name = NAME_SCOPE
            break
    }
    equipment.attr('title', title).html('<b>' + name + '</b>')
}