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

  deleteDeck: function(deckToDelete) {
    const deckBody = deckToDelete.querySelector('.deck-body');
    const deckName = deckBody.textContent.split('\n')[0].slice(4);
    this.deckList = this.deckList.filter(deck => {
      return deck.name !== deckName;
    });
    localStorage.setItem('deckList', JSON.stringify(this.deckList));
    deckToDelete.parentNode.removeChild(deckToDelete);
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

    const expandCollapseIcon = document.createElement('i');
    expandCollapseIcon.classList.add('expand-collapse-icon', 'js-expand-collapse-icon', 'fa', 'fa-caret-down');
    link.appendChild(expandCollapseIcon);

    const div = document.createElement('div');
    // Spaces replaced with '-' as you cannot have spaces in ids
    const deckBodyId = deck.name.replace(/\s+/g, '-').toLowerCase() + '-body';
    div.id = deckBodyId;
    div.classList.add('deck-body', 'js-deck-body');
    const bodyText = document.createTextNode(deck.body);
    // Associate id of element being collapsed with element that collapses them
    // using aria-controls. Works on modern screen readers.
    link.setAttribute('aria-controls', deckBodyId);    
    div.appendChild(bodyText);

    const deleteBtn = document.createElement('button');
    const deleteIcon = document.createElement('i');
    const deleteBtnText = document.createTextNode('Delete Deck');

    deleteBtn.classList.add('delete-button', 'js-delete-button');
    deleteIcon.classList.add('fa', 'fa-trash', 'delete-icon');
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.appendChild(deleteBtnText);
    // Put button on its own line
    const newLine = document.createTextNode('\n');
    div.appendChild(newLine);
    div.appendChild(deleteBtn);  
       
    li.appendChild(link);
    li.appendChild(div);
    this.deckListEl.appendChild(li);
  },

  addEventListeners: function() {
    this.deckListEl.addEventListener('click', e => {
      e.preventDefault();
      console.log(e.target.tagName);
      if (e.target.tagName === 'BUTTON' || e.target.parentNode.tagName === 'BUTTON') {
        const deck = e.target.tagName === 'BUTTON' ? e.target.parentNode : e.target.parentNode.parentNode;
        // Pass the li to deleteDeck()
        this.deleteDeck(deck.parentNode);
      } else if (e.target.tagName === 'A' || e.target.parentNode.tagName == 'A') {
        // If the a tag isn't clicked on, the parent node of i should be the a tag
        const linkEl = e.target.tagName === 'A' ? e.target : e.target.parentNode;
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