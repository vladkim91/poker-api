const { checkHighCardTie, } = require('./tieBreakerFunctions/checkHighCardTie');
const { checkPairTie, } = require('./tieBreakerFunctions/checkPairTie');
const { checkTwoPairTie } = require('./tieBreakerFunctions/checkTwoPairTie')
const cardRanking = {
  2: 0,
  3: 1,
  4: 2,
  5: 3,
  6: 4,
  7: 5,
  8: 6,
  9: 7,
  T: 8,
  J: 9,
  Q: 10,
  K: 11,
  A: 12
};
// Reverse card value to playing cards
const getCardByValue = (value) => {
  return Object.keys(cardRanking).find((key) => cardRanking[key] === value);
};
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

    // Run the check for highest scoring combination
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
        return checkPairTie(winnersIndices,
          players,
          ...cc);
      case 2:
        return checkTwoPairTie(winnersIndices, players, ...cc);
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

    return players.findIndex((player) => player.id === winnerId);
  }
};

module.exports = {
  compareHandStrength
};
