const { cardSuitRanking } = require('../functions');
const checkFlushTie = (indices, players, cc) => {
  const winners = [];
  let contenders = [];
  indices.forEach((index) => {
    contenders.push(
      cardSuitRanking.cardRanking[players[index].hasFlush.highestCard[0]]
    );
  });
  const maxValue = Math.max(...contenders);
  contenders.forEach((flushValue, idx) => {
    if (flushValue == maxValue) {
      winners.push(idx);
    }
  });
  if (winners.length == 1) {
    players[winners[0]].winningCombination = findWinningFlushCombination(
      players[winners[0]],
      cc
    );
  } else {
    return compareFlushHighCardTieBreaker(winners, players, cc);
  }

  return winners;
};
const findWinningFlushCombination = (player, cc) => {
  return player.hasFlush.madeFlush;
};

const compareFlushHighCardTieBreaker = (indices, players, cc) => {
  // Iterate over the kickers, starting from the second highest card (index 1)
  for (let kickerIdx = 1; kickerIdx < 5; kickerIdx++) {
    let highestKickerValue = -1;
    let winningIndices = [];

    indices.forEach((index) => {
      const player = players[index];
      const kickerValue =
        cardSuitRanking.cardRanking[player.hasFlush.madeFlush[kickerIdx][0]]; // Extract the rank from the card string

      if (kickerValue > highestKickerValue) {
        highestKickerValue = kickerValue;
        winningIndices = [index]; // This player has the highest kicker so far
      } else if (kickerValue === highestKickerValue) {
        winningIndices.push(index); // Tie for the highest kicker so far
      }
    });

    // Determine the winner based on the current kicker comparison
    if (winningIndices.length === 1 || kickerIdx === 4) {
      winningIndices.forEach((index) => {
        players[index].winningCombination = findWinningFlushCombination(
          players[index],
          cc
        );
      });
      return winningIndices; // Return the winner(s) based on this kicker
    }
    // If the kickers are equal, continue to the next kicker
  }

  // If all kickers are equal after comparing all, it's a complete tie
  return indices;
};

module.exports = { checkFlushTie, findWinningFlushCombination };
