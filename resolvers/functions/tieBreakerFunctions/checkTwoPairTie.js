const { cardSuitRanking } = require('../functions');
const checkTwoPairTie = (indices, players) => {
  // Function to extract pair values and kicker from a player's hand
  const getHandComponents = (player) => {
    const pairs = player.hasTwoPair.twoPairMade.map((card) => card[0]);
    return {
      highestPair: Math.max(
        cardSuitRanking.cardRanking[pairs[0]],
        cardSuitRanking.cardRanking[pairs[2]]
      ),
      secondPair: Math.min(
        cardSuitRanking.cardRanking[pairs[0]],
        cardSuitRanking.cardRanking[pairs[2]]
      ),
      kicker: cardSuitRanking.cardRanking[player.hasTwoPair.kicker[0]]
    };
  };

  // Compare players based on the poker hand ranking rules
  let winningIndices = [];
  let bestHand = { highestPair: -1, secondPair: -1, kicker: -1 };

  indices.forEach((index) => {
    const player = players[index];
    const handComponents = getHandComponents(player);

    const isBetterHand = (hand1, hand2) => {
      if (hand1.highestPair > hand2.highestPair) return true;
      if (
        hand1.highestPair === hand2.highestPair &&
        hand1.secondPair > hand2.secondPair
      )
        return true;
      if (
        hand1.highestPair === hand2.highestPair &&
        hand1.secondPair === hand2.secondPair &&
        hand1.kicker > hand2.kicker
      )
        return true;
      return false;
    };

    if (isBetterHand(handComponents, bestHand)) {
      winningIndices = [index];
      bestHand = handComponents;
    } else if (
      handComponents.highestPair === bestHand.highestPair &&
      handComponents.secondPair === bestHand.secondPair &&
      handComponents.kicker === bestHand.kicker
    ) {
      winningIndices.push(index);
    }
  });

  if (winningIndices.length == 1) {
    players[winningIndices[0]].winningCombination =
      findTwoPairWinningCombination(players[winningIndices[0]]);
  } else {
    winningIndices.forEach((index) => {
      players[index].winningCombination = findTwoPairWinningCombination(
        players[index]
      );
    });
  }

  return winningIndices;
};

const findTwoPairWinningCombination = (player) => {
  return [...player.hasTwoPair.twoPairMade, player.hasTwoPair.kicker];
};

module.exports = { checkTwoPairTie, findTwoPairWinningCombination };
