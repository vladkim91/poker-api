const cardSuitRanking = {
  cards: ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'],
  suits: ['H', 'S', 'D', 'C'],
  cardRanking: {
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
  },
  everyStraightCombination: {
    A: 'A,2,3,4,5',
    2: '2,3,4,5,6',
    3: '3,4,5,6,7',
    4: '4,5,6,7,8',
    5: '5,6,7,8,9',
    6: '6,7,8,9,T',
    7: '7,8,9,T,J',
    8: '8,9,T,J,Q',
    9: '9,T,J,Q,K',
    T: 'T,J,Q,K,A'
  }
};
const cardConversions = {
  createDeck() {
    let deck = [];
    for (let i = 0; i < cardSuitRanking.suits.length; i++) {
      for (let n = 0; n < cardSuitRanking.cards.length; n++) {
        deck.push(cardSuitRanking.cards[n] + cardSuitRanking.suits[i]);
      }
    }

    return deck;
  },
  splitTheString(cardsString) {
    const playersArray = [];
    const communityCards = [];
    const cc = cardsString[0].slice(3).split(',');
    communityCards.push(cc);
    for (let i = 1; i < cardsString.length; i++) {
      const playerString = cardsString[i].split('=');
      const obj = {};
      const [id, hand] = playerString;
      obj.id = id;
      obj.hand = hand.split(',');
      playersArray.push(obj);
    }

    return [playersArray, communityCards];
  },
  getCardByValue(value) {
    return Object.keys(cardSuitRanking.cardRanking).find(
      (key) => cardSuitRanking.cardRanking[key] === value
    );
  }
};
const checkIfValid = (input) => {
  const brandNewDeck = cardConversions.createDeck();
  // Combine players and cc in 1 array
  const allCards = input
    .split('/')
    .map((cards) => cards.split('=')[1].split(','))
    .flat();

  const checkInvalidCards = () => {
    const cardsChecked = [];
    // split string into array of cards

    // push every checked card into cardsCheckedArray
    allCards.forEach((card) => {
      const cardDuplicate =
        brandNewDeck[brandNewDeck.indexOf(card.toUpperCase())];
      if (cardDuplicate == undefined) return false;
      cardsChecked.push(cardDuplicate);
    });

    // remove duplicated if any are present
    const setOfCards = new Set(cardsChecked);
    if (allCards.length !== setOfCards.size)
      console.log(allCards, 'duplicate found');
    return allCards.length == setOfCards.size;
  };

  const checkHandLength = () => {
    for (hand of allCards) {
      if (hand.length != 2) return false;
    }
    return true;
  };
  return checkInvalidCards() ? checkHandLength() : false;
};

