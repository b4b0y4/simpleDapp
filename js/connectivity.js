import { ethers } from "./ethers-5.6.esm.min.js"
import { networkConfigs } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const modal = document.getElementById('warningModal')
const modalButton = document.getElementById('modalButton')
const currentNetwork = networkConfigs.sepolia

connectButton.onclick = connect
modalButton.onclick = switchNetwork

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
            await checkNetwork()
            const accounts = await ethereum.request({ method: "eth_accounts" })
            if (accounts.length > 0) {
                const address = accounts[0]
                displayTruncatedAddress(address)
                displayENSName(address)
                console.log(accounts)
            } else {
                connectButton.innerHTML = "Connect"
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        connectButton.innerHTML = "Get a wallet"
        setTimeout(() => {
            connectButton.innerHTML = "Get a wallet"
          }, 3000)
    }
}

function displayTruncatedAddress(address) {
    if (!address) return
    const truncatedAddress = address.substring(0, 6) + "..." + address.substring(address.length - 4);
    connectButton.innerHTML = truncatedAddress
}

async function displayENSName(account) {
    try {
      const mainnetProvider = new ethers.providers.JsonRpcProvider(networkConfigs.ethereum.rpcUrl)
      
      const ensName = await mainnetProvider.lookupAddress(account)
      
      if (ensName) {
        connectButton.innerHTML = ensName
      }
    } catch (error) {
      console.log("Error getting ENS name:", error)
    }
  }

async function checkNetwork() {
    const chainId = await ethereum.request({ method: 'eth_chainId' })
    if (chainId !== "0x" + currentNetwork.chainId.toString(16)) {
        showModal()
    } else {
        modal.style.display = 'none'
    }
}

function showModal() {
    modal.style.display = 'block'
}

async function switchNetwork() {
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: "0x" + currentNetwork.chainId.toString(16) }]
        })
    } catch (error) {
        console.error("Error switching network:", error)
    }
}

// Event listener for changes in wallet accounts
ethereum.on("accountsChanged", async function(accounts) {
    if (accounts.length > 0) {
        const address = accounts[0]
        displayTruncatedAddress(address)
        displayENSName(address)
    } else {
        connectButton.innerHTML = "Connect"
    }
})
// Event listener for changes in wallet network
ethereum.on("chainChanged", async function(chainId) {
    if (chainId !== "0x" + currentNetwork.chainId.toString(16)) {
        showModal()
    } else {
        modal.style.display = 'none'
    }
})

// Initial call to connect function
connect()