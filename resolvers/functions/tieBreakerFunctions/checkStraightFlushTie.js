const { cardSuitRanking } = require('../functions');
const checkStraightFlushTie = (indices, players, cc) => {
  const contenders = [];
  const winners = [];
  indices.forEach((index) => {
    contenders.push(
      cardSuitRanking.cardRanking[
        players[index].hasStraightFlush.highestCard[0]
      ]
    );
  });
  const maxValue = Math.max(...contenders);
  contenders.forEach((straighValue, idx) => {
    if (straighValue == maxValue) {
      winners.push(idx);
    }
  });

  winners.forEach((index) => {
    players[index].winningCombination = findStraightFlushCombination(
      players[index]
    );
  });

  return winners;
};

const findStraightFlushCombination = (player) => {
  player.winningCombination = player.hasStraightFlush.madeStraightFlush;
  return player.winningCombination;
};

module.exports = {
  checkStraightFlushTie,
  findStraightFlushCombination
};
