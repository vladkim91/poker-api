const { gql } = require('apollo-server');
exports.typeDefs = gql`
  type Query {
    players: [Player!]!
  }
  type Mutation {
    calcWinner(input: PlayerInput!): [Response!]
  }

  type Response {
    id: ID!
    winners: [Player!]
    players: [Player!]
  }

  type ResponseArray {
    games: [Response]
  }

  type Player {
    id: ID!
    hand: [String!]!
    handStrength: Int!
    winningComboValues: [Int!]
    winningCombination: [String]
    hasPair: PairCombination!
    hasTwoPair: TwoPairCombination!
    hasThreeOfaKind: ThreeOfaKindCombination!
    hasStraight: StraighCombination!
    hasFlush: FlushCombination!
    hasFullHouse: FullHouseCombination!
    hasFourOfaKind: FourOfaKindCombination!
    # hasStraightFlush: Combination!
    hasRoyalFlush: Boolean!
  }

  input PlayerInput {
    playerInput: [String!]
  }
  type PairCombination {
    made: Boolean!
    kickers: [String!]
    highestCard: String
  }

  type TwoPairCombination {
    made: Boolean!
    kicker: String
    twoPairMade: [String]
  }

  type ThreeOfaKindCombination {
    made: Boolean!
    highestCard: String
    firstKicker: String
    secondKicker: String
    madeThree: [String]
  }
  type StraighCombination {
    made: Boolean!
    highestCard: String
  }
  type FlushCombination {
    made: Boolean!
    highestCard: String
    madeFlush: [String!]
    typeOfFlush: String
  }

  type FullHouseCombination {
    made: Boolean!
    full: String
    kicker: String
    three: [String!]
    pair: [String!]
    fullHouse: [String!]
  }

  type FourOfaKindCombination {
    made: Boolean!
    fourMade: [String]!
    highestCard: String
    kicker: String
  }
  type Error {
    type: String!
  }
  # type Product {
  #     id: ID!
  #     name: String!
  #     description: String!
  #     quantity: Int!
  #     price: Float!
  #     image: String!
  #     onSale: Boolean!
  #     category: Category
  #     reviews: [Review!]!
  # }

  # type Category {
  #     id: ID!
  #     name: String!
  #     products(filter:InputProductFilter): [Product]!
  # }

  # type Review {
  #     id: ID!
  #     date: String!
  #     title: String!
  #     comment: String!
  #     rating: Int!
  #     productId: String!
  # }

  # input InputProductFilter {
  #     onSale: Boolean
  #     averageRating: Int
  # }

  # input addCategoryInput {
  #     name: String!
  # }
  # input updateCategoryInput {
  #     name: String!
  # }

  # input addProductInput {
  #     name: String!
  #     description: String!
  #     quantity: Int!
  #     price: Float!
  #     image: String!
  #     onSale: Boolean!
  #     categoryId: ID!

  # }
  # input updateProductInput {
  #     name: String!
  #     description: String!
  #     quantity: Int!
  #     price: Float!
  #     image: String!
  #     onSale: Boolean!

  # }

  # input addReviewInput {
  #     date: String!
  #     title: String!
  #     comment: String!
  #     rating: Int!
  #     productId: ID!
  # }
  # input updateReviewInput {
  #     date: String!
  #     title: String!
  #     comment: String!
  #     rating: Int!
  #     productId: ID!
  # }
`;
