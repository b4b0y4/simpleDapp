# simpleDapp
A simple dapp front end template for interacting with simple smart contract.

## Features

- Connects and provides a simple interface to any EVM smart contract using its address and ABI (Application Binary Interface).

## Usage

1. Clone this repository to your local machine:

2. Open the project directory and navigate to the `constants.js` file in the scripts folder.

3. Update the following constants with your desired smart contract details:

- `contractAddress`: address of the smart contract you want to interact with.
- `abi`: ABI (Application Binary Interface) of the smart contract. You can obtain this from the contract's source code or through Remix IDE.

4. Navigate to the `script.js` file in the scripts folder and modify/add functions according to the smart contract's interface.

5. Modify the HTML and CSS files to your needs.

6. You should now be able to interact with the smart contract through the UI.

## Notes

- Always verify the contract address and ABI to ensure you're interacting with the correct smart contract.
- This is a simple demonstration app and may require additional security measures before deploying to production.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
