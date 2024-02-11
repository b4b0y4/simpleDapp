// Function to calculate the current theme setting based on user preferences
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
    if (localStorageTheme !== null) {
      return localStorageTheme; // Use the stored theme if available
    }
    if (systemSettingDark.matches) {
      return "dark" // Use dark theme if user prefers dark mode
    }
    return "light" // Default to light theme
  }
  
  // Function to update the theme setting on the HTML tag
  function updateThemeOnHtmlEl({ theme }) {
    document.querySelector("html").setAttribute("data-theme", theme)
  }
  
  // Function to update the logo image source based on the theme
  function updateLogo({ logoEl, isDark }) {
    const newLogoSrc = isDark ? "./images/logo-dark.png" : "./images/logo-light.png"
    logoEl.setAttribute("src", newLogoSrc)
  }
  
  // Function to update the image source based on the theme
  function updateImage({ imgEl, isDark }) {
    const newImgSrc = isDark ? "./images/img-dark.png" : "./images/img-light.png"
    imgEl.setAttribute("src", newImgSrc)
  }
  
  // On page load:
  const button = document.querySelector("[data-theme-toggle]")
  const logo = document.querySelector(".logo")
  const image = document.querySelector(".image")
  const localStorageTheme = localStorage.getItem("theme")
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)")
  
  let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark })
  
  // Set initial theme, logo, and image based on user preferences
  updateThemeOnHtmlEl({ theme: currentThemeSetting })
  updateLogo({ logoEl: logo, isDark: currentThemeSetting === "dark" })
  updateImage({ imgEl: image, isDark: currentThemeSetting === "dark" })
  
  // Event listener to toggle the theme, logo, and image
  button.addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark"
  
    // Update theme setting in local storage
    localStorage.setItem("theme", newTheme)
    // Update theme, logo, and image based on new theme
    updateThemeOnHtmlEl({ theme: newTheme })
    updateLogo({ logoEl: logo, isDark: newTheme === "dark" })
    updateImage({ imgEl: image, isDark: newTheme === "dark" })
  
    // Update current theme setting
    currentThemeSetting = newTheme
  })
  