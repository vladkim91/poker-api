const { gql } = require('apollo-server');
exports.typeDefs = gql`
  type Query {
    players: [Player!]!
  }
  type Mutation {
    calcWinner(input: PlayerInput!): Response!
  }

  type Response {
    id: ID!
    winners: [Player!]!
    players: [Player!]!
  }

  type Player {
    id: ID!
    hand: [String!]!
    handStrength: Int!
    winningCombination: [String!]!
    hasPair: Combination!
    hasTwoPair: Combination!
    hasThreeOfaKind: Combination!
    hasStraight: Combination!
    hasFlush: Combination!
    hasFullHouse: Combination!
    hasFourOfaKind: Combination!
    hasStraightFlush: Combination!
    hasRoyalFlush: Boolean!
    typeOfFlush: String!
  }

  input PlayerInput {
    players: String!
  }
  type Combination {
    made: Boolean!
    highestCard: String
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
