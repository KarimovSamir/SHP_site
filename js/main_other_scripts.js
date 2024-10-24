document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('.mil-main-menu a');
    const menuButton = document.querySelector('.mil-menu-btn');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            if (link.getAttribute('href').startsWith('#')) {
                closeMenu();
            }
        });
    });

    function closeMenu() {
        if (menuButton.classList.contains('mil-active')) {
            menuButton.click();
        }
    }
});