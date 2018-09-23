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
    const li  = document.createElement('li');
    const link = document.createElement('a');
    const linkText = document.createTextNode(deck.name);

    li.classList.add('deck-list-item');
    link.appendChild(linkText);
    link.setAttribute('href', '#');
    link.classList.add('deck-link', 'js-deck-link');
    link.setAttribute('aria-expanded', 'false');
    
    const span = document.createElement('span');
    span.classList.add('expand-collapse-icon', 'js-expand-collapse-icon', 'fa', 'fa-caret-down');
    link.appendChild(span);

    const div = document.createElement('div');
    const deckBodyId = deck.name.replace(/\s+/g, '-').toLowerCase() + '-body';
    div.id = deckBodyId;
    div.classList.add('deck-body', 'js-deck-body');
    const bodyText = document.createTextNode(deck.body);
    div.appendChild(bodyText);
    // Associate id of element being collapsed with element that collapses them
    // using aria-controls. Works on modern screen readers.
    link.setAttribute('aria-controls', deckBodyId); 
    
    li.appendChild(link);
    li.appendChild(div);
    this.deckListEl.appendChild(li);
  },

  addEventListeners: function() {
    this.deckListEl.addEventListener('click', e => {
      e.preventDefault();
      console.log(e.target);
      if (e.target.tagName === 'A' || e.target.tagName == 'SPAN') {
        // If span is clicked on, get its parent a tag.
        const linkEl = e.target.tagName === 'A' ? e.target : e.target.parentNode;
        console.log('linkEl', linkEl)
        this.toggleDeckBody(linkEl);
      }
    });

    this.deckForm.addEventListener('submit', event => {
      event.preventDefault();
      this.processDeckForm();
    });
  },

  toggleDeckBody: function(deckEl) {
    const deckBodyEl = deckEl.parentNode.querySelector('.js-deck-body');
    const linkEl = deckEl.parentNode.querySelector('.deck-link');
    const expandCollapseIcon = linkEl.querySelector('.js-expand-collapse-icon');
    
    console.log('ecicon', expandCollapseIcon);
    if (window.getComputedStyle(deckBodyEl).display === 'none') {
      deckBodyEl.style.display = 'block';
      expandCollapseIcon.classList.replace('fa-caret-down', 'fa-caret-up');
      linkEl.setAttribute('aria-expanded', 'true');
    } else {
      deckBodyEl.style.display = 'none';
      expandCollapseIcon.classList.replace('fa-caret-up', 'fa-caret-down');
      linkEl.setAttribute('aria-expanded', 'false');
    }
  },

  processDeckForm: function() {
    // Decks copied from the game start with ### followed by a space, then the deck name.
    // TODO: Make sure deck name is not the same as deck body ID - check for lowercase w/ dashes.
    if (this.deckInput.value.startsWith('### ')) {
      this.addDeck(this.deckInput.value);
      this.deckInput.value = '';
    } else {
      console.log('not a valid deck');
    }
  }
}

deckSaver.init();