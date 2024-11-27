document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    // Fetch card data from cards.json
    fetch('cards.jsonc')
        .then(response => response.text())
        .then(data => {
            const jsonString = data.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');

            data = JSON.parse(jsonString);
            const cardDetails = data.cards;
            const selectedCards = getRandomCards(cardDetails, 8);
            createCards(selectedCards, cardDetails);
        });

    // Get random cards
    function getRandomCards(cardDetails, numPairs) {
        const keys = Object.keys(cardDetails);
        const uniqueKeys = keys.filter(key => key.endsWith('a'));
        shuffle(uniqueKeys);
        const selectedKeys = uniqueKeys.slice(0, numPairs);
        const selectedCards = [];
        selectedKeys.forEach(key => {
            selectedCards.push(key, cardDetails[key].pair);
        });
        return selectedCards;
    }

    // Shuffle the cards
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Create the cards
    function createCards(selectedCards, cardDetails) {
        shuffle(selectedCards);
        selectedCards.forEach(cardId => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = cardDetails[cardId].value;
            card.innerHTML = `<div class="card-text">${cardDetails[cardId].display}</div>`;
            card.addEventListener('click', selectCard);
            gameBoard.appendChild(card);
        });
    }

    // Select the card
    function selectCard() {
        if (lockBoard || this === firstCard) return;

        this.classList.add('selected');

        if (!firstCard) {
            firstCard = this;
        } else {
            secondCard = this;
            checkForMatch();
        }
    }

    // Check for a match
    function checkForMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;
        if (isMatch) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            resetBoard();
        } else {
            lockBoard = true;
            firstCard.classList.add('mismatch');
            secondCard.classList.add('mismatch');
            setTimeout(() => {
                firstCard.classList.remove('selected', 'mismatch');
                secondCard.classList.remove('selected', 'mismatch');
                resetBoard();
            }, 1000);
        }
    }

    // Reset the board
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }
});