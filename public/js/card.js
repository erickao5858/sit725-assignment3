// TODO For Zilin Add UI for discard cards

// Json data

let cards

console.log(cards)

const getCards = () => {
    // get cards from database
    cards = [{
            "index": 0,
            "suit": "diamonds",
            "number": 6,
            "isActive": true,
            "text": "Gatling"
        },
        {
            "index": 1,
            "suit": "spades",
            "number": 7,
            "isActive": false,
            "text": "Missed!"
        },
        {
            "index": 2,
            "suit": "clubs",
            "number": 1,
            "isActive": true,
            "text": "Indians"
        },
        {
            "index": 3,
            "suit": "diamonds",
            "number": 10,
            "isActive": true,
            "text": "Missed!"
        },
        {
            "index": 4,
            "suit": "spades",
            "number": 8,
            "isActive": false,
            "text": "General Store"
        },
        {
            "index": 5,
            "suit": "hearts",
            "number": 10,
            "isActive": false,
            "text": "General Store"
        },
        {
            "index": 6,
            "suit": "clubs",
            "number": 5,
            "isActive": true,
            "text": "Gatling"
        },
        {
            "index": 7,
            "suit": "spades",
            "number": 5,
            "isActive": true,
            "text": "Gatling"
        },
        {
            "index": 8,
            "suit": "diamonds",
            "number": 5,
            "isActive": false,
            "text": "Gatling"
        },
        {
            "index": 9,
            "suit": "clubs",
            "number": 5,
            "isActive": true,
            "text": "General Store"
        },
        {
            "index": 10,
            "suit": "diamonds",
            "number": 4,
            "isActive": true,
            "text": "Missed!"
        },
        {
            "index": 11,
            "suit": "diamonds",
            "number": 2,
            "isActive": true,
            "text": "Indians"
        },
        {
            "index": 12,
            "suit": "spades",
            "number": 8,
            "isActive": false,
            "text": "Indians"
        },
        {
            "index": 13,
            "suit": "diamonds",
            "number": 2,
            "isActive": true,
            "text": "Gatling"
        },
        {
            "index": 14,
            "suit": "diamonds",
            "number": 2,
            "isActive": false,
            "text": "Missed!"
        },
        {
            "index": 15,
            "suit": "diamonds",
            "number": 4,
            "isActive": false,
            "text": "Missed!"
        },
        {
            "index": 16,
            "suit": "spades",
            "number": 3,
            "isActive": true,
            "text": "Indians"
        }
    ]
    displayCards()
}

const displayCards = () => {
    // display cards
}

const discardCard = (index) => {
    cards[index].isActive = false
}

const shuffle = () => {

}