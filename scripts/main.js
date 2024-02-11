// Import statements
import { ethers } from "./ethers-5.6.esm.min.js"
import { networkConfigs, abi, contractAddress } from "./constants.js"

// Get references to the HTML elements
const connectButton = document.getElementById("connectButton")
const actionButton = document.getElementById("actionButton")

// Default network
const currentNetwork = networkConfigs.sepolia

connectButton.onclick = connect
actionButton.onclick = action

// Retrieve the connected account from local storage
const connectedAccount = localStorage.getItem("connectedAccount")

// Connection and Account Handling
async function connect() {
  // Store the initial text content of the connect button
  const initialConnectText = connectButton.innerHTML

  // Check if MetaMask (or similar) is installed
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request user permission to connect their wallet
      await window.ethereum.request({ method: "eth_requestAccounts" })
      
      // Create a provider using the MetaMask provider
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      // Check if the connected network is Sepolia
      const network = await provider.getNetwork()
      if (network.chainId !== currentNetwork.chainId) {
        // Disable interaction with the app and prompt user to switch network
        disableAppInteraction()
        return
      }
      
      // Update the displayed address and handle account changes
      await updateDisplayedAddress(provider)
      window.ethereum.on("accountsChanged", async (accounts) => {
        await handleAccountsChanged(accounts, provider)
      })
    } catch (error) {
      console.log(error)
    }
  } else {
    // If MetaMask is not installed, prompt user to get a wallet
    connectButton.innerHTML = "Get a wallet"
    
    // Restore the initial text content of the connect button after a delay
    setTimeout(() => {
      connectButton.innerHTML = initialConnectText
    }, 2000)
  }
}

async function handleAccountsChanged(accounts, provider) {
  // Extract the first account from the list of changed accounts
  const account = accounts.length > 0 ? accounts[0] : null
  
  // Update the connect button with the new account address or "Connect" if no account is connected
  connectButton.innerHTML = account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect"

  if (account) {
    // Update ENS name if available and store connected account in local storage
    updateENSNameIfAvailable(account, provider)
    localStorage.setItem("connectedAccount", account)
  } else {
    // Remove connected account from local storage if no account is connected
    localStorage.removeItem("connectedAccount")
  }
}

async function updateDisplayedAddress(provider) {
  // Retrieve the list of Ethereum accounts from MetaMask
  const accounts = await window.ethereum.request({ method: "eth_accounts" })
  
  // Extract the first account from the list
  const account = accounts.length > 0 ? accounts[0] : null

  // Update the connect button with the account address or "Connect" if no account is connected
  connectButton.innerHTML = account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect"
  
  if (account) {
    // Update ENS name if available
    updateENSNameIfAvailable(account, provider)
  }
}

async function updateENSNameIfAvailable(account, provider) {
  try {
    // Create a provider specifically for Ethereum mainnet ENS resolution
    const mainnetProvider = new ethers.providers.JsonRpcProvider(networkConfigs.ethereum.rpcUrl)
    
    // Attempt ENS resolution using the mainnet provider
    const ensName = await mainnetProvider.lookupAddress(account)
    
    // If ENS name is available, update the connect button with the ENS name
    if (ensName) {
      connectButton.innerHTML = ensName
    }
  } catch (error) {
    console.log("Error getting ENS name:", error)
  }
}

// Interaction Enablement/Disabling
function enableAppInteraction(provider) {
  connectButton.disabled = false
  actionButton.disabled = false
  connectButton.innerHTML = "Connected"
  updateDisplayedAddress(provider)
}

function disableAppInteraction() {
  connectButton.disabled = true
  actionButton.disabled = true
  connectButton.innerHTML = `Switch to ${currentNetwork.name}`
}

async function handleChainChanged(chainId) {
  // Convert the chainId from hexadecimal to numeric
  const numericChainId = parseInt(chainId, 16)

  // Get the current network details based on the numeric chainId
  const network = Object.values(networkConfigs).find(net => net.chainId === numericChainId)

  // If the current network matches the desired network configuration, enable app interaction
  if (network && network.chainId === currentNetwork.chainId) {
    enableAppInteraction()
  } else {
    // If the current network does not match the desired network configuration, disable app interaction
    disableAppInteraction()
  }
}

// Action Execution
async function action() {
  // Store the initial text content of the action button
  const initialActionText = actionButton.innerHTML
  actionButton.innerHTML = "Actioning..."

  if (typeof window.ethereum !== "undefined") {
    // Create a provider using the MetaMask provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      // Request accounts and perform the action
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const transactionResponse = await contract.mintNft()
      await listenForTransactionMine(transactionResponse, provider)

      // Update action button text content upon success
      actionButton.innerHTML = "Actionned"
    } catch (error) {
      // Handle errors and update action button text content
      console.log(error)
      actionButton.innerHTML = "Action failed"
    }
  } else {
    // Update action button text content if no wallet is available
    actionButton.innerHTML = "Get a wallet"
  }

  // Restore the initial text content of the action button after a delay
  setTimeout(() => {
    actionButton.innerHTML = initialActionText
  }, 2000)
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      )
      resolve()
    })
  })
}

// Initialization and Event Listeners Setup
window.addEventListener('load', async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Create a provider using the MetaMask provider
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      
      // Update the displayed address on page load
      await updateDisplayedAddress(provider)
      
      // Listen for account changes
      window.ethereum.on("accountsChanged", async (accounts) => {
        await handleAccountsChanged(accounts, provider)
      })
    } catch (error) {
      console.log(error)
    }
  }
})

window.ethereum.on("chainChanged", handleChainChanged)

// MetaMask Availability Check
// On page load, immediately check for a connected account in local storage
if (connectedAccount) {
  connectButton.innerHTML = `${connectedAccount.substring(0, 6)}...${connectedAccount.substring(38)}`
}