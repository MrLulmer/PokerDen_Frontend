    // List of card ranks and suits for dropdown options
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const suits = ["♠", "♥", "♦", "♣"];

    // Function to create a full deck of card options
    function createCardOptions() {
      const options = ['<option value="">Select Card</option>'];
      ranks.forEach(rank => {
        suits.forEach(suit => {
          options.push(`<option value="${rank}${suit}">${rank}${suit}</option>`);
        });
      });
      return options.join('');
    }

    // Populate all card selectors with card options
    function populateSelectors() {
      const selectors = document.querySelectorAll('.card-dropdown');
      const optionsHTML = createCardOptions();
      selectors.forEach(selector => {
        selector.innerHTML = optionsHTML;
      });
    }

    // Initialize the dropdowns with card options
    window.onload = populateSelectors;