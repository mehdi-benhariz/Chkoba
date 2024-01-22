class Card {
    constructor(type, val) {
        this.type = type;
        this.val = val;
        this.img = `public/img/cards/${val}_of_${type}.svg.png`;
        this.isSelected = false;

    }
}

var deck = [];
var types = ['hearts', 'spades', 'clubs', 'diamonds'];
var values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

let playerHand = []
let playerWonCards = []

let computerHand = []
let computerWonCards = []

let playerScore = 0
let computerScore = 0

let playerChkoba = 0
let computerChkoba = 0


let table = []


let isPlayerTurn = true;
let isPlayerLast = false;

const throwBtn = document.getElementById('throwBtn');
const eatBtn = document.getElementById('eatBtn');

//helper:
function extractRelativePath(url) {
    const parts = url.split('/public/');
    return parts.length > 1 ? 'public/' + parts[1] : url;
}


function throwCard(card) {
    if (isPlayerTurn) {
        const index = playerHand.findIndex(c => c === card);
        if (index !== -1) {
            table.push(playerHand[index]);
            playerHand.splice(index, 1);
            isPlayerTurn = false;
            console.log({ table, playerHand, computerHand })
        }
        isPlayerTurn = false;
    }
}
//eat the rest of cards on deck
function eatRestCards() {
    if (isPlayerLast)
        playerWonCards.push(...table);
    else
        computerWonCards.push(...table);
    table = [];

}

function eatCard(handCard, tableCards) {

    if (isPlayerTurn) {
        //check if sum of table cards is equal to hand card
        let sum = 0;
        //sum table cards with class card-selected and inside div with id table-cards

        for (const card of tableCards)
            sum += parseInt(card.val);

        if (sum !== parseInt(handCard.val)) {
            console.log("sum isn't equal !")
            return;
        }

        //add cards to player won cards
        playerWonCards.push(handCard, ...tableCards);
        //remove cards from table
        for (const card of tableCards) {
            const index = table.findIndex(c => c === card);
            if (index !== -1)
                table.splice(index, 1);
        }
        //remove card from hand
        const index = playerHand.findIndex(c => c === handCard);
        if (index !== -1)
            playerHand.splice(index, 1);
        //change turn
        // isPlayerTurn = false;
    }
}

//select cards:
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', function () {
            this.classList.toggle('card-selected');
            //find the image of the card
            cardImgSrc = extractRelativePath(card.src);
            console.log(card.src);
            //find the card from player hand
            const playerCard = playerHand.find(c => c.img === cardImgSrc);
            if (playerCard)
                playerCard.isSelected = !playerCard.isSelected;

            const tableCards = table.filter(c => c.img === cardImgSrc);
            if (tableCards.length > 0)
                tableCards.forEach(c => c.isSelected = !c.isSelected);
        })
    });
});
//eat cards:
eatBtn.addEventListener('click', e => {
    e.preventDefault();
    console.log({ playerHand, table });

    const selectedHandCard = playerHand.find(c => c.isSelected);
    const selectedTableCards = table.filter(c => c.isSelected);

    eatCard(selectedHandCard, selectedTableCards);
    updateUI();
    //count chkoba
    if (table.length == 0)
        playerChkoba++;


});

//throw card: 
throwBtn.addEventListener('click', e => {

    e.preventDefault();
    const selectedHandCard = playerHand.find(c => c.isSelected);

    if (selectedHandCard) {
        throwCard(selectedHandCard);
        updateUI();
    }
});



function initDeck() {
    for (const type of types)
        for (const element of values)
            deck.push(new Card(type, element));

    return deck;
}

//get random card from deck
function getRandomAndRemove(array) {
    if (array.length > 0) {
        // Generate a random index within the array length
        const ind = Math.floor(Math.random() * array.length);
        // Get the random element from the array
        const randomCard = array[ind];
        // Remove the random element from the array
        array.splice(ind, 1);
        // Return the random element
        return randomCard;
    } else
        // If the array is empty, return null or handle the case accordingly
        return null;

}

