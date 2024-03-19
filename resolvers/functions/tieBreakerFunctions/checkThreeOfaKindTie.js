const { cardSuitRanking } = require('../functions');
const checkThreeOfaKindTie = (indices, players, cc) => {
  // Determine the winner based on the three-of-a-kind and kickers
  let winners = [];
  let highestThreeRank = -1;
  let highestFirstKicker = -1;
  let highestSecondKicker = -1;

  indices.forEach((index) => {
    const player = players[index];
    const threeRank =
      cardSuitRanking.cardRanking[player.hasThreeOfaKind.madeThree[0][0]];
    const firstKicker =
      cardSuitRanking.cardRanking[player.hasThreeOfaKind.firstKicker[0]];
    const secondKicker =
      cardSuitRanking.cardRanking[player.hasThreeOfaKind.secondKicker[0]];

    if (
      threeRank > highestThreeRank ||
      (threeRank === highestThreeRank && firstKicker > highestFirstKicker) ||
      (threeRank === highestThreeRank &&
        firstKicker === highestFirstKicker &&
        secondKicker > highestSecondKicker)
    ) {
      highestThreeRank = threeRank;
      highestFirstKicker = firstKicker;
      highestSecondKicker = secondKicker;
      winners = [index];
    } else if (
      threeRank === highestThreeRank &&
      firstKicker === highestFirstKicker &&
      secondKicker === highestSecondKicker
    ) {
      winners.push(index); // Tie condition
    }
  });
  if (winners.length == 1) {
    players[winners[0]].winningCombination = findThreeWinningCombination(
      players[winners[0]]
    );
  } else {
    winners.forEach((index) => {
      players[index].winningCombination = findThreeWinningCombination(
        players[index]
      );
    });
  }
  return winners; // Return the index or indices of the winner(s)
};

const findThreeWinningCombination = (player) => {
  return [
    ...player.hasThreeOfaKind.madeThree,
    player.hasThreeOfaKind.firstKicker,
    player.hasThreeOfaKind.secondKicker
  ];
};

module.exports = { findThreeWinningCombination, checkThreeOfaKindTie };
