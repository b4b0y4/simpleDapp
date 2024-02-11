document.addEventListener('DOMContentLoaded', function () {
    const burgerMenuButton = document.querySelector('.burger-menu-button') // Selects the burger menu button element
    const linksContainer = document.querySelector('.links-container') // Selects the links container element
    const closeButton = document.querySelector('.close-button') // Selects the close button element

    // Event listener for burger menu button click
    burgerMenuButton.addEventListener('click', function () {
        linksContainer.classList.toggle('active') // Toggles the 'active' class on the links container
    })

    // Event listener for close button click
    closeButton.addEventListener('click', function () {
        linksContainer.classList.remove('active'); // Removes the 'active' class from the links container
    })

    // Event listener for window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 600) {
            linksContainer.classList.remove('active') // Removes the 'active' class from the links container if window width is greater than 600px
        }
    })
})
