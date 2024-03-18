const { cardSuitRanking } = require('../functions');
const checkTwoPairTie = (indices, players, cc) => {
  console.log(indices, players, cc);

  return [];
};

const findTwoPairWinningCombination = (player) => {
  //   console.log(player);
  return [...player.hasTwoPair.twoPairMade, player.hasTwoPair.kicker];
};

module.exports = { checkTwoPairTie, findTwoPairWinningCombination };
