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

    // Validate cards before calculation
    if (player1Cards.length !== 2 || player2Cards.length !== 2) {
        console.error("Each player must have exactly 2 cards");
        return {
            error: "Each player must have exactly 2 cards"
        };
    }

    // Check for duplicate cards
    const allCards = [...player1Cards, ...player2Cards, ...communityCards];
    const uniqueCards = new Set(allCards);
    if (uniqueCards.size !== allCards.length) {
        console.error("Duplicate cards detected");
        return {
            error: "Duplicate cards detected"
        };
    }

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

    // Card value mapping
    const cardValueMap = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 
        'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };

    // Convert card to value and suit
    const parseCard = (card) => {
        const value = cardValueMap[card[0]];
        const suit = card[1];
        return { value, suit };
    };
    
    // Improved hand evaluation that returns a detailed hand ranking
    const evaluateHand = (cards) => {
        if (cards.length < 5) return { rank: 0, value: [] }; // Invalid hand

        // Parse cards
        const parsedCards = cards.map(parseCard);
        
        // Group by values and suits
        const valueGroups = {};
        const suitGroups = {};
        
        parsedCards.forEach(card => {
            valueGroups[card.value] = (valueGroups[card.value] || 0) + 1;
            suitGroups[card.suit] = (suitGroups[card.suit] || 0) + 1;
        });
        
        // Sort values by frequency (high to low), then by card value (high to low)
        const valueEntries = Object.entries(valueGroups)
            .map(([value, count]) => ({ value: parseInt(value), count }))
            .sort((a, b) => 
                b.count - a.count || 
                b.value - a.value
            );
        
        // Check for straight
        const uniqueValues = [...new Set(parsedCards.map(card => card.value))].sort((a, b) => a - b);
        
        let isStraight = false;
        let straightHighCard = 0;
        
        // Regular straight check
        for (let i = 0; i <= uniqueValues.length - 5; i++) {
            const consecutive = uniqueValues.slice(i, i + 5);
            if (consecutive[4] - consecutive[0] === 4) {
                isStraight = true;
                straightHighCard = consecutive[4];
                break;
            }
        }
        
        // Check for A-5 straight
        if (!isStraight && uniqueValues.includes(14)) {
            const aceLowValues = uniqueValues.filter(v => v === 2 || v === 3 || v === 4 || v === 5 || v === 14);
            if (aceLowValues.length >= 5) {
                isStraight = true;
                straightHighCard = 5; // High card is 5 in A-5 straight
            }
        }
        
        // Check for flush
        const flushSuit = Object.entries(suitGroups)
            .find(([suit, count]) => count >= 5);
        
        const isFlush = !!flushSuit;
        
        // Get all cards of the flush suit
        const flushCards = isFlush 
            ? parsedCards
                .filter(card => card.suit === flushSuit[0])
                .map(card => card.value)
                .sort((a, b) => b - a)
            : [];
        
        // Straight flush check
        let isStraightFlush = false;
        let straightFlushHighCard = 0;
        
        if (isFlush && isStraight) {
            const flushCardValues = [...new Set(flushCards)].sort((a, b) => a - b);
            
            // Regular straight flush check
            for (let i = 0; i <= flushCardValues.length - 5; i++) {
                const consecutive = flushCardValues.slice(i, i + 5);
                if (consecutive[4] - consecutive[0] === 4) {
                    isStraightFlush = true;
                    straightFlushHighCard = consecutive[4];
                    break;
                }
            }
            
            // Check for A-5 straight flush
            if (!isStraightFlush && flushCardValues.includes(14)) {
                const aceLowValues = flushCardValues.filter(v => v === 2 || v === 3 || v === 4 || v === 5 || v === 14);
                if (aceLowValues.length >= 5) {
                    isStraightFlush = true;
                    straightFlushHighCard = 5; // High card is 5 in A-5 straight flush
                }
            }
        }
        
        // Royal flush check
        const isRoyalFlush = isStraightFlush && straightFlushHighCard === 14;
        
        // Get pairs, three of a kinds, four of a kinds
        const quads = valueEntries.filter(entry => entry.count === 4).map(entry => entry.value);
        const trips = valueEntries.filter(entry => entry.count === 3).map(entry => entry.value);
        const pairs = valueEntries.filter(entry => entry.count === 2).map(entry => entry.value);
        
        // Get kickers (single cards, sorted high to low)
        let kickers = valueEntries
            .filter(entry => entry.count === 1)
            .map(entry => entry.value)
            .sort((a, b) => b - a);
        
        // Determine hand rank and values
        if (isRoyalFlush) {
            return { rank: 9, values: [14] }; // Royal Flush
        }
        
        if (isStraightFlush) {
            return { rank: 8, values: [straightFlushHighCard] }; // Straight Flush
        }
        
        if (quads.length > 0) {
            // Four of a Kind with highest kicker
            const remainingValues = [...trips, ...pairs, ...kickers].sort((a, b) => b - a);
            return { 
                rank: 7, 
                values: [quads[0], remainingValues[0]] 
            };
        }
        
        if (trips.length > 0 && pairs.length > 0) {
            // Full House (highest trips + highest pair)
            return { 
                rank: 6, 
                values: [trips[0], pairs[0]] 
            };
        }
        
        if (isFlush) {
            // Flush (top 5 cards of the flush)
            return { 
                rank: 5, 
                values: flushCards.slice(0, 5) 
            };
        }
        
        if (isStraight) {
            // Straight
            return { 
                rank: 4, 
                values: [straightHighCard] 
            };
        }
        
        if (trips.length > 0) {
            // Three of a Kind with top 2 kickers
            const remainingValues = [...pairs, ...kickers].sort((a, b) => b - a);
            return { 
                rank: 3, 
                values: [trips[0], ...remainingValues.slice(0, 2)] 
            };
        }
        
        if (pairs.length >= 2) {
            // Two Pair with highest kicker
            const remainingValues = [...kickers].sort((a, b) => b - a);
            return { 
                rank: 2, 
                values: [pairs[0], pairs[1], remainingValues[0]] 
            };
        }
        
        if (pairs.length === 1) {
            // One Pair with top 3 kickers
            const remainingValues = [...kickers].sort((a, b) => b - a);
            return { 
                rank: 1, 
                values: [pairs[0], ...remainingValues.slice(0, 3)] 
            };
        }
        
        // High Card (top 5 cards)
        return { 
            rank: 0, 
            values: uniqueValues.sort((a, b) => b - a).slice(0, 5) 
        };
    };

    // Compare two hands
    const compareHands = (hand1, hand2) => {
        if (hand1.rank > hand2.rank) return 1;
        if (hand1.rank < hand2.rank) return -1;
        
        // Same rank, compare values
        for (let i = 0; i < hand1.values.length; i++) {
            if (hand1.values[i] > hand2.values[i]) return 1;
            if (hand1.values[i] < hand2.values[i]) return -1;
        }
        
        return 0; // Tie
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
    const iterations = 5000; // Increased for better accuracy

    for (let i = 0; i < iterations; i++) {
        const shuffledDeck = [...deck].sort(() => Math.random() - 0.5);
        const simulatedCommunityCards = [
            ...communityCards,
            ...shuffledDeck.slice(0, 5 - communityCards.length)
        ];

        const player1Hand = evaluateHand([...player1Cards, ...simulatedCommunityCards]);
        const player2Hand = evaluateHand([...player2Cards, ...simulatedCommunityCards]);

        const result = compareHands(player1Hand, player2Hand);
        if (result > 0) player1Wins++;
        else if (result < 0) player2Wins++;
        else ties++;
    }

    const results = {
        player1: (player1Wins / iterations * 100).toFixed(2) + "%",
        player2: (player2Wins / iterations * 100).toFixed(2) + "%",
        tie: (ties / iterations * 100).toFixed(2) + "%"
    };

    try {
        // Display results on the website
        document.getElementById("player1Win").innerText = results.player1;
        document.getElementById("player2Win").innerText = results.player2;
        document.getElementById("player1And2Tie").innerText = results.tie;
    } catch (e) {
        console.error("Error updating DOM:", e);
    }

    return results;
}