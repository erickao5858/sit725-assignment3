/**
 * Remove an equipment from a player
 * @param {string} playerID 
 * @param {string} equipmentClass equipment position: 0 - Weapon, 1 - Barrel, 2 - Mustang, 3 - Scope
 */

//TODO: rewrite
const removeEquipment = (playerID, equipmentClass) => {
    let margin = ['66%', '54%', '42%']
    let player = $('.player-container').eq(playerID)
    player.find('.' + equipmentClass).remove()
    let equipmentContainer = player.find('.player-equipments')
    equipmentContainer.css('margin-top', margin[equipmentContainer.children().length - 1])
}

//card.text == 'Remington' || card.text == 'Rev. Carabine' || card.text == 'Winchester' || card.text == 'Volcanic' || card.text == 'Schofield'

const addEquipment = (playerID, card) => {
    let margin = ['54%', '42%', '29%']
    let player = $('#' + playerID)

    // Gun
    if (card.text == 'Remington' || card.text == 'Rev. Carabine' || card.text == 'Winchester' || card.text == 'Volcanic' || card.text == 'Schofield') {
        let range
        switch (card.text) {
            case 'Remington':
                range = 3
                break
            case 'Schofield':
                range = 2
                break
            case 'Rev. Carabine':
                range = 4
                break
            case 'Winchester':
                range = 5
                break
            case 'Volcanic':
                range = 1 + '*'
                break
        }
        let gunContainer = player.find('.equipment-gun')
        gunContainer.attr('title', card.description).html('<b>' + card.text + '</b><b> (' + range + ')</b>')
        return
    }

    // Other equipments
    let equipmentContainer = player.find('.player-equipments')
    if (equipmentContainer.find('.' + card.text.toLowerCase()).length) return
    equipmentContainer.css('margin-top', margin[equipmentContainer.children().length - 1])
    equipmentContainer.append('<div class="row ' + card.text.toLowerCase() + '"></div>')
    let equipment = equipmentContainer.children().last()
    equipment.attr('title', card.description).html('<b>' + card.text + '</b>')
}