// Gets Data from URL
function checkOdds() {
    const params = new URLSearchParams(window.location.search);
    
    console.log("Full URL:", window.location.search);
    console.log("All params:", Object.fromEntries(params));

    //Cards from each player
    let player1Card1 = params.get("p1-c1");
    let player1Card2 = params.get("p1-c2");
    let boardCard1 = params.get("board-c1");
    let boardCard2 = params.get("board-c2");
    let boardCard3 = params.get("board-c3");
    let boardCard4 = params.get("board-c4");
    let boardCard5 = params.get("board-c5");
    let player2Card1 = params.get("p2-c1");
    let player2Card2 = params.get("p2-c2");

    let player1Cards = [player1Card1, player1Card2];
    let player2Cards = [player2Card1, player2Card2];
    let communityCards = [boardCard1, boardCard2, boardCard3, boardCard4, boardCard5];

    console.log("Initial cards:", player1Cards, player2Cards, communityCards);

    //Convert suits to letters
    const suits = {
        '♥': 'h',
        '♦': 'd',
        '♣': 'c',
        '♠': 's'
    };
    
    function convertCard(card) {
        if (!card) return null;
        const rank = card.slice(0, -1);  // Get everything except the last character
        const suit = card.slice(-1);     // Get the last character (suit)
        return rank + (suits[suit] || suit);
    }

    // Convert all arrays using map
    player1Cards = player1Cards.map(convertCard).filter(card => card !== null);
    player2Cards = player2Cards.map(convertCard).filter(card => card !== null);
    communityCards = communityCards.map(convertCard).filter(card => card !== null);

    console.log("After conversion:", player1Cards, player2Cards, communityCards);

    // Immediately calculate odds after getting the cards
    const odds = calculatePokerOdds(player1Cards, player2Cards, communityCards);
    console.log("Calculated Odds:", odds);

    return {
        player1Cards,
        player2Cards,
        communityCards,
        odds
    };
}

//Calculator
function calculatePokerOdds(player1Cards, player2Cards, communityCards) {
    console.log("Starting calculation with:", {
        p1: player1Cards,
        p2: player2Cards,
        community: communityCards
    });

    // Create deck
    const createDeck = () => {
        const suits = ['h', 'd', 'c', 's'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
        const deck = [];
        for (const suit of suits) {
            for (const value of values) {
                deck.push(value + suit);
            }
        }
        return deck;
    };

    
    // Check for straight
    const checkStraight = (values) => {
        values.sort((a, b) => a - b);
        if (values.includes(14)) {
            const aceLowValues = [...values.filter(v => v !== 14), 1];
            aceLowValues.sort((a, b) => a - b);
            let isAceLowStraight = true;
            for (let i = 0; i < aceLowValues.length - 1; i++) {
                if (aceLowValues[i + 1] - aceLowValues[i] !== 1) {
                    isAceLowStraight = false;
                    break;
                }
            }
            if (isAceLowStraight) return true;
        }
        let currentStreak = 1;
        let maxStreak = 1;
        for (let i = 1; i < values.length; i++) {
            if (values[i] - values[i-1] === 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else if (values[i] - values[i-1] === 0) {
                continue;
            } else {
                currentStreak = 1;
            }
        }
        return maxStreak >= 5;
    };

    // Evaluate hand strength
    const evaluateHand = (cards) => {
        const cardValues = cards.map(card => {
            const value = card[0];
            return value === 'T' ? 10 :
                   value === 'J' ? 11 :
                   value === 'Q' ? 12 :
                   value === 'K' ? 13 :
                   value === 'A' ? 14 :
                   parseInt(value);
        });

        const suits = cards.map(card => card[1]);
        const isFlush = suits.filter(suit => suit === suits[0]).length >= 5;
        const isStraight = checkStraight(cardValues);

        const valueCounts = {};
        cardValues.forEach(value => {
            valueCounts[value] = (valueCounts[value] || 0) + 1;
        });

        const counts = Object.values(valueCounts).sort((a, b) => b - a);
        
        if (isFlush && isStraight) return 8;
        if (counts[0] === 4) return 7;
        if (counts[0] === 3 && counts[1] === 2) return 6;
        if (isFlush) return 5;
        if (isStraight) return 4;
        if (counts[0] === 3) return 3;
        if (counts[0] === 2 && counts[1] === 2) return 2;
        if (counts[0] === 2) return 1;
        return 0;
    };

    // Get remaining deck
    const deck = createDeck().filter(card => 
        !player1Cards.includes(card) && 
        !player2Cards.includes(card) && 
        !communityCards.includes(card)
    );

    let player1Wins = 0;
    let player2Wins = 0;
    let ties = 0;
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
        const shuffledDeck = [...deck].sort(() => Math.random() - 0.5);
        const simulatedCommunityCards = [
            ...communityCards,
            ...shuffledDeck.slice(0, 5 - communityCards.length)
        ];

        const player1Hand = evaluateHand([...player1Cards, ...simulatedCommunityCards]);
        const player2Hand = evaluateHand([...player2Cards, ...simulatedCommunityCards]);

        if (player1Hand > player2Hand) player1Wins++;
        else if (player2Hand > player1Hand) player2Wins++;
        else ties++;
    }

    const results = {
        player1: (player1Wins / iterations * 100).toFixed(2) + "%",
        player2: (player2Wins / iterations * 100).toFixed(2) + "%",
        tie: (ties / iterations * 100).toFixed(2) + "%"
    };

    return results;
}

// Start the process
const result = checkOdds();
console.log("Final Results:", result);

