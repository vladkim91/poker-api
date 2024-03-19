const { cardSuitRanking } = require('../functions');
const checkPairTie = (indices, players, cc) => {
  // Determine the best pair among the players and collect those with the highest pair

  let highestPairRank = -1;
  let contenders = [];

  const getRankValue = (card) => cardSuitRanking.cardRanking[card];
  indices.forEach((index) => {
    const player = players[index];
    const pairRank = cardSuitRanking.cardRanking[player.hasPair.highestCard[0]];
    if (pairRank > highestPairRank) {
      highestPairRank = pairRank;
      contenders = [index]; // Reset contenders with the new highest pair holder
    } else if (pairRank === highestPairRank) {
      contenders.push(index); // Add index for tie scenario
    }
  });

  // If there's no tie, return the winner
  if (contenders.length === 1) {
    players[contenders[0]].winningCombination = findPairAndKickers(
      players[contenders[0]],
      cc
    );
    return [contenders[0]];
  }
  let finalWinners = [...contenders];

  // Resolve tie with kickers

  // Compare kickers of the remaining players to find the winner
  // Compare kickers for tied players
  for (let kickerIndex = 2; kickerIndex >= 0; kickerIndex--) {
    let maxKickerValue = -1;
    let currentKickerWinners = [];

    // Evaluate kicker for each contender
    finalWinners.forEach((index) => {
      const kickerValue = getRankValue(
        players[index].hasPair.kickers[kickerIndex][0]
      );

      if (kickerValue > maxKickerValue) {
        maxKickerValue = kickerValue;
        currentKickerWinners = [index];
      } else if (kickerValue === maxKickerValue) {
        currentKickerWinners.push(index);
      }
    });

    // Update final winners after each kicker comparison
    finalWinners = currentKickerWinners;

    // If a single winner is determined after any kicker comparison, break early
    if (finalWinners.length === 1) {
      break;
    }
  }

  // Return all indices if tied on all kickers or the single winner
  for (let playerIdx of finalWinners) {
    players[playerIdx].winningCombination = findPairAndKickers(
      players[playerIdx],
      cc
    );
  }

  return finalWinners;
};

const findPairAndKickers = (player, cc) => {
  const kickersWithSuits = [];
  const allCards = [...player.hand, ...cc];
  for (let i = 0; i < 3; i++) {
    kickersWithSuits.push(
      allCards.find((card) => card == player.hasPair.kickers[i])
    );
  }
  let madePair;
  if (player.hand.includes(player.hasPair.highestCard)) {
    madePair = [
      player.hasPair.highestCard,
      cc.find((card) => card[0] === player.hasPair.highestCard[0])
    ];
  } else {
    madePair = [
      player.hasPair.highestCard,
      cc.find((card) => {
        return (
          card[0] === player.hasPair.highestCard[0] &&
          card[1] !== player.hasPair.highestCard[1]
        );
      })
    ];
  }
  return madePair.concat(kickersWithSuits);
};

module.exports = { checkPairTie, findPairAndKickers };
