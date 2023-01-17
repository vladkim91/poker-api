exports.Query = {
  players: (parent, args, { db }) => {
    return db.players;
  }
};
