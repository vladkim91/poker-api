exports.Mutation = {
    calcWinner: (parent, { input }, context) => {
        const players = []
        const communityCards = []
        /**
         * Splits string into CC and asign each player their cards
         * @param {front end payload with cc and players cards} string 
         */
        const splitTheString = (cardsString) => {
            const cc = cardsString[0].slice(3).split(',')
            communityCards.push(cc)
            for (let i = 1; i < cardsString.length; i++) {
                const playerString = cardsString[i].split('=')
                const obj = {}
                const [id, hand] = playerString
                obj.id = id
                obj.hand = hand.split(',')
                players.push(obj)
            }
        }

        splitTheString(input.players.split('/'))
        /**
         * Custom sorts array to be in card deck order
         * @param {array of combined player and cc} sortedArray 
         * @returns sorted array 
         */
        function customSort(sortedArray) {
            const tempPlaceHolder = [];
            for (let i = 0; i < sortedArray.length; i++) {

                if (isNaN(sortedArray[i][0]) != true) {
                    tempPlaceHolder.push(sortedArray[i][0]);
                }

            }

            let letterCards = ["T", "J", "Q", "K", "A"];

            /**
             * 
             * @param {string that represents current card} card 
             * @param {string that represents custome sorted letters from J to A} t 
             */
            function pushTJQKA(card, t) {
                for (let i = 0; i < sortedArray.length; i++) {
                    if (isNaN(card[i][0]) != false && card[i][0] == t) {
                        tempPlaceHolder.push(card[i][0]);
                    }
                }
            }
            for (let i = 0; i < letterCards.length; i++) {
                pushTJQKA(sortedArray, letterCards[i]);
            }

            let noDuplicateTemp = [...new Set(tempPlaceHolder)];
            if (noDuplicateTemp[noDuplicateTemp.length - 1] == "A") noDuplicateTemp.unshift("A")


            return noDuplicateTemp;
        }


        /**
         * Major function that checks every combination in player's hand + cc
         * @param {array of 2 players cards } hand 
         * @param {array with 3 to 5 communityCards array} cc 
         * @returns made hands object that describes the strongest combination the player will have in the showdown
         */
        function checkHand(hand, cc) {
            let combinedHand = hand.concat(cc.join(",")).join(",");
            let combinedHandArray = combinedHand.split(",");
            const combinedHandArrayClone = [...combinedHandArray];
            const madeHands = {
                hasPair: { made: false, highestCard: null },
                hasTwoPair: { made: false, highestCard: null },
                hasThreeOfaKind: { made: false, highestCard: null },
                hasStraight: { made: false, highestCard: null },
                hasFlush: { made: false, highestCard: null },
                hasFullHouse: { made: false, highestCard: null },
                hasFourOfaKind: { made: false, highestCard: null },
                hasStraightFlush: { made: false, highestCard: null },
                hasRoyalFlush: false,
                handStrength: 0,
                typeOfFlush: ''
            };

            function checkPair(hand) {
                for (let i = 0; i < hand.length; i++) {
                    for (let n = 0; n < hand.length; n++) {
                        if (hand[i][0] == hand[n][0] && i != n && madeHands.hasPair.made == false) {
                            // Create copy to splice
                            // Clone array is spliced to find second pair
                            combinedHandArrayClone.splice(i, 1);
                            combinedHandArrayClone.splice(n - 1, 1);
                            madeHands.hasPair.highestCard = hand[i][0]
                            madeHands.hasPair.made = true;
                            madeHands.handStrength = 1;
                            break;
                        }
                    }
                }
            }
            function checkTwoPair(hand) {
                for (let i = 0; i < hand.length; i++) {
                    for (let n = 0; n < hand.length; n++) {
                        if (madeHands.hasPair.made == true && hand[i][0] == hand[n][0] && i != n) {
                            madeHands.hasTwoPair.made = true;
                            madeHands.handStrength = 2;
                            madeHands.hasTwoPair.highestCard = hand[i][0]

                            break;
                        }
                    }
                }
            }
            function checkThreeOfaKind(hand) {
                for (let i = 0; i < hand.length; i++) {
                    for (let n = 0; n < hand.length; n++) {
                        for (let y = 0; y < hand.length; y++) {
                            if (
                                madeHands.hasPair.made == true &&
                                hand[i][0] == hand[n][0] &&
                                hand[i][0] == hand[y][0] &&
                                i != n &&
                                i != y &&
                                n != y
                            ) {
                                madeHands.hasThreeOfaKind.made = true;
                                madeHands.handStrength = 3;
                                madeHands.hasThreeOfaKind.highestCard = hand[i][0]
                                break;
                            }
                        }
                    }
                }
            }
            /**
             * Creates a fresh 52 card deck
             * @returns Full deck that is used to check straing combinations
             */
            function createDeck() {
                const suits = ["Heart", "Spade", "Diamond", "Club"];
                const cards = [
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "T",
                    "J",
                    "Q",
                    "K",
                    "A",
                ];
                let deck = [];
                for (let i = 0; i < suits.length; i++) {
                    for (let n = 0; n < cards.length; n++) {
                        let suitShort = suits[i].slice(0, 1);
                        deck.push(cards[n] + suitShort);
                    }
                }
                //function returns brand new deck
                return deck;
            }

            function checkStraight(hand) {
                // Check for straight
                // 14 cards without suits with A in the beginning
                let thirteenCardsInOrder = createDeck().slice(0, 13);
                let thirteenCardsWithoutSuit = [];
                thirteenCardsInOrder.forEach(removeSuit);
                function removeSuit(item, index, arr) {
                    thirteenCardsWithoutSuit.push(item[0]);
                }
                thirteenCardsWithoutSuit.unshift("A");
                // temp Array with 5 cards
                // 9 itterations

                const sortedCombinedHandArray = [...hand].sort();
                // Sort player + communityCards

                let slicedArrayOfFive;
                for (let i = 0; i < 10; i++) {
                    const tempArrayOfFive = [];
                    tempArrayOfFive.push(thirteenCardsWithoutSuit.slice(i, i + 5));

                    for (let n = 0; n < 4; n++) {
                        slicedArrayOfFive = customSort(sortedCombinedHandArray).slice(n, n + 5);
                        if (slicedArrayOfFive.toString() == tempArrayOfFive.toString()) {
                            madeHands.hasStraight.made = true;
                            madeHands.handStrength = 4;
                            madeHands.hasStraight.highestCard = slicedArrayOfFive[4][0]
                            break;
                        }
                    }
                }
            }
            function checkFlush(hand) {
                const suitCounter = { hearts: 0, spades: 0, clubs: 0, diamonds: 0 };
                let flushSuit = ''
                for (let i = 0; i < hand.length; i++) {
                    if (hand[i][1] == "H") suitCounter.hearts++;
                    if (hand[i][1] == "S") suitCounter.spades++;
                    if (hand[i][1] == "C") suitCounter.clubs++;
                    if (hand[i][1] == "D") suitCounter.diamonds++;
                }

                if (
                    suitCounter.hearts >= 5 ||
                    suitCounter.spades >= 5 ||
                    suitCounter.clubs >= 5 ||
                    suitCounter.diamonds >= 5
                ) {
                    madeHands.hasFlush.made = true;
                    madeHands.handStrength = 5;

                    for (let i = 0; i < Object.values(suitCounter).length; i++) {
                        if (Object.values(suitCounter)[i] > 4) {
                            madeHands.typeOfFlush = Object.keys(suitCounter)[i]
                            flushSuit = madeHands.typeOfFlush[0].toUpperCase()
                            const fiveFlushCards = hand.filter(card => card[1] == flushSuit)
                            console.log((fiveFlushCards))
                        }
                    }



                }


            }
            function checkFullHouse() {
                if (madeHands.hasTwoPair.made == true && madeHands.hasThreeOfaKind.made == true) {
                    madeHands.hasFullHouse.made = true;
                    madeHands.handStrength = 6;
                }
            }
            function checkFourOfaKind(hand) {
                for (let i = 0; i < hand.length; i++) {
                    for (let n = 0; n < hand.length; n++) {
                        if (hand[i][0] == hand[n][0] && i != n) {
                            for (let x = 0; x < hand.length; x++) {
                                if (hand[n][0] == hand[x][0] && n != x && i != x) {
                                    for (let y = 0; y < hand.length; y++) {
                                        if (hand[x][0] == hand[y][0] && x != y && n != y && i != y) {
                                            madeHands.hasFourOfaKind.made = true;
                                            madeHands.hasFullHouse.made = false;
                                            madeHands.handStrength = 7;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function checkStraightRoyalFlush(hand) {
                const tempFlush = [];
                if (madeHands.hasStraight.made && madeHands.hasFlush.made) {
                    switch (madeHands.typeOfFlush) {
                        case "hearts": {
                            for (i = 0; i < hand.length; i++) {
                                if (hand[i][1] == "H") tempFlush.push(hand[i])
                            }
                            break;
                        };
                        case "spades": {
                            for (i = 0; i < hand.length; i++) {
                                if (hand[i][1] == "S") tempFlush.push(hand[i])
                            }
                            break;
                        };
                        case "clubs": {
                            for (i = 0; i < hand.length; i++) {
                                if (hand[i][1] == "C") tempFlush.push(hand[i])
                            }
                            break;
                        };
                        case "diamonds": {
                            for (let i = 0; i < hand.length; i++) {
                                if (hand[i][1] == "D") tempFlush.push(hand[i])
                            }
                            break;
                        };
                    }

                    let thirteenCardsInOrder = createDeck().slice(0, 13);
                    let thirteenCardsWithCustomSuit = [];
                    thirteenCardsInOrder.forEach(removeSuit);
                    function removeSuit(item, index, arr) {
                        thirteenCardsWithCustomSuit.push(item[0] + madeHands.typeOfFlush[0].toUpperCase());
                    }
                    thirteenCardsWithCustomSuit.unshift("A" + madeHands.typeOfFlush[0].toUpperCase())

                    const sortedCombinedHandArray = [...tempFlush].sort();
                    if (tempFlush[tempFlush.length - 1][0] == "A") {
                        sortedCombinedHandArray.unshift("A" + madeHands.typeOfFlush[0].toUpperCase())
                    }

                    let sortedStraighFlush = customSort(sortedCombinedHandArray)
                    for (let i = 0; i < sortedStraighFlush.length; i++) {
                        sortedStraighFlush[i] = sortedStraighFlush[i] + madeHands.typeOfFlush[0].toUpperCase()
                    }

                    let slicedArrayOfFive;
                    for (let i = 0; i < 10; i++) {
                        const tempArrayOfFive = [];
                        tempArrayOfFive.push(thirteenCardsWithCustomSuit.slice(i, i + 5));

                        for (let n = 0; n < 3; n++) {
                            slicedArrayOfFive = sortedStraighFlush.slice(n, n + 5);

                            if (i != 9) {
                                if (slicedArrayOfFive.toString() == tempArrayOfFive.toString()) {
                                    madeHands.hasStraightFlush.made = true;
                                    madeHands.handStrength = 8;

                                }
                            } else {
                                if (slicedArrayOfFive.toString() == tempArrayOfFive.toString()) {
                                    madeHands.hasStraightFlush.made = true;
                                    madeHands.hasRoyalFlush = true;
                                    madeHands.handStrength = 9;
                                }
                            }
                        }

                    }
                }


            }

            checkPair(combinedHandArray);
            checkTwoPair(combinedHandArrayClone);
            checkThreeOfaKind(combinedHandArray);
            checkStraight(combinedHandArray);
            checkFlush(combinedHandArray);
            checkFullHouse();
            checkFourOfaKind(combinedHandArray);
            checkStraightRoyalFlush(combinedHandArray)
            console.log(madeHands)
            return madeHands;
        }
        // add hand strength to player array
        for (let i in players) {
            players[i].handStrength = checkHand(players[i].hand, communityCards).handStrength
        }
        console.log(players)
        /**
         * 
         * @param {arrays of player hand arrays with a tied hand Strength} tiedPlayers 
         * @param {community Cards} cc 
         */
        const checkTie = (tiedPlayers, cc) => {
            // check High Card


            // check Pair
            // check Two Pair
            // check Three of a kind
            // check Straigth
            // check Flush
            // check Four of a kind
            // check Straight Flush
        }

        const checkWinner = (playerArray) => {
            const handStrengthArray = playerArray.map(player => player.handStrength)
            const maxStrength = Math.max(...handStrengthArray)
            // Check if there are more than 1 maxStrength present in the array

            let winnerId = '';
            let highestHandStrength = -1
            // Find the greatest handStrength and replace winner Id with playerId
            for (let player of playerArray) {
                if (player.handStrength > highestHandStrength) {
                    highestHandStrength = player.handStrength
                    winnerId = player.id
                }
            }


            console.log(`Winner id ${winnerId}`)
        }

        checkWinner(players)

    }

}