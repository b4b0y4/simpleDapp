import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const mintButton = document.getElementById("mintButton")

mintButton.onclick = mint

async function mint() {
  const initialText = mintButton.innerHTML

  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      // Request accounts and perform the action
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const transactionResponse = await contract.mintNft() // change function name
      mintButton.innerHTML = "Minting..."

      await listenForTransactionMine(transactionResponse, provider)
      mintButton.innerHTML = "Minted!"
    } catch (error) {
      // Handle errors and update action button text content
      console.log(error)
      mintButton.innerHTML = "Transaction failed"
    }
  } else {
    mintButton.innerHTML = "Install a Wallet"
  }
  setTimeout(() => {
    mintButton.innerHTML = initialText
  }, 3000)
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