function cut() {
    //get 4 cards in table
    if (deck.length === 40)
        for (let i = 0; i < 4; i++) {
            const card = getRandomAndRemove(deck);
            table.push(card);
        }
    //get 4 cards for player
    for (let i = 0; i < 4; i++) {
        const card = getRandomAndRemove(deck);
        playerHand.push(card);
    }
    //get 4 cards for computer
    for (let i = 0; i < 4; i++) {
        const card = getRandomAndRemove(deck);
        computerHand.push(card);
    }
}
// update playerHandUI
function upadtePlayerHandUI() {
    const playerHandDiv = document.getElementById("player-hand");
    // Clear the player hand div
    playerHandDiv.innerHTML = "";
    for (const card of playerHand) {

        // Create a new card div
        const cardDiv = document.createElement("div");
        const cardImage = document.createElement("img");
        cardImage.src = card.img;
        cardImage.alt = "Card";
        cardImage.className = "card";

        cardDiv.appendChild(cardImage);
        playerHandDiv.appendChild(cardDiv);

    }
}

//update table  UI
function updateTableUI() {
    const tableDiv = document.getElementById("table-cards");
    // Clear the table div
    tableDiv.innerHTML = "";
    for (const card of table) {

        // Create a new card div
        const cardDiv = document.createElement("div");
        const cardImage = document.createElement("img");
        cardImage.src = card.img;
        cardImage.alt = "Card";
        cardImage.className = "card";

        cardDiv.appendChild(cardImage);
        tableDiv.appendChild(cardDiv);

    }
}
//update computer hand UI
function updateComputerHandUI() {
    const computerHandDiv = document.getElementById("computer-hand");
    // Clear the computer hand div
    computerHandDiv.innerHTML = "";
    for (const card of computerHand) {

        // Create a new card div
        const cardDiv = document.createElement("div");
        const cardImage = document.createElement("img");
        cardImage.src = card.img;
        cardImage.alt = "Card";

        cardDiv.appendChild(cardImage);
        computerHandDiv.appendChild(cardDiv);

    }
}

//update UI

function updateUI() {
    upadtePlayerHandUI()
    updateTableUI()
    updateComputerHandUI()
}

function startGame() {
    deck = initDeck();
    cut();
    console.log({ table, playerHand, computerHand, deck })
}
startGame();


function calculateScore() {
    playerScore = 0;
    computerScore = 0;

    //carta
    if (playerWonCards.length > 20)
        playerScore++;
    if (playerWonCards.length < 20)
        computerScore++;
    //7aya 
    //search for card 7aya 
    let card7 = playerWonCards.find(c => c.type === 'diamonds' && c.val === '7');
    if (card7)
        playerScore++;
    else
        computerScore++;



    //dinary
    let dinari = playerWonCards.filter(c => c.type === 'diamonds');
    if (dinari.length > 5)
        playerScore++;
    else
        computerScore++;
    //birmila
    let sevens = playerWonCards.filter(c => c.val === 7);
    if (sevens.length > 2)
        playerScore++;
    else
        if (sevens.length < 2)
            computerScore++;
        else {
            let sixes = playerWonCards.filter(c => c.val === 6);
            if (sixes.length > 2)
                playerScore++;
            if (sixes.length < 2)
                computerScore++;
        }

    //add chkoba
    playerScore += playerChkoba;
    computerScore += computerChkoba;

    console.log({ playerScore, computerScore })
}

updateUI();
// while (table.length !== 0) {

// }

//computer plays
function computerPlay() {


    //get all possible cards to throw
    let possibleCards = computerHand.filter(c => table.find(t => t.val === c.val));
    //if no possible cards to throw
    if (possibleCards.length === 0) {
        //get random card from computer hand
        const card = getRandomAndRemove(computerHand);
        //throw card
        throwCard(card);
        //check if computer won
        if (computerHand.length === 0)
            isPlayerLast = true;
        //change turn
        isPlayerTurn = true;
        return;
    }
    //get random card from possible cards
    const card = getRandomAndRemove(possibleCards);
    //throw card
    throwCard(card);
    //check if computer won
    if (computerHand.length === 0)
        isPlayerLast = true;
    //change turn
    isPlayerTurn = true;
    return;
}