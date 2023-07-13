# Rock, Paper, Scissors, Spock, and Lizard Web3 Game

<!-- ![Game](game-screenshot.png) -->

This is a web-based implementation of the popular game "Rock, Paper, Scissors" extended with two additional choices: "Spock" and "Lizard". The game allows players to compete against each other using Web3 technology.

## Getting Started

To get started with the game, follow these steps:

1. Install the necessary dependencies:
   `pnpm install`

2. Configure your Ethereum provider:

- Make sure you have an Ethereum provider (e.g., MetaMask) installed and configured in your browser.
- Connect your Ethereum provider to the desired network (e.g., Ropsten, Rinkeby, or a local development network).

3. Start the local development server:
   `pnpm dev`

4. Open the game in your browser:
   `https://localhost:3000`

## How to Play

1. Connect your Ethereum wallet to the game by clicking the "Connect Wallet" button.
2. Specify your choice of "Rock", "Paper", "Scissors", "Spock", or "Lizard".
3. Once both players have made their choices, the game will determine the winner based on the rules of "Rock, Paper, Scissors, Spock, and Lizard".
4. The winner will be awarded points, and the game will continue with the next round.

## Technologies Used

- NextJS, shadcnui, and tailwindcss for the front-end interface
- wagmi.sh, viem, and rainbowkit for interacting with Ethereum and the player's wallet
- Solidity for the smart contract implementation
- Hardhat for smart contract compilation, test, and deployment

## Game Rules

The game rules are an extension of the traditional "Rock, Paper, Scissors" game:

- Rock crushes Scissors and Lizard.
- Paper covers Rock and disproves Spock.
- Scissors cuts Paper and decapitates Lizard.
- Spock smashes Scissors and vaporizes Rock.
- Lizard eats Paper and poisons Spock.

## Contribution

Contributions to the game are welcome! If you find any issues or have ideas for improvements, feel free to open an issue or submit a pull request.

## License

This game is open source and available under the [MIT License](LICENSE).
