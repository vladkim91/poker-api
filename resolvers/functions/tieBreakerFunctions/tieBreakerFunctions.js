const { cardSuitRanking } = require('../functions');
const { findCombinations } = require('./findCombinations');

const tieBreakers = {
  checkHighCardTie(indices, strengthArray, highestStrength, players, cc) {
    const winnerScores = [];
    // Map winner combined hand arrays to winner scores array

    for (
      let i = 0;
      i < strengthArray.filter((e) => e === highestStrength).length;
      i++
    ) {
      // convert player hands into points arrays
      winnerScores.push(
        players[indices[i]].hand
          .concat(cc)
          .map((card) => cardSuitRanking.cardRanking[card[0]])
          .sort((a, b) => b - a)
      );
    }

    // Loop throogh the first 5 cards with highest value
    for (let j = 0; j < 5; j++) {
      const cards = [];
      // Add ith cards from every player to the array
      for (let i = 0; i < indices.length; i++) {
        cards.push(winnerScores[i][j]);
      }

      // findCombinations.Find max value of current set of hands
      const maxValue = Math.max(...cards);

      // return index or indices of the players with the best winning combination
      // IF 1 PLAYERS WINS

      if (
        !cards.every((card) => card == maxValue) &&
        cards.filter((card) => card == maxValue).length == 1
      ) {
        // add winning combo to the player with the best hand
        if (players[cards.indexOf(maxValue)].winningCombination.length == 0) {
          players[cards.indexOf(maxValue)].winningCombination.push(
            ...findCombinations.findWinningFive(
              players,
              cards.indexOf(maxValue),
              cc
            )
          );
        }

        // returns index of the winner

        return cards.indexOf(maxValue);
      } else if (
        //
        // IF THERE'S MORE than 1 winner with highest value
        !cards.every((card) => card == maxValue) &&
        cards.filter((card) => card == maxValue).length > 1
      ) {
        const winnersIndices = cards
          .map((card, idx) => {
            if (card !== maxValue) return null;
            else return idx;
          })
          .filter((idx) => idx !== null);
        // Isolate the best 5 cards from all players and assign it to winning combination
        winnersIndices.forEach((idx) => {
          if (players[idx].winningCombination.length == 0) {
            players[idx].winningCombination.push(
              ...findCombinations.findWinningFive(players, idx, cc)
            );
            const values = [
              ...findCombinations.findWinningFive(players, idx, cc)
            ].map((card) => cardSuitRanking.cardRanking[card[0]]);
            players[idx].winningComboValues.push(...values);
          }
        });

        // Rank the score of 5 best cards and compare them

        function findTieBreakerWinners(playerIndices) {
          // This will hold the index of the player with the currently winning hand
          let winningIndex = playerIndices[0];

          // Go through each card position starting from the highest
          for (let cardPos = 0; cardPos < 5; cardPos++) {
            let maxCardValue =
              players[winningIndex].winningComboValues[cardPos];
            let winners = [winningIndex];

            // Compare this card with the same card from other players' hands
            for (let i = 1; i < playerIndices.length; i++) {
              let currentIndex = playerIndices[i];
              let currentCardValue =
                players[currentIndex].winningComboValues[cardPos];

              // If we findCombinations.find a higher card, update the max value and reset the winners array
              if (currentCardValue > maxCardValue) {
                maxCardValue = currentCardValue;
                winningIndex = currentIndex;
                winners = [currentIndex];
              } else if (currentCardValue === maxCardValue) {
                // If the card values are the same, add this player to the winners array
                winners.push(currentIndex);
              }
            }

            // If there's only one winner and we're not at the last card, break early
            if (winners.length === 1 && cardPos < 4) {
              return winningIndex;
            } else if (winners.length > 1 && cardPos === 4) {
              // If it's the last card and there's more than one winner, it's a tie
              return winners; // Return the indices of all tied players
            }
          }

          // If somehow we get here, default to the first player (shouldn't happen with proper input)
          return winningIndex;
        }
        return findCombinations.findTieBreakerWinners(winnersIndices);
      }
    }
  },
  checkPairTie(indices, players, cc) {
    // Determine the best pair among the players and collect those with the highest pair

    let highestPairRank = -1;
    let contenders = [];

    const getRankValue = (card) => cardSuitRanking.cardRanking[card];
    indices.forEach((index) => {
      const player = players[index];
      const pairRank =
        cardSuitRanking.cardRanking[player.hasPair.highestCard[0]];
      if (pairRank > highestPairRank) {
        highestPairRank = pairRank;
        contenders = [index]; // Reset contenders with the new highest pair holder
      } else if (pairRank === highestPairRank) {
        contenders.push(index); // Add index for tie scenario
      }
    });

    // If there's no tie, return the winner
    if (contenders.length === 1) {
      players[contenders[0]].winningCombination =
        findCombinations.findPairAndKickers(players[contenders[0]], cc);
      return [contenders[0]];
    }
    let finalWinners = [...contenders];

    // Resolve tie with kickers

    // Compare kickers of the remaining players to findCombinations.find the winner
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
      players[playerIdx].winningCombination =
        findCombinations.findPairAndKickers(players[playerIdx], cc);
    }

    return finalWinners;
  },
  checkTwoPairTie(indices, players) {
    // Function to extract pair values and kicker from a player's hand
    const getHandComponents = (player) => {
      const pairs = player.hasTwoPair.twoPairMade.map((card) => card[0]);

      return {
        highestPair: Math.max(
          cardSuitRanking.cardRanking[pairs[0]],
          cardSuitRanking.cardRanking[pairs[2]]
        ),
        secondPair: Math.min(
          cardSuitRanking.cardRanking[pairs[0]],
          cardSuitRanking.cardRanking[pairs[2]]
        ),
        kicker: cardSuitRanking.cardRanking[player.hasTwoPair.kicker[0]]
      };
    };

    // Compare players based on the poker hand ranking rules
    let winners = [];
    let bestHand = { highestPair: -1, secondPair: -1, kicker: -1 };

    indices.forEach((index) => {
      const player = players[index];
      const handComponents = getHandComponents(player);

      const isBetterHand = (hand1, hand2) => {
        if (hand1.highestPair > hand2.highestPair) return true;
        if (
          hand1.highestPair === hand2.highestPair &&
          hand1.secondPair > hand2.secondPair
        )
          return true;
        if (
          hand1.highestPair === hand2.highestPair &&
          hand1.secondPair === hand2.secondPair &&
          hand1.kicker > hand2.kicker
        )
          return true;
        return false;
      };

      if (isBetterHand(handComponents, bestHand)) {
        winners = [index];
        bestHand = handComponents;
      } else if (
        handComponents.highestPair === bestHand.highestPair &&
        handComponents.secondPair === bestHand.secondPair &&
        handComponents.kicker === bestHand.kicker
      ) {
        winners.push(index);
      }
    });

    winners.forEach((index) => {
      players[index].winningCombination =
        findCombinations.findTwoPairWinningCombination(players[index]);
    });

    return winners;
  },
  checkThreeOfaKindTie(indices, players, cc) {
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

    winners.forEach((index) => {
      players[index].winningCombination =
        findCombinations.findThreeWinningCombination(players[index]);
    });

    return winners; // Return the index or indices of the winner(s)
  },
  checkStraightTie(indices, players, cc) {
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

    winners.forEach((index) => {
      players[index].winningCombination =
        findCombinations.findWinningStraightCombination(players[index], cc);
    });

    return winners;
  },
  checkFlushTie(indices, players, cc) {
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
      players[winners[0]].winningCombination =
        findCombinations.findWinningFlushCombination(players[winners[0]], cc);
    } else {
      return this.compareFlushHighCardTieBreaker(winners, players, cc);
    }

    return winners;
  },
  checkFullHouseTie(indices, players, cc) {
    let highestFull = -1;
    let highestKicker = -1;
    let winners = [];

    // Iterate through each player and compare their full house
    indices.forEach((index) => {
      const player = players[index];
      const fullRank = cardSuitRanking.cardRanking[player.hasFullHouse.full];
      const kickerRank =
        cardSuitRanking.cardRanking[player.hasFullHouse.kicker];

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
        (players[index].winningCombination =
          findCombinations.findWinningFullHouse(players[index]))
    );
    return winners;
  },
  checkFourOfaKindTie(indices, players, cc) {
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
        (players[index].winningCombination =
          findCombinations.findFourWithKicker(players[index], cc))
    );
    return winners; // Return the index or indices of the player(s) with the highest Four of a Kind
  },
  checkStraightFlushTie(indices, players, cc) {
    const contenders = [];
    const winners = [];
    indices.forEach((index) => {
      contenders.push(
        cardSuitRanking.cardRanking[
          players[index].hasStraightFlush.highestCard[0]
        ]
      );
    });
    const maxValue = Math.max(...contenders);
    contenders.forEach((straighValue, idx) => {
      if (straighValue == maxValue) {
        winners.push(idx);
      }
    });

    winners.forEach((index) => {
      players[index].winningCombination =
        findCombinations.findStraightFlushCombination(players[index]);
    });

    return winners;
  },
  compareFlushHighCardTieBreaker(indices, players, cc) {
    // Iterate over the kickers, starting from the second highest card (index 1)
    for (let kickerIdx = 1; kickerIdx < 5; kickerIdx++) {
      let highestKickerValue = -1;
      let winningIndices = [];

      indices.forEach((index) => {
        const player = players[index];
        const kickerValue =
          cardSuitRanking.cardRanking[player.hasFlush.madeFlush[kickerIdx][0]]; // Extract the rank from the card string

        if (kickerValue > highestKickerValue) {
          highestKickerValue = kickerValue;
          winningIndices = [index]; // This player has the highest kicker so far
        } else if (kickerValue === highestKickerValue) {
          winningIndices.push(index); // Tie for the highest kicker so far
        }
      });

      // Determine the winner based on the current kicker comparison
      if (winningIndices.length === 1 || kickerIdx === 4) {
        winningIndices.forEach((index) => {
          players[index].winningCombination =
            findCombinations.findWinningFlushCombination(players[index], cc);
        });
        return winningIndices; // Return the winner(s) based on this kicker
      }
      // If the kickers are equal, continue to the next kicker
    }

    // If all kickers are equal after comparing all, it's a complete tie
    return indices;
  }
};
module.exports = { tieBreakers };
