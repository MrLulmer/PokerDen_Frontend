// Card data
const CARDS = {
  all: [
    "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "10♠", "J♠", "Q♠", "K♠", "A♠",
    "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "8♥", "9♥", "10♥", "J♥", "Q♥", "K♥", "A♥",
    "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "8♣", "9♣", "10♣", "J♣", "Q♣", "K♣", "A♣",
    "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "8♦", "9♦", "10♦", "J♦", "Q♦", "K♦", "A♦"
  ],
  isRed: card => card.includes('♥') || card.includes('♦')
};

// Store for maintaining state
const state = {
  selections: new Map(),
  
  // Get all currently selected cards
  getSelectedCards() {
    return Array.from(this.selections.values()).filter(Boolean);
  },
  
  // Update a selection and sync with URL
  updateSelection(dropdownId, value) {
    const params = new URLSearchParams(window.location.search);
    
    if (!value || value === "") {
      this.selections.delete(dropdownId);
      params.delete(dropdownId);
    } else {
      this.selections.set(dropdownId, value);
      params.set(dropdownId, value);
    }
    
    // Update URL, removing query string if no parameters
    let newUrl = window.location.pathname;
    const queryString = params.toString();
    if (queryString) {
      newUrl += '?' + queryString;
    }
    window.history.pushState({}, '', newUrl);
  },
  
  // Load state from URL
  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    this.selections.clear();
    
    for (const [key, value] of params.entries()) {
      if (key.match(/^(p\d+c\d+|b\d+)$/) && CARDS.all.includes(value)) {
        this.selections.set(key, value);
      }
    }
  }
};

function initializeCardSelectors() {
  // Add styles for coloring options in dropdown
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .card-dropdown option[data-red="true"]:not(:disabled) {
        color: red;
      }
      .card-dropdown option:disabled {
        color: gray;
      }
    </style>
  `);

  // Create base options HTML
  const optionsHTML = `
    <option value="">Select Card</option>
    ${CARDS.all.map(card => {
      const isRed = CARDS.isRed(card);
      return `<option value="${card}" data-red="${isRed}">${card}</option>`;
    }).join('')}
  `;

  // Load saved state from URL
  state.loadFromURL();

  // Set up each dropdown
  const dropdowns = document.querySelectorAll('.card-dropdown');
  dropdowns.forEach(dropdown => {
    // Set initial HTML
    dropdown.innerHTML = optionsHTML;
    
    // Get the normalized parameter key for this dropdown
    const paramKey = dropdown.id.replace('player', 'p')
                            .replace('card', 'c')
                            .replace('board-card', 'b');
    
    // Set initial value from state
    const savedValue = state.selections.get(paramKey);
    if (savedValue) {
      dropdown.value = savedValue;
      dropdown.style.color = CARDS.isRed(savedValue) ? 'red' : 'black';
    }

    // Add change handler
    dropdown.addEventListener('change', () => {
      const newValue = dropdown.value;
      
      // Update dropdown color
      dropdown.style.color = newValue ? 
        (CARDS.isRed(newValue) ? 'red' : 'black') : 
        'black';
      
      // Update state and URL
      state.updateSelection(paramKey, newValue);
      
      // Update all dropdowns
      updateDropdownOptions();
    });
  });

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    state.loadFromURL();
    updateDropdownOptions();
  });

  // Initial update of dropdowns
  updateDropdownOptions();
}

function updateDropdownOptions() {
  const selectedCards = new Set(state.getSelectedCards());
  const dropdowns = document.querySelectorAll('.card-dropdown');

  dropdowns.forEach(dropdown => {
    const paramKey = dropdown.id.replace('player', 'p')
                            .replace('card', 'c')
                            .replace('board-card', 'b');
    const currentValue = state.selections.get(paramKey);

    [...dropdown.options].forEach(option => {
      if (option.value && selectedCards.has(option.value) && option.value !== currentValue) {
        option.disabled = true;
        option.style.color = 'gray';
      } else {
        option.disabled = false;
        option.style.color = option.dataset.red === 'true' ? 'red' : 'black';
      }
    });

    // Ensure correct color for selected value
    dropdown.style.color = currentValue ? 
      (CARDS.isRed(currentValue) ? 'red' : 'black') : 
      'black';
  });
}

document.addEventListener('DOMContentLoaded', initializeCardSelectors);