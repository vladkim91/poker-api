# Card Game Winner Calculator

This project is a GraphQL-based API designed to simulate a card game, calculate hand strengths, and determine the winner based on poker rules. The application handles card ranking, combination evaluation, and tie-breaker scenarios using functions and custom resolvers.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Folder Structure](#folder-structure)
6. [Scripts](#scripts)
7. [License](#license)

---

## Overview

This project simulates a poker card game, evaluates hand combinations (pairs, straights, flushes, etc.), and calculates the winner. It is implemented using `ApolloServer` for GraphQL, and it provides two main mutations:

- `calcWinner` - Determines the winner of the game based on hand inputs.
- `postMessage` - Posts messages to the system.

### Tech Stack

- **Node.js**
- **Apollo Server (GraphQL)**
- **JavaScript**

---

## Features

- **GraphQL API**: Players and messages can be queried and managed via GraphQL queries and mutations.
- **Hand Strength Calculation**: Evaluate poker hands for multiple players and determine the winner.
- **Tie-Breaker Functionality**: Handles various tie-breaking scenarios (pairs, two pairs, straights, flushes, etc.).
- **Card Conversion & Validation**: Converts string-based cards to numerical values and checks for valid cards.

---

## Installation

### Prerequisites

Make sure you have Node.js installed.

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo-url
   ```

2. Navigate to the project directory:

   ```bash
   cd card-game-winner-calculator
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

---

## Usage

To start the project in development mode using Nodemon:

```bash
npm run dev
```

Or to start it directly:

```bash
npm start
```

### GraphQL Playground

Once the server is running, visit [http://localhost:4000/graphql](http://localhost:4000/graphql) to access the GraphQL Playground, where you can execute queries and mutations.

---

## Folder Structure

```bash
.
├── .vscode/
├── resolvers/
│   ├── functions/
│   │   ├── tieBreakerFunctions/
│   │   │   ├── findCombinations.js
│   │   │   └── tieBreakerFunctions.js
│   │   ├── compareHandStrength.js
│   │   └── functions.js
│   ├── Mutation.js
│   └── Query.js
├── testingResources/
├── .DS_Store
├── .gitignore
├── db.js
├── index.js
├── package-lock.json
├── package.json
├── schema.js
└── README.md
```

---

## Scripts

- `npm start`: Start the server.
- `npm run dev`: Start the server in development mode with Nodemon.

---

## License

This project is licensed under the ISC License.
