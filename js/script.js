import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const actionButton = document.getElementById("actionButton")

actionButton.onclick = action

async function action() {

  const initialActionText = actionButton.innerHTML
  actionButton.innerHTML = "Actioning..."

  if (typeof window.ethereum !== "undefined") {
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
    actionButton.innerHTML = "Get a wallet"
  }

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