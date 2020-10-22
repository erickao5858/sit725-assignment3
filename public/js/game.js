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

const PLAYER_COUNT = 5,
    SHERIFF_POSITION = 2

let cards, drawpileCards

$(() => {　　
    // Disable drag function on image
    $('img').attr('draggable', false);
    getCards()
    appendPlayerUIUpper()
    appendPlayerUIMiddle()
    appendPlayerUILower()
    appendSheriffBadge()

    /**
     * @author Zilin Guo
     */
    $('#sendMessageButton').click(sendMessage);
})

const initDrawpile = () => {
    drawpileCards = cards
    $('#draw-pile').children().eq(0).text(drawpileCards.length + ' cards')
}

const getCards = () => {
    $.get('/readCards', (data) => {
        cards = data
        initDrawpile()
    })
}

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

const equipGun = (playerID) => {

}

/**
 * Socket module
 * @author Zilin Guo
 */
// connect to the socket
let socket = io();

//
socket.on('chat_message', (msg) => {
    $("#messageTextarea").text($("#messageTextarea").val() + "\n" + msg);
    var height = $("#messageTextarea")[0].scrollHeight;
    $("#messageTextarea").scrollTop(height);
})

const sendMessage = () => {
    var message = $("#message").val();
    socket.emit("chat_message", message);
}