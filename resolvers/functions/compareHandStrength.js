const { tieBreakers } = require('./tieBreakerFunctions/tieBreakerFunctions');
const { findCombinations } = require('./tieBreakerFunctions/findCombinations');
const compareHandStrength = (players, cc) => {
  const strengthArray = Object.values(players).map((e) => e.handStrength);
  const highestStrength = Math.max(...strengthArray);

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
        return tieBreakers.checkHighCardTie(
          winnersIndices,
          strengthArray,
          highestStrength,
          players,
          cc
        );
      case 1:
        return tieBreakers.checkPairTie(winnersIndices, players, cc);
      case 2:
        return tieBreakers.checkTwoPairTie(winnersIndices, players, cc);
      case 3:
        return tieBreakers.checkThreeOfaKindTie(winnersIndices, players, cc);
      case 4:
        return tieBreakers.checkStraightTie(winnersIndices, players, cc);
      case 5:
        return tieBreakers.checkFlushTie(winnersIndices, players, cc);
      case 6:
        return tieBreakers.checkFullHouseTie(winnersIndices, players, cc);
      case 7:
        return tieBreakers.checkFourOfaKindTie(winnersIndices, players, cc);
      case 8:
        return tieBreakers.checkStraightFlushTie(winnersIndices, players, cc);
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
      winner.winningCombination = findCombinations.findPairAndKickers(
        winner,
        cc
      );
      break;
    case 2:
      winner.winningCombination =
        findCombinations.findTwoPairWinningCombination(winner);
      break;
    case 3:
      winner.winningCombination =
        findCombinations.findThreeWinningCombination(winner);
      break;
    case 4:
      winner.winningCombination =
        findCombinations.findWinningStraightCombination(winner, cc);
      break;
    case 5:
      winner.winningCombination = findCombinations.findWinningFlushCombination(
        winner,
        cc
      );
      break;
    case 6:
      winner.winningCombination = findCombinations.findWinningFullHouse(
        winner,
        cc
      );
      break;
    case 7:
      winner.winningCombination = findCombinations.findFourWithKicker(
        winner,
        cc
      );
      break;
    case 8:
      winner.winningCombination =
        findCombinations.findStraightFlushCombination(winner);
  }
};

module.exports = {
  compareHandStrength
};
