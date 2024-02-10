import { ethers } from "./constants/ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants/constants.js"

const connectButton = document.getElementById("connectButton")
const actionButton = document.getElementById("actionButton")

connectButton.onclick = connect
actionButton.onclick = action

// Function to connect wallet
async function connect() {
  // Store the initial text content of the connect button
  const initialConnectText = connectButton.innerHTML
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await updateDisplayedAddress(provider);
      window.ethereum.on("accountsChanged", async (accounts) => {
        await handleAccountsChanged(accounts, provider)
      });
    } catch (error) {
      console.log(error)
    }
  } else {
    connectButton.innerHTML = "Get a wallet "

    // Restore the initial text content of the connect button after a delay (e.g., 2 seconds)
    setTimeout(() => {
      connectButton.innerHTML = initialConnectText;
    }, 2000)
  }
}

// Function to update displayed account address
async function updateDisplayedAddress(provider) {
  const accounts = await window.ethereum.request({ method: "eth_accounts" })
  const account = accounts.length > 0 ? accounts[0] : null;
  connectButton.innerHTML = account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect"
  
  if (account) {
    updateENSNameIfAvailable(account, provider)
  }
}

// Function to handle account changes
async function handleAccountsChanged(accounts, provider) {
  const account = accounts.length > 0 ? accounts[0] : null
  connectButton.innerHTML = account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect"

  if (account) {
    updateENSNameIfAvailable(account, provider)
  }
}

// Function to update ENS name if available
async function updateENSNameIfAvailable(account, provider) {
  try {
    // Create a provider specifically for Ethereum mainnet ENS resolution
    const mainnetProvider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com")
    
    // Attempt ENS resolution using the mainnet provider
    const ensName = await mainnetProvider.lookupAddress(account)
    if (ensName) {
      connectButton.innerHTML = ensName
    }
  } catch (error) {
    console.log("Error getting ENS name:", error)
  }
}

// Function to do something
async function action() {
  // Store the initial text content of the action button
  const initialActionText = actionButton.innerHTML

  // Update action button text content
  actionButton.innerHTML = "Actioning..."

  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      // Request accounts and perform the action
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const transactionResponse = await contract.action()
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

  // Restore the initial text content of the action button after a delay (e.g., 2 seconds)
  setTimeout(() => {
    actionButton.innerHTML = initialActionText
  }, 2000);
}

// function to wait for block mined
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

// function to calculate the current theme setting.
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme
  }

  if (systemSettingDark.matches) {
    return "dark"
  }

  return "light"
}

// function to update the theme setting on the html tag
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme)
}

// function to update the logo image source
function updateLogo({ logoEl, isDark }) {
  const newLogoSrc = isDark ? "./images/logo-dark.png" : "./images/logo-light.png"
  logoEl.setAttribute("src", newLogoSrc)
}

// function to update the image source
function updateImage({ imgEl, isDark }) {
  const newImgSrc = isDark ? "./images/img-dark.png" : "./images/img-light.png"
  imgEl.setAttribute("src", newImgSrc)
}

//On page load:

// 1. Grab what we need from the DOM and system settings on page load

const button = document.querySelector("[data-theme-toggle]")
const logo = document.querySelector(".logo")
const image = document.querySelector(".image")
const localStorageTheme = localStorage.getItem("theme")
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)")

// 2. Work out the current site settings
let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark })

// 3. Update the theme setting logo and image according to current settings
updateThemeOnHtmlEl({ theme: currentThemeSetting })
updateLogo({ logoEl: logo, isDark: currentThemeSetting === "dark" })
updateImage({ imgEl: image, isDark: currentThemeSetting === "dark" })

// 4. Add an event listener to toggle the theme, logo and image
button.addEventListener("click", (event) => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark"

  localStorage.setItem("theme", newTheme)
  updateThemeOnHtmlEl({ theme: newTheme })
  updateLogo({ logoEl: logo, isDark: newTheme === "dark" })
  updateImage({ imgEl: image, isDark: newTheme === "dark" })

  currentThemeSetting = newTheme
})