/**
 * Remove an equipment from a player
 * @param {string} playerID 
 * @param {string} equipmentClass equipment position: 0 - Weapon, 1 - Barrel, 2 - Mustang, 3 - Scope
 */

//TODO: rewrite
const removeEquipment = (playerID, equipmentClass) => {
    let margin = ['66%', '55%', '42%']
    let player = $('.player-container').eq(playerID)
    player.find('.' + equipmentClass).remove()
    let equipmentContainer = player.find('.player-equipments')
    equipmentContainer.css('margin-top', margin[equipmentContainer.children().length - 1])
}

const addEquipment = (playerID, card) => {
    let margin = ['55%', '42%', '29%']
    let player = $('#' + playerID)
    let equipmentContainer = player.find('.player-equipments')
    if (equipmentContainer.find('.' + card.text.toLowerCase()).length) return
    equipmentContainer.css('margin-top', margin[equipmentContainer.children().length - 1])
    equipmentContainer.append('<div class="row ' + card.text.toLowerCase() + '"></div>')
    let equipment = equipmentContainer.children().last()
    equipment.attr('title', card.description).html('<b>' + card.text + '</b>')
}