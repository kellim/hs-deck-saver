const deckSaver = {

  deckForm: document.querySelector('.js-deck-form'),
  deckInput: document.querySelector('.js-deck-input'),
  deckListEl: document.querySelector('.js-deck-list ul'),
  deckList: localStorage.getItem('deckList') ? JSON.parse(localStorage.getItem('deckList')) : [],

  init: function() {
    this.listDecks();
    this.addEventListeners();
  },

  addDeck: function(deckToAdd) {
    const deckName = deckToAdd.split('\n')[0].slice(4);
    const isNameUsed = this.deckList.some(deck => deck.name === deckName);
    if (!isNameUsed) {
      const newDeckObj = {name: deckName, body: deckToAdd};
      this.deckList.push(newDeckObj);
      this.createListItem(newDeckObj);
      localStorage.setItem('deckList', JSON.stringify(this.deckList));
    } else {
      console.log('The deck is already in local storage');
    }
  },

  listDecks: function() {
    this.deckList.forEach(deck => {
      this.createListItem(deck);
    });
  },

  createListItem: function(deck) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    const linkText = document.createTextNode(deck.name);
    console.log(link);
    link.appendChild(linkText);
    link.setAttribute('href', '#');
    link.classList.add('deck-link', 'js-deck-link');
    li.appendChild(link);     
    this.deckListEl.appendChild(li);
  },

  addEventListeners: function() {
    this.deckListEl.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.tagName === 'A') {
        console.log('Deck link was clicked');
      }
    });

    this.deckForm.addEventListener('submit', event => {
      event.preventDefault();
      this.processDeckForm();
    });
  },

  processDeckForm: function() {
    // Decks copied from the game start with ### followed by a space, then the deck name.
    if (this.deckInput.value.startsWith('### ')) {
      this.addDeck(this.deckInput.value);
      this.deckInput.value = '';
    } else {
      console.log('not a valid deck');
    }
  }
}

deckSaver.init();