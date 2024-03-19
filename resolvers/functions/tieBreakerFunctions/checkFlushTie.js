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
    // find kickers
    // winners.forEach((index) => {
    //   players[index].winningCombination = findWinningFlushCombination(
    //     players[index],
    //     cc
    //   );
    // });
  }

  return winners;
};
const findWinningFlushCombination = (player, cc) => {
  return player.hasFlush.madeFlush;
};
module.exports = { checkFlushTie, findWinningFlushCombination };
