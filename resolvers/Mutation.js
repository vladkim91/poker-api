const {
  checkIfValid,
  cardConversions,
  assignCombinationsToPlayers
} = require('./functions/functions.js');

const { compareHandStrength } = require('./functions/compareHandStrength.js');

exports.Mutation = {
  calcWinner: (parent, { input }, context) => {
    // Check if the input string is valid
    if (!checkIfValid(input.playerInput)) {
      throw new Error('Invalid Cards');
    }

    // Split the input string into players and community cards
    const [players, communityCards] = cardConversions.splitTheString(
      input.playerInput.split('/')
    );

    // Assign combinations to players using community cards
    assignCombinationsToPlayers(players, ...communityCards);

    // Function to determine the winner
    const checkWinner = () => {
      const winnerIdx = compareHandStrength(players, ...communityCards);
      if (Array.isArray(winnerIdx)) {
        // Handle case where multiple winners are present
        return winnerIdx.map((idx) => players[idx]);
      } else if (typeof winnerIdx === 'number') {
        // Handle case with a single winner
        return [players[winnerIdx]];
      }
      return [];
    };

    // Generate a unique ID for the play
    function createPlayId(length) {
      let result = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }

    // Return the result data
    return [
      {
        winners: checkWinner(),
        players: players,
        id: createPlayId(20)
      }
    ];
  }
};
