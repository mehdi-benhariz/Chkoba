class Card {
    constructor(type, val) {
        this.type = type;
        this.val = val;
        this.img = `public/img/cards/${val}_of_${type}.svg.png`;
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
const throwBtn = document.getElementById('throwBtn');
const eatBtn = document.getElementById('eatBtn');

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

function eatCard(handCard, tableCards) {
    if (!isPlayerTurn) {
        //check if sum of table cards is equal to hand card
        let sum = 0;
        for (const card of tableCards)
            sum += parseInt(card.val);
        if (sum !== parseInt(handCard.val))
            return;
        //add cards to player won cards
        playerWonCards.push(handCard, ...tableCards);
        //remove cards from table
        for (const card of tableCards) {
            const index = table.findIndex(c => c === card);
            if (index !== -1)
                table.splice(index, 1);
        }
        //remove card from hand
        const index = computerHand.findIndex(c => c === handCard);
        if (index !== -1)
            computerHand.splice(index, 1);
        //change turn
        isPlayerTurn = false;
    }
}



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
    } else {
        // If the array is empty, return null or handle the case accordingly
        return null;
    }
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
        cardImage.className = "player-card";

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
        cardImage.className = "table-card";

        cardDiv.appendChild(cardImage);
        tableDiv.appendChild(cardDiv);

    }
}

//update UI


function updateUI() {
    upadtePlayerHandUI()
    updateTableUI()
}

function startGame() {
    deck = initDeck();
    console.log(deck)
    cut();
    console.log({ table, playerHand, computerHand })
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