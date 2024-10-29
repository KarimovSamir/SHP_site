document.addEventListener("DOMContentLoaded", function () {
    const frame = document.querySelector('.mil-frame');
    let invertFix = document.querySelector('.mi-invert-fix');
    let bannerSection = document.querySelector('.mil-banner');

    function checkPageClass() {
        if (bannerSection && bannerSection.classList.contains('mil-mainpage-class') && window.innerWidth > 1200) {
            frame.classList.add('mil-frame-visible');
        } else {
            frame.classList.remove('mil-frame-visible');
        }
    }

    function checkVideoVisibility() {
        invertFix = document.querySelector('.mi-invert-fix');
        if (window.innerWidth > 1200 && invertFix) {
            const rect = invertFix.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                frame.style.zIndex = '999';
                checkPageClass();
            } else {
                frame.style.zIndex = '2';
                frame.classList.remove('mil-frame-visible');
            }
        } else {
            frame.style.zIndex = '999';
            checkPageClass();
        }
    }

    function init() {
        frame.classList.remove('mil-frame-visible');
        bannerSection = document.querySelector('.mil-banner');
        checkVideoVisibility();

        document.removeEventListener("scroll", checkVideoVisibility);
        window.removeEventListener("resize", checkVideoVisibility);

        document.addEventListener("scroll", checkVideoVisibility);
        window.addEventListener("resize", checkVideoVisibility);

        initSlideshow();
    }

    function initSlideshow() {
        const slideshowImages = [
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1726902785/BilgahBeachHotel_hcx6oi.png',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1726902784/AzureBusinessCenter_er3fnx.png',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1726902789/GanjlikMall_qkp6hk.png',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1726902783/vasilchuki-chaihona-1_wzvqfx.png',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1726902786/BravoHypermarkets_e6crau.png'
        ];

        const slideshowLinks = [
            'portfolio.html', 
            'portfolio.html', 
            'portfolio.html', 
            'portfolio.html', 
            'portfolio.html'
        ];

        let currentImageIndex = 0;
        const slideshowImageElement = document.getElementById('slideshow-image');
        const slideshowLinkElement = document.getElementById('slideshow-link');

        if (window.slideshowInterval) {
            clearInterval(window.slideshowInterval);
        }

        function showSlide(index) {
            currentImageIndex = (index + slideshowImages.length) % slideshowImages.length;
            slideshowImageElement.src = slideshowImages[currentImageIndex];
            slideshowLinkElement.href = slideshowLinks[currentImageIndex];
        }

        function startSlideshow() {
            window.slideshowInterval = setInterval(function () {
                showSlide(currentImageIndex + 1);
            }, 3000);
        }

        document.getElementById("nextSlide").addEventListener("click", function() {
            clearInterval(window.slideshowInterval);
            showSlide(currentImageIndex + 1);
            startSlideshow();
        });

        document.getElementById("prevSlide").addEventListener("click", function() {
            clearInterval(window.slideshowInterval);
            showSlide(currentImageIndex - 1);
            startSlideshow();
        });

        startSlideshow();
    }

    init();

    document.addEventListener("swup:contentReplaced", function() {
        init();
    });

    document.addEventListener("swup:animationInDone", function() {
        init();
    });
});
