// Card configuration
const CARDS = {
  ranks: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  suits: ["♠", "♥", "♣", "♦"],
  redSuits: new Set(["♥", "♦"])
};

// Create card options with proper coloring
function createCardOptions() {
  const defaultOption = '<option value="">Select Card</option>';
  const cardOptions = CARDS.ranks.flatMap(rank => 
      CARDS.suits.map(suit => {
          const isRed = CARDS.redSuits.has(suit);
          return `<option value="${rank}${suit}" data-color="${isRed ? 'red' : 'black'}">${rank}${suit}</option>`;
      })
  );
  return [defaultOption, ...cardOptions].join('');
}

// Update dropdown color based on selection
function updateDropdownColor(dropdown) {
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  const color = selectedOption.getAttribute('data-color') || 'black';
  dropdown.style.color = color;
}

// Handle URL parameters
class URLHandler {
  static getCardParams() {
      const params = new URLSearchParams(window.location.search);
      const cardIds = [
          'player1-card1', 'player1-card2',
          'player2-card1', 'player2-card2',
          ...Array.from({length: 5}, (_, i) => `board-card${i+1}`)
      ];
      
      return cardIds.map(id => ({
          id,
          value: params.get(this.getParamKey(id)) || ''
      }));
  }

  static getParamKey(id) {
      if (id.startsWith('player')) {
          const [player, card] = id.split('-');
          return `p${player.slice(-1)}c${card.slice(-1)}`;
      }
      return `b${id.slice(-1)}`;
  }

  static updateURL() {
      const params = new URLSearchParams();
      document.querySelectorAll('.card-dropdown').forEach(dropdown => {
          if (dropdown.value) {
              params.set(this.getParamKey(dropdown.id), dropdown.value);
          }
      });
      
      window.history.pushState({}, '', 
          `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
      );
  }
}

// Initialize the application
function initializeApp() {
  // Add CSS for dropdown styling
  const style = document.createElement('style');
  style.textContent = `
      .card-dropdown option[data-color="red"] {
          color: red;
      }
      .card-dropdown option[data-color="black"] {
          color: black;
      }
  `;
  document.head.appendChild(style);

  // Populate all dropdowns
  const optionsHTML = createCardOptions();
  document.querySelectorAll('.card-dropdown').forEach(selector => {
      selector.innerHTML = optionsHTML;
      
      // Add event listeners
      selector.addEventListener('change', () => {
          updateDropdownColor(selector);
          URLHandler.updateURL();
      });
  });

  // Load saved values from URL and set colors
  URLHandler.getCardParams().forEach(({id, value}) => {
      const dropdown = document.getElementById(id);
      if (value) {
          dropdown.value = value;
          updateDropdownColor(dropdown);
      }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);