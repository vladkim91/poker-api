const { checkHighCardTie } = require('./tieBreakerFunctions/checkHighCardTie');
const {
  checkPairTie,
  findPairAndKickers
} = require('./tieBreakerFunctions/checkPairTie');
const {
  checkTwoPairTie,
  findTwoPairWinningCombination
} = require('./tieBreakerFunctions/checkTwoPairTie');

const compareHandStrength = (players, cc) => {
  // Isolate hand strength from array of all players
  const strengthArray = Object.values(players).map((e) => e.handStrength);

  // Find the highest strength
  const highestStrength = Math.max(...strengthArray);

  // Check if there are more than 1 players with the highest strength hand
  if (strengthArray.filter((e) => e === highestStrength).length > 1) {
    const winnersIndices = [];
    // add indices of the highest strength hand players to the array
    for (let i in strengthArray) {
      if (strengthArray[i] == highestStrength) {
        winnersIndices.push(+i);
      }
    }

    switch (highestStrength) {
      case 0:
        return checkHighCardTie(
          winnersIndices,
          strengthArray,
          highestStrength,
          players,
          cc
        );
      case 1:
        return checkPairTie(winnersIndices, players, cc);
      case 2:
        return checkTwoPairTie(winnersIndices, players, cc);
    }
  } else {
    let winnerId;
    let maxStrength = -1;
    for (let player of players) {
      if (player.handStrength > maxStrength) {
        maxStrength = player.handStrength;
        winnerId = player.id;
      }
    }

    assignWinningCombination(
      players.find((player) => player.id === winnerId),
      cc
    );

    return players.findIndex((player) => player.id === winnerId);
  }
};

const assignWinningCombination = (winner, cc) => {
  switch (winner.handStrength) {
    case 1:
      winner.winningCombination = findPairAndKickers(winner, cc);
      break;
    case 2:
      winner.winningCombination = findTwoPairWinningCombination(winner);
      break;
  }
};

module.exports = {
  compareHandStrength
};
