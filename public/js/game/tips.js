const TIPS_MYTURN = 0,
    TIPS_CHOOSETARGET = 1,
    TIPS_WAITING = 2,
    TIPS_DEAD = 3,
    TIPS_DISCARD = 4,
    TIPS_WIN = 5,
    TIPS_LOSE = 6,
    TIPS_BANG = 7

const updateTips = (mode) => {
    let tips = $('#tips').children().eq(0)
    switch (mode) {
        case TIPS_MYTURN:
            tips.html('Your turn')
            break
        case TIPS_CHOOSETARGET:
            tips.html('Choose a target')
            break
        case TIPS_WAITING:
            tips.html('Waiting for other players to perform an action')
            break
        case TIPS_DEAD:
            tips.html('Game Over')
            break
        case TIPS_DISCARD:
            tips.html('Cards over bullets, please discard cards')
            break
        case TIPS_WIN:
            tips.html('Congratulation, you win!')
            break
        case TIPS_LOSE:
            tips.html('You lose!')
            break
        case TIPS_BANG:
            tips.html('Someone played a Bang! targeting you. Discard a Missed! to repel it or you will lose a bullet.')
            break
    }
}