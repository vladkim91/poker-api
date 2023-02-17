exports.Mutation = {
  calcWinner: (parent, { input }, context) => {
    const players = [];
    const communityCards = [];
    const cardRanking = {
      2: 0,
      3: 1,
      4: 2,
      5: 3,
      6: 4,
      7: 5,
      8: 6,
      9: 7,
      T: 8,
      J: 9,
      Q: 10,
      K: 11,
      A: 12
    };
    function createDeck() {
      const suits = ['Heart', 'Spade', 'Diamond', 'Club'];
      const cards = [
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'T',
        'J',
        'Q',
        'K',
        'A'
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
    /**
     * Check if there are any duplicates in the deck
     * @param card string with cc and player cards
     * @return boolean
     */
    const checkIfValid = () => {
      const brandNewDeck = createDeck();
      const cardsChecked = [];
      // split string into array of cards
      const allCards = input.players
        .split('/')
        .map((cards) => cards.split('=')[1].split(','))
        .flat();
      // push every checked card into cardsCheckedArray
      allCards.forEach((card) => {
        cardsChecked.push(brandNewDeck[brandNewDeck.indexOf(card)]);
      });
      // remove duplicated if any are present
      const setOfCards = new Set(cardsChecked);
      return allCards.length == setOfCards.size;
    };

    const validCards = checkIfValid();
    if (!validCards) throw new Error('Invalid Cards');

    /**
     * Splits string into CC and asign each player their cards
     * @param {front end payload with cc and players cards} string
     */

    const splitTheString = (cardsString) => {
      const cc = cardsString[0].slice(3).split(',');
      communityCards.push(cc);
      for (let i = 1; i < cardsString.length; i++) {
        const playerString = cardsString[i].split('=');
        const obj = {};
        const [id, hand] = playerString;
        obj.id = id;
        obj.hand = hand.split(',');
        players.push(obj);
      }
    };

    splitTheString(input.players.split('/'));
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

      let letterCards = ['T', 'J', 'Q', 'K', 'A'];

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
      if (noDuplicateTemp[noDuplicateTemp.length - 1] == 'A')
        noDuplicateTemp.unshift('A');

      return noDuplicateTemp;
    }

    /**
     * Major function that checks every combination in player's hand + cc
     * @param {array of 2 players cards } hand
     * @param {array with 3 to 5 communityCards array} cc
     * @returns made hands object that describes the strongest combination the player will have in the showdown
     */
    function checkHand(hand, cc) {
      let combinedHand = hand.concat(cc.join(',')).join(',');
      let combinedHandArray = combinedHand.split(',');
      const combinedHandArrayClone = [...combinedHandArray];
      const madeHands = {
        winningCombination: [],
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
            if (
              hand[i][0] == hand[n][0] &&
              i != n &&
              madeHands.hasPair.made == false
            ) {
              // Create copy to splice
              // Clone array is spliced to find second pair
              combinedHandArrayClone.splice(i, 1);
              combinedHandArrayClone.splice(n - 1, 1);
              madeHands.hasPair.highestCard = hand[i][0];
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
            if (
              madeHands.hasPair.made == true &&
              hand[i][0] == hand[n][0] &&
              i != n
            ) {
              madeHands.hasTwoPair.made = true;
              madeHands.handStrength = 2;
              madeHands.hasTwoPair.highestCard = hand[i][0];

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
                madeHands.hasThreeOfaKind.highestCard = hand[i][0];
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

      function checkStraight(hand) {
        // Check for straight
        // 14 cards without suits with A in the beginning
        let thirteenCardsInOrder = createDeck().slice(0, 13);
        let thirteenCardsWithoutSuit = [];
        thirteenCardsInOrder.forEach(removeSuit);
        function removeSuit(item, index, arr) {
          thirteenCardsWithoutSuit.push(item[0]);
        }
        thirteenCardsWithoutSuit.unshift('A');
        // temp Array with 5 cards
        // 9 itterations

        const sortedCombinedHandArray = [...hand].sort();
        // Sort player + communityCards

        let slicedArrayOfFive;
        for (let i = 0; i < 10; i++) {
          const tempArrayOfFive = [];
          tempArrayOfFive.push(thirteenCardsWithoutSuit.slice(i, i + 5));

          for (let n = 0; n < 4; n++) {
            slicedArrayOfFive = customSort(sortedCombinedHandArray).slice(
              n,
              n + 5
            );
            if (slicedArrayOfFive.toString() == tempArrayOfFive.toString()) {
              madeHands.hasStraight.made = true;
              madeHands.handStrength = 4;
              madeHands.hasStraight.highestCard = slicedArrayOfFive[4][0];
              break;
            }
          }
        }
      }
      function checkFlush(hand) {
        const suitCounter = { hearts: 0, spades: 0, clubs: 0, diamonds: 0 };
        let flushSuit = '';
        for (let i = 0; i < hand.length; i++) {
          if (hand[i][1] == 'H') suitCounter.hearts++;
          if (hand[i][1] == 'S') suitCounter.spades++;
          if (hand[i][1] == 'C') suitCounter.clubs++;
          if (hand[i][1] == 'D') suitCounter.diamonds++;
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
              madeHands.typeOfFlush = Object.keys(suitCounter)[i];
              flushSuit = madeHands.typeOfFlush[0].toUpperCase();
              const fiveFlushCards = hand.filter(
                (card) => card[1] == flushSuit
              );
            }
          }
        }
      }
      function checkFullHouse() {
        if (
          madeHands.hasTwoPair.made == true &&
          madeHands.hasThreeOfaKind.made == true
        ) {
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
                    if (
                      hand[x][0] == hand[y][0] &&
                      x != y &&
                      n != y &&
                      i != y
                    ) {
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
            case 'hearts': {
              for (i = 0; i < hand.length; i++) {
                if (hand[i][1] == 'H') tempFlush.push(hand[i]);
              }
              break;
            }
            case 'spades': {
              for (i = 0; i < hand.length; i++) {
                if (hand[i][1] == 'S') tempFlush.push(hand[i]);
              }
              break;
            }
            case 'clubs': {
              for (i = 0; i < hand.length; i++) {
                if (hand[i][1] == 'C') tempFlush.push(hand[i]);
              }
              break;
            }
            case 'diamonds': {
              for (let i = 0; i < hand.length; i++) {
                if (hand[i][1] == 'D') tempFlush.push(hand[i]);
              }
              break;
            }
          }

          let thirteenCardsInOrder = createDeck().slice(0, 13);
          let thirteenCardsWithCustomSuit = [];
          thirteenCardsInOrder.forEach(removeSuit);
          function removeSuit(item, index, arr) {
            thirteenCardsWithCustomSuit.push(
              item[0] + madeHands.typeOfFlush[0].toUpperCase()
            );
          }
          thirteenCardsWithCustomSuit.unshift(
            'A' + madeHands.typeOfFlush[0].toUpperCase()
          );

          const sortedCombinedHandArray = [...tempFlush].sort();
          if (tempFlush[tempFlush.length - 1][0] == 'A') {
            sortedCombinedHandArray.unshift(
              'A' + madeHands.typeOfFlush[0].toUpperCase()
            );
          }

          let sortedStraighFlush = customSort(sortedCombinedHandArray);
          for (let i = 0; i < sortedStraighFlush.length; i++) {
            sortedStraighFlush[i] =
              sortedStraighFlush[i] + madeHands.typeOfFlush[0].toUpperCase();
          }

          let slicedArrayOfFive;
          for (let i = 0; i < 10; i++) {
            const tempArrayOfFive = [];
            tempArrayOfFive.push(thirteenCardsWithCustomSuit.slice(i, i + 5));

            for (let n = 0; n < 3; n++) {
              slicedArrayOfFive = sortedStraighFlush.slice(n, n + 5);

              if (i != 9) {
                if (
                  slicedArrayOfFive.toString() == tempArrayOfFive.toString()
                ) {
                  madeHands.hasStraightFlush.made = true;
                  madeHands.handStrength = 8;
                }
              } else {
                if (
                  slicedArrayOfFive.toString() == tempArrayOfFive.toString()
                ) {
                  madeHands.hasStraightFlush.made = true;
                  madeHands.hasRoyalFlush = true;
                  madeHands.handStrength = 9;
                }
              }
            }
          }
        }
      }
      const checkEveryCombination = () => {
        checkPair(combinedHandArray);
        checkTwoPair(combinedHandArrayClone);
        checkThreeOfaKind(combinedHandArray);
        checkStraight(combinedHandArray);
        checkFlush(combinedHandArray);
        checkFullHouse();
        checkFourOfaKind(combinedHandArray);
        checkStraightRoyalFlush(combinedHandArray);
        // Check if player made any hand? If not find his highest card
      };

      checkEveryCombination();

      return madeHands;
    }
    // add hand strength to player array
    for (let i in players) {
      // players[i].handStrength = checkHand(
      //   players[i].hand,
      //   communityCards
      // ).handStrength;
      players[i] = {
        ...players[i],
        ...checkHand(players[i].hand, communityCards)
      };
    }

    /**
     * find identical hand strength and return a winner
     * @returns index of the winner
     */
    const compareHandStrength = () => {
      // Reverse card value to playing cards
      const getCardByValue = (value) => {
        return Object.keys(cardRanking).find(
          (key) => cardRanking[key] === value
        );
      };
      // Isolate hand strength from array of all players
      const strengthArray = Object.values(players).map((e) => e.handStrength);
      // Find the highest strength
      const highestStrength = Math.max(...strengthArray);
      // Check if there are more than 1 players with the highest strength hand
      if (strengthArray.filter((e) => e === highestStrength).length > 1) {
        const winnersIndices = [];
        // add indices of the highest strength hand players to the array
        for (let i in strengthArray) {
          if (strengthArray[i] == highestStrength) {
            winnersIndices.push(+i);
          }
        }

        const checkHighCardTie = (indices) => {
          const winnerScores = [];
          // Map winner combined hand arrays to winner scores array
          for (
            let i = 0;
            i < strengthArray.filter((e) => e === highestStrength).length;
            i++
          ) {
            // convert player hands into points arrays
            winnerScores.push(
              players[indices[i]].hand
                .concat(...communityCards)
                .map((card) => cardRanking[card[0]])
                .sort((a, b) => b - a)
            );
          }
          // Loop throogh the first 5 cards with highest value
          for (let j = 0; j < 5; j++) {
            const cards = [];
            // Add ith cards from every player to the array
            for (let i = 0; i < indices.length; i++) {
              cards.push(winnerScores[i][j]);
            }

            // Find max value of current set of hands
            const maxValue = Math.max(...cards);
            const findWinningFive = (cards, idx) => {
              const everyCard = [
                ...players[idx].hand.concat(...communityCards)
              ];

              // find 5 best cards

              const bestFiveCardsToValuesSorted = everyCard
                .map((card) => {
                  return [cardRanking[card[0]], card[1]];
                  // return cardRanking(card[0]) + card[1];
                })
                .sort((a, b) => b[0] - a[0])
                .slice(0, 5)
                .map((card) => {
                  return getCardByValue(card[0]) + card[1];
                });
              return bestFiveCardsToValuesSorted;
            };
            // return index or indices of the players with the best winning combination
            if (
              !cards.every((card) => card == maxValue) &&
              cards.filter((card) => card == maxValue).length == 1
            ) {
              // add winning combo to the player with the best hand
              if (
                players[cards.indexOf(maxValue)].winningCombination.length == 0
              ) {
                players[cards.indexOf(maxValue)].winningCombination.push(
                  ...findWinningFive(cards, cards.indexOf(maxValue))
                );
              }

              // returns index of the winner
              return cards.indexOf(maxValue);
            } else if (
              // If there's more than 1 winner with highest value
              !cards.every((card) => card == maxValue) &&
              cards.filter((card) => card == maxValue).length > 1
            ) {
              console.log(cards);

              const winnersIndices = cards
                .map((card, idx) => {
                  if (card !== maxValue) return null;
                  else return idx;
                })
                .filter((idx) => idx !== null);
              // Isolate the best 5 cards from all players and assign it to winning combination
              winnersIndices.forEach((idx) => {
                if (players[idx].winningCombination.length == 0) {
                  players[idx].winningCombination.push(
                    ...findWinningFive(cards, idx)
                  );
                }
              });
              console.log(winnersIndices);
              // Rank the score of 5 best cards and compare them
              const highestFiveCardScore = new Array(winnersIndices.length);

              for (let i = 0; i < winnersIndices.length; i++) {
                highestFiveCardScore[i] = players[
                  winnersIndices[i]
                ].winningCombination
                  .map((card) => cardRanking[card[0]])
                  .reduce((acc, cur) => acc + cur, 0);
              }
              // Check if not equal
              console.log(highestFiveCardScore);
              if (
                highestFiveCardScore.length !==
                new Set(highestFiveCardScore).size
              ) {
                console.log(winnersIndices);

                return winnersIndices;
              }
              // Check if every combination is equal
            } else if (cards.every((card) => (card = maxValue))) {
              winnersIndices.forEach((idx) => {
                if (players[idx].winningCombination.length == 0) {
                  players[idx].winningCombination.push(
                    ...findWinningFive(cards, idx)
                  );
                }
              });
            }
          }
          // return all players
          return indices;
        };

        const checkPairTie = (indices) => {
          for (let idx of indices) {
            console.log(players[idx]);
          }
          return indices;
        };

        // Run the check for highest scoring combination
        switch (highestStrength) {
          case 0:
            return checkHighCardTie(winnersIndices);
          case 1:
            return checkPairTie(winnersIndices);
        }
      } else {
        let winnerId;
        let maxStrength = -1;
        for (let player of players) {
          if (player.handStrength > maxStrength) {
            maxStrength = player.handStrength;
            winnerId = player.id;
          }
        }

        return players.findIndex((player) => player.id === winnerId);
      }
    };

    /**
     *Packages winners and players into and object and returns data request Object
     *@returns data package with winner and all players
     */

    const checkWinner = () => {
      const winnerIdx = compareHandStrength();
      if (typeof winnerIdx == 'object') {
        const winners = [];
        for (let i of winnerIdx) {
          winners.push(players[i]);
        }

        return winners;
      } else if (typeof winnerIdx == 'number') {
        return [players[winnerIdx]];
      }
    };
    const data = { winners: checkWinner(), players: players };

    return data;
  }
};
