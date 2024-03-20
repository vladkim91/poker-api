const { cardSuitRanking } = require('../functions');
const checkFullHouseTie = (indices, players, cc) => {
  let highestFull = -1;
  let highestKicker = -1;
  let winners = [];

  // Iterate through each player and compare their full house
  indices.forEach((index) => {
    const player = players[index];
    const fullRank = cardSuitRanking.cardRanking[player.hasFullHouse.full];
    const kickerRank = cardSuitRanking.cardRanking[player.hasFullHouse.kicker];

    // Compare the rank of the three-of-a-kind part
    if (
      fullRank > highestFull ||
      (fullRank === highestFull && kickerRank > highestKicker)
    ) {
      highestFull = fullRank;
      highestKicker = kickerRank;
      winners = [index]; // New highest full house found
    } else if (fullRank === highestFull && kickerRank === highestKicker) {
      winners.push(index); // Tie with the current highest full house
    }
  });
  winners.forEach(
    (index) =>
      (players[index].winningCombination = findWinningFullHouse(players[index]))
  );
  return winners;
};

const findWinningFullHouse = (player) => {
  return player.hasFullHouse.fullHouse;
};

module.exports = { checkFullHouseTie, findWinningFullHouse };
