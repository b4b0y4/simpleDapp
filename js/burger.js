document.addEventListener("DOMContentLoaded", function () {
  const burgerMenu = document.querySelector(".burger-menu")
  const panel = document.getElementById("panel")
  const overlay = document.getElementById("overlay")

  burgerMenu.addEventListener("click", function () {
    burgerMenu.classList.toggle("close")
    panel.classList.toggle("open")
    overlay.style.display = panel.classList.contains("open") ? "block" : "none"
  })

  overlay.addEventListener("click", function () {
    panel.classList.remove("open")
    overlay.style.display = "none"
    burgerMenu.classList.toggle("close")
  })
})
