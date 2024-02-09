# simpleDapp
A simple dapp front end template for interacting with simple smart contract.

## Features

- Connects to any Ethereum smart contract using its address and ABI (Application Binary Interface).
- Provides a simple interface for interacting with the blockchain.

## Usage

1. Clone this repository to your local machine:

2. Open the project directory and navigate to the `constants.js` file.

3. Update the following constants with your desired smart contract details:

- `contractAddress`: address of the smart contract you want to interact with.
- `abi`: ABI (Application Binary Interface) of the smart contract. You can obtain this from the contract's source code or through Remix IDE.

4. Navigate to the `script.js` file and modify/add functions according to the smart contract's interface.

5. Modify the HTML and CSS files to your needs.

6. You should now be able to interact with the smart contract through the UI.

## Notes

- Ensure you have a compatible web3 provider (e.g., MetaMask) installed and configured in your browser to interact with Ethereum.
- Always verify the contract address and ABI to ensure you're interacting with the correct smart contract.
- This is a simple demonstration app and may require additional security measures before deploying to production.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
