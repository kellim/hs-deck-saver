const deckForm = document.querySelector('.js-deck-form');
const deckInput = deckForm.querySelector('.js-deck-input');

deckForm.addEventListener('submit', event => {
  event.preventDefault();
  processDeckForm();
});

const deckList = {
  deckList: [],

  addDeck: function(deckInput) {
    const deckName = deckInput.split('\n')[0].slice(4);
    this.deckList.push({name: deckName, body: deckInput});
  }
}

function processDeckForm() {
  // Decks copied from the game start with ### followed by a space, then the deck name.
  if (deckInput.value.startsWith('### ')) {
    deckList.addDeck(deckInput.value);    
  } else {
    console.log('not a valid deck');
  }
}

