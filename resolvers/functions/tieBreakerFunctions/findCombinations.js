const { cardConversions, cardSuitRanking } = require('../functions');

const findCombinations = {
  findWinningFive(players, idx, cc) {
    const everyCard = [...players[idx].hand.concat(cc)];
    const bestFiveCardsToValuesSorted = everyCard
      .map((card) => {
        return [cardSuitRanking.cardRanking[card[0]], card[1]];
      })
      .sort((a, b) => b[0] - a[0])
      .slice(0, 5)
      .map((card) => {
        return cardConversions.getCardByValue(card[0]) + card[1];
      });

    return bestFiveCardsToValuesSorted;
  },
  findPairAndKickers(player, cc) {
    const kickersWithSuits = [];
    const allCards = [...player.hand, ...cc];
    for (let i = 0; i < 3; i++) {
      kickersWithSuits.push(
        allCards.find((card) => card == player.hasPair.kickers[i])
      );
    }
    let madePair;
    if (player.hand.includes(player.hasPair.highestCard)) {
      madePair = [
        player.hasPair.highestCard,
        cc.find((card) => card[0] === player.hasPair.highestCard[0])
      ];
    } else {
      madePair = [
        player.hasPair.highestCard,
        cc.find((card) => {
          return (
            card[0] === player.hasPair.highestCard[0] &&
            card[1] !== player.hasPair.highestCard[1]
          );
        })
      ];
    }
    return madePair.concat(kickersWithSuits);
  },
  findTwoPairWinningCombination(player) {
    return [...player.hasTwoPair.twoPairMade, player.hasTwoPair.kicker];
  },
  findThreeWinningCombination(player) {
    return [
      ...player.hasThreeOfaKind.madeThree,
      player.hasThreeOfaKind.firstKicker,
      player.hasThreeOfaKind.secondKicker
    ];
  },
  findWinningStraightCombination(player, cc) {
    const results = [];
    const allCards = [...player.hand, ...cc];
    let lowCard =
      cardSuitRanking.cardRanking[player.hasStraight.highestCard] - 4;
    if (lowCard === -1) lowCard = 12;
    const playerStraightTemp =
      cardSuitRanking.everyStraightCombination[
        cardConversions.getCardByValue(lowCard)
      ].split(',');
    playerStraightTemp.forEach((temp) => {
      results.push(allCards.find((card) => card[0] == temp));
    });

    return results;
  },
  findWinningFlushCombination(player) {
    return player.hasFlush.madeFlush;
  },
  findWinningFullHouse(player) {
    return player.hasFullHouse.fullHouse;
  },
  findFourWithKicker(player, cc) {
    const kickerWithSuit = [...player.hand, ...cc].find(
      (card) => card[0] === player.hasFourOfaKind.kicker
    );
    return [...player.hasFourOfaKind.fourMade, kickerWithSuit];
  },
  findStraightFlushCombination(player) {
    player.winningCombination = player.hasStraightFlush.madeStraightFlush;
    return player.winningCombination;
  }
};
module.exports = { findCombinations };
