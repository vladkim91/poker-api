const { cardSuitRanking, cardConversions } = require('../functions');

const checkStraightTie = (indices, players, cc) => {
  const contenders = [];
  indices.forEach((index) => {
    contenders.push(
      cardSuitRanking.cardRanking[players[index].hasStraight.highestCard]
    );
  });
  const maxValue = Math.max(...contenders);
  winners = [];
  contenders.forEach((straighValue, idx) => {
    if (straighValue == maxValue) {
      winners.push(idx);
    }
  });
  if (winners.length == 1) {
    players[winners[0]].winningCombination = findWinningStraightCombination(
      players[winners[0]],
      cc
    );
  } else {
    winners.forEach((index) => {
      players[index].winningCombination = findWinningStraightCombination(
        players[index],
        cc
      );
    });
  }
  return winners;
};

const findWinningStraightCombination = (player, cc) => {
  const results = [];
  const allCards = [...player.hand, ...cc];
  let lowCard = cardSuitRanking.cardRanking[player.hasStraight.highestCard] - 4;
  if (lowCard === -1) lowCard = 12;
  const playerStraightTemp =
    cardSuitRanking.everyStraightCombination[
      cardConversions.getCardByValue(lowCard)
    ].split(',');
  playerStraightTemp.forEach((temp) => {
    results.push(allCards.find((card) => card[0] == temp));
  });

  return results;
};

module.exports = { checkStraightTie, findWinningStraightCombination };
