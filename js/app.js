const deckForm = document.querySelector('.js-deck-form');
const deckInput = deckForm.querySelector('.js-deck-input');

deckForm.addEventListener('submit', event => {
  event.preventDefault();
  processDeckForm();
});

const deckList = {
  deckList: localStorage.getItem('deckList') ? JSON.parse(localStorage.getItem('deckList')) : [],

  addDeck: function(deckInput) {
    const deckName = deckInput.split('\n')[0].slice(4);
    const isNameUsed = this.deckList.some(deck => deck.name === deckName);
    if (!isNameUsed) {
      console.log('pushing deck', deckName);
      this.deckList.push({name: deckName, body: deckInput});
      localStorage.setItem('deckList', JSON.stringify(this.deckList));
    } else {
      console.log('The deck is already in local storage');
    }
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