function customSort(sortedArray) {
  const tempPlaceHolder = [];
  for (let i = 0; i < sortedArray.length; i++) {
    if (isNaN(sortedArray[i][0]) != true) {
      tempPlaceHolder.push(sortedArray[i]);
    }
  }

  let letterCards = ['T', 'J', 'Q', 'K', 'A'];

  /**
   *
   * @param {string that represents current card} card
   * @param {string that represents custom sorted letters from J to A} t
   */
  function pushTJQKA(card, t) {
    for (let i = 0; i < sortedArray.length; i++) {
      if (isNaN(card[i][0]) != false && card[i][0] == t) {
        tempPlaceHolder.push(card[i]);
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

const checkCombinationFunctions = {
  checkPair(hand, madeHands, combinedHandArrayClone) {
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
          madeHands.hasPair.kickers.push(
            ...customSort(combinedHandArrayClone.sort()).slice(-3)
          );
          madeHands.hasPair.highestCard = hand[i];
          madeHands.hasPair.made = true;
          madeHands.hasTwoPair.twoPairMade.push(hand[i], hand[n]);
          madeHands.handStrength = 1;
          break;
        }
      }
    }
  },
  checkTwoPair(hand, madeHands) {
    for (let i = 0; i < hand.length; i++) {
      for (let n = 0; n < hand.length; n++) {
        if (
          madeHands.hasPair.made == true &&
          hand[i][0] == hand[n][0] &&
          i != n
        ) {
          madeHands.hasTwoPair.made = true;
          madeHands.handStrength = 2;
          madeHands.hasTwoPair.twoPairMade.push(hand[i], hand[n]);
          hand.splice(i, 1);
          hand.splice(n - 1, 1);
          madeHands.hasTwoPair.kicker = customSort(hand.sort())[
            customSort(hand).length - 1
          ];

          if (madeHands.hasTwoPair.twoPairMade.length > 4) {
            let bestTwoPairs = [];
            highestRankingPair = [
              ...new Set(
                madeHands.hasTwoPair.twoPairMade.map((card) => card[0])
              )
            ]
              .map((cardValue) => cardSuitRanking.cardRanking[cardValue])
              .sort((a, b) => a - b)
              .slice(1, 3);

            madeHands.hasTwoPair.twoPairMade.forEach((card) => {
              if (
                highestRankingPair.includes(
                  cardSuitRanking.cardRanking[card[0]]
                )
              )
                bestTwoPairs.push(card);
            });
            madeHands.hasTwoPair.twoPairMade = bestTwoPairs;
          }
          break;
        }
      }
    }
  },
  checkThreeOfaKind(hand, madeHands) {
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
            madeHands.hasThreeOfaKind.madeThree = [hand[i], hand[n], hand[y]];

            const sortedRemainderOfTheCards = customSort(
              hand
                .filter(
                  (card) => card[0][0] !== madeHands.hasThreeOfaKind.highestCard
                )
                .sort()
            );

            madeHands.hasThreeOfaKind.firstKicker =
              sortedRemainderOfTheCards[sortedRemainderOfTheCards.length - 1];
            madeHands.hasThreeOfaKind.secondKicker =
              sortedRemainderOfTheCards[sortedRemainderOfTheCards.length - 2];
            break;
          }
        }
      }
    }
  },

  checkStraight(hand, madeHands) {
    let noDuplicateHand = [
      ...new Set(customSort(hand.sort()).map((card) => card[0]))
    ];
    if (noDuplicateHand.includes('A')) noDuplicateHand.unshift('A');

    // Sort player + communityCards

    for (let n = 0; n < noDuplicateHand.length - 4; n++) {
      let currentSlice = noDuplicateHand.slice(n, n + 5);

      if (
        currentSlice.toString() ==
        cardSuitRanking.everyStraightCombination[currentSlice[0]]
      ) {
        madeHands.hasStraight.made = true;
        madeHands.handStrength = 4;
        madeHands.hasStraight.highestCard =
          cardSuitRanking.everyStraightCombination[currentSlice[0]][8];
      }
    }
  },
  checkFlush(hand, madeHands) {
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
          madeHands.hasFlush.typeOfFlush =
            Object.keys(suitCounter)[i].toUpperCase();

          flushSuit = madeHands.hasFlush.typeOfFlush[0];
          madeHands.hasFlush.madeFlush = customSort(
            hand.filter((card) => card[1] == flushSuit)
          )
            .reverse()
            .splice(0, 5);
          madeHands.hasFlush.highestCard = madeHands.hasFlush.madeFlush[0];
        }
      }
    }
  },
  checkFullHouse(madeHands) {
    if (
      madeHands.hasTwoPair.made == true &&
      madeHands.hasThreeOfaKind.made == true
    ) {
      madeHands.hasFullHouse.made = true;
      madeHands.handStrength = 6;
      madeHands.hasFullHouse.full = madeHands.hasThreeOfaKind.madeThree[0][0];
      madeHands.hasFullHouse.three = madeHands.hasThreeOfaKind.madeThree;
      madeHands.hasFullHouse.fullHouse = [
        ...new Set(
          madeHands.hasThreeOfaKind.madeThree.concat(
            madeHands.hasTwoPair.twoPairMade
          )
        )
      ];
      madeHands.hasFullHouse.pair = madeHands.hasFullHouse.fullHouse.filter(
        (card) => !madeHands.hasFullHouse.three.includes(card)
      );
      madeHands.hasFullHouse.kicker = madeHands.hasFullHouse.pair[0][0];
    }
  },
  // checkFourOfaKind(hand, madeHands) {
  //   for (let i = 0; i < hand.length; i++) {
  //     for (let n = 0; n < hand.length; n++) {
  //       if (hand[i][0] == hand[n][0] && i != n) {
  //         for (let x = 0; x < hand.length; x++) {
  //           if (hand[n][0] == hand[x][0] && n != x && i != x) {
  //             for (let y = 0; y < hand.length; y++) {
  //               if (hand[x][0] == hand[y][0] && x != y && n != y && i != y) {
  //                 madeHands.hasFourOfaKind.made = true;
  //                 madeHands.hasFullHouse.made = false;
  //                 madeHands.handStrength = 7;
  //                 madeHands.hasFourOfaKind.fourMade = [
  //                   hand[n],
  //                   hand[x],
  //                   hand[y],
  //                   hand[i]
  //                 ];
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // },
  checkFourOfaKind(hand, madeHands) {
    // Initialize a map to count occurrences of each rank
    let rankCount = {};
    hand.forEach((card) => {
      const rank = card[0];
      rankCount[rank] = (rankCount[rank] || 0) + 1;
    });

    // Find the rank that occurs four times
    let fourOfaKindRank = null;
    for (let rank in rankCount) {
      if (rankCount[rank] === 4) {
        fourOfaKindRank = rank;
        madeHands.hasFourOfaKind.made = true;
        madeHands.hasFullHouse.made = false;
        madeHands.handStrength = 7;
        madeHands.hasFourOfaKind.fourMade = hand.filter(
          (card) => card[0] === rank
        );
        madeHands.hasFourOfaKind.highestCard =
          madeHands.hasFourOfaKind.fourMade[0][0];
        break;
      }
    }

    // If a Four of a Kind was found, find the highest kicker
    if (fourOfaKindRank) {
      let kickers = hand
        .filter((card) => card[0] !== fourOfaKindRank)
        .map((card) => ({
          rank: card[0],
          value: cardSuitRanking.cardRanking[card[0]]
        }));
      let highestKicker = kickers.reduce(
        (max, card) => (card.value > max.value ? card : max),
        { value: -1 }
      );
      madeHands.hasFourOfaKind.kicker = highestKicker.rank;
    }
  },

  checkStraightRoyalFlush(hand, madeHands) {
    const tempFlush = [];
    if (madeHands.hasStraight.made && madeHands.hasFlush.made) {
      switch (madeHands.hasFlush.typeOfFlush) {
        case 'HEARTS': {
          for (i = 0; i < hand.length; i++) {
            if (hand[i][1] == 'H') tempFlush.push(hand[i]);
          }
          break;
        }
        case 'SPADES': {
          for (i = 0; i < hand.length; i++) {
            if (hand[i][1] == 'S') tempFlush.push(hand[i]);
          }
          break;
        }
        case 'CLUBS': {
          for (i = 0; i < hand.length; i++) {
            if (hand[i][1] == 'C') tempFlush.push(hand[i]);
          }
          break;
        }
        case 'DIAMONDS': {
          for (let i = 0; i < hand.length; i++) {
            if (hand[i][1] == 'D') tempFlush.push(hand[i]);
          }
          break;
        }
      }

      let thirteenCardsInOrder = cardConversions.createDeck().slice(0, 13);
      let thirteenCardsWithCustomSuit = [];
      thirteenCardsInOrder.forEach(removeSuit);
      function removeSuit(item, index, arr) {
        thirteenCardsWithCustomSuit.push(
          item[0] + madeHands.hasFlush.typeOfFlush[0]
        );
      }
      thirteenCardsWithCustomSuit.unshift(
        'A' + madeHands.hasFlush.typeOfFlush[0]
      );

      const sortedCombinedHandArray = [...tempFlush].sort();

      if (tempFlush[tempFlush.length - 1][0] == 'A') {
        sortedCombinedHandArray.unshift(
          'A' + madeHands.hasFlush.typeOfFlush[0]
        );
      }

      let sortedStraighFlush = customSort(sortedCombinedHandArray);
      for (let i = 0; i < sortedStraighFlush.length; i++) {
        sortedStraighFlush[i] =
          sortedStraighFlush[i] + madeHands.hasFlush.typeOfFlush[0];
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
  },

  checkEveryCombination(combinedHandArray, madeHands, combinedHandArrayClone) {
    this.checkPair(combinedHandArray, madeHands, combinedHandArrayClone);
    this.checkTwoPair(combinedHandArrayClone, madeHands);
    this.checkThreeOfaKind(combinedHandArray, madeHands);
    this.checkStraight(combinedHandArray, madeHands);
    this.checkFlush(combinedHandArray, madeHands);
    this.checkFullHouse(madeHands);
    this.checkFourOfaKind(combinedHandArray, madeHands);
    this.checkStraightRoyalFlush(combinedHandArray, madeHands);
  }
};

/**
 * Major function that checks every combination in player's hand + cc
 * @param {array of 2 players cards } hand
 * @param {array with 3 to 5 communityCards array} cc
 * @returns made hands object that describes the strongest combination the player will have in the showdown
 */
const checkHand = (hand, cc) => {
  let combinedHand = hand.concat(cc.join(',')).join(',');
  let combinedHandArray = combinedHand.split(',');
  const combinedHandArrayClone = [...combinedHandArray];
  const madeHands = {
    winningCombination: [],
    winningComboValues: [],
    hasPair: { made: false, highestCard: null, kickers: [] },
    hasTwoPair: { made: false, kicker: null, twoPairMade: [] },
    hasThreeOfaKind: {
      made: false,
      firstKicker: null,
      secondKicker: null,
      highestCard: null,
      madeThree: []
    },
    hasStraight: { made: false, highestCard: null },
    hasFlush: { made: false, highestCard: null, typeOfFlush: null },
    hasFullHouse: {
      made: false,
      full: null,
      kicker: null,
      three: [],
      pair: [],
      fullHouse: []
    },
    hasFourOfaKind: {
      made: false,
      highestCard: null,
      fourMade: [],
      kicker: null
    },
    hasStraightFlush: { made: false, highestCard: null },
    hasRoyalFlush: false,
    handStrength: 0
  };
  checkCombinationFunctions.checkEveryCombination(
    combinedHandArray,
    madeHands,
    combinedHandArrayClone
  );

  return madeHands;
};

const assignCombinationsToPlayers = (playersArray, cc) => {
  for (let i in playersArray) {
    playersArray[i] = {
      ...playersArray[i],
      ...checkHand(playersArray[i].hand, cc)
    };
  }
};

module.exports = {
  checkIfValid,
  assignCombinationsToPlayers,
  cardConversions,
  cardSuitRanking,
  customSort
};
