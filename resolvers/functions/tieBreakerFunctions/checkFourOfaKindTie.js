const { cardSuitRanking } = require('../functions');
const checkFourOfaKindTie = (indices, players, cc) => {
  // Initialize tracking for the highest Four of a Kind and kicker
  let highestFourRank = -1;
  let highestKickerRank = -1;
  let winners = [];

  indices.forEach((index) => {
    const player = players[index];
    const fourRank =
      cardSuitRanking.cardRanking[player.hasFourOfaKind.highestCard];
    const kickerRank =
      cardSuitRanking.cardRanking[player.hasFourOfaKind.kicker];

    // Compare Four of a Kind rank
    if (fourRank > highestFourRank) {
      highestFourRank = fourRank;
      highestKickerRank = kickerRank;
      winners = [index]; // This player has the highest Four of a Kind so far
    } else if (fourRank === highestFourRank) {
      // If the Four of a Kind rank is the same, compare the kicker
      if (kickerRank > highestKickerRank) {
        highestKickerRank = kickerRank;
        winners = [index]; // This player has a better kicker
      } else if (kickerRank === highestKickerRank) {
        winners.push(index); // Tie situation
      }
    }
  });
  winners.forEach(
    (index) =>
      (players[index].winningCombination = findFourWithKicker(
        players[index],
        cc
      ))
  );
  return winners; // Return the index or indices of the player(s) with the highest Four of a Kind
};

const findFourWithKicker = (player, cc) => {
  const kickerWithSuit = [...player.hand, ...cc].find(
    (card) => card[0] === player.hasFourOfaKind.kicker
  );
  return [...player.hasFourOfaKind.fourMade, kickerWithSuit];
};

module.exports = { checkFourOfaKindTie, findFourWithKicker };
