let swup;

let autoSlideInterval;

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

$(function () {
    "use strict";

    /***************************

    swup

    ***************************/
    const options = {
        containers: ['#swupMain', '#swupMenu'],
        animateHistoryBrowsing: false,
        // linkSelector: 'a:not([data-no-swup]):not([href^="#"])',
        linkSelector: 'a:not([data-no-swup]):not([href*="#"])',
        animationSelector: '[class*="mil-main-transition"]',
        hooks: {
            'page:view': () => {
                // console.log('Контент обновлён. Выполняем повторную инициализацию...');
                initializeDynamicElements();
                scrollToHashIfExists(); 
            },
        }
    };
    swup = new Swup(options);

    const accent = "rgba(41, 178, 74, 1)"; // Определение переменной accent

    function initializeDynamicElements() {
        initializePreloader();
        initializeAnchorScroll();
        initializeAppend();
        initializeAccordion();
        initializeMenu();
        initializeCursor();
        initializeAnimations();
        initializeFancybox();
        initializeSliders();
        initializeScripts();
        initializePortfolioSingle();
        initializeTabs();
    }

    function initializePreloader() {
        var timeline = gsap.timeline();
        timeline.to(".mil-preloader-animation", { opacity: 1 });
        timeline.fromTo(
            ".mil-animation-1 .mil-h3", { y: "30px", opacity: 0 }, { y: "0px", opacity: 1, stagger: 0.4 }
        );
        timeline.to(".mil-animation-1 .mil-h3", { opacity: 0, y: '-30' }, "+=.3");
        timeline.fromTo(".mil-reveal-box", 0.1, { opacity: 0 }, { opacity: 1, x: '-30' });
        timeline.to(".mil-reveal-box", 0.45, { width: "100%", x: 0 }, "+=.1");
        timeline.to(".mil-reveal-box", { right: "0" });
        timeline.to(".mil-reveal-box", 0.3, { width: "0%" });
        timeline.fromTo(".mil-animation-2 .mil-h3", { opacity: 0 }, { opacity: 1 }, "-=.5");
        timeline.to(".mil-animation-2 .mil-h3", 0.6, { opacity: 0, y: '-30' }, "+=.5");
        timeline.to(".mil-preloader", 0.8, { opacity: 0, ease: 'sine' }, "+=.2");
        timeline.fromTo(".mil-up", 0.8, { opacity: 0, y: 40, scale: .98, ease: 'sine' }, {
            y: 0, opacity: 1, scale: 1,
            onComplete: function () {
                $('.mil-preloader').addClass("mil-hidden");
            },
        }, "-=1");
    }

    function scrollToHashIfExists() {
        const hash = window.location.hash; // например "#services"
        if (!hash) return; // нет хэша — ничего не делаем
      
        // Ищем элемент на странице
        const target = document.querySelector(hash);
        if (!target) return; // элемента с таким id нет — выходим
      
        // Считаем отступ в зависимости от ширины экрана
        const offset = getScrollOffset();
        // Позиция элемента
        const elementY = target.getBoundingClientRect().top + window.scrollY - offset;
      
        // Можно «мгновенно» проскроллить:
        window.scrollTo({ top: elementY, behavior: 'auto' });
      
        // Если хотите плавно: behavior: 'smooth', но иногда при первой
        // загрузке это приводит к «рывкам», поэтому часто делают 'auto'.
    }
    
    function getScrollOffset() {
        const w = window.innerWidth;
        if (w >= 993) {
          return 28;
        } else if (w >= 769) {
          return 45;
        } else {
          return 48;
        }
    }   

    function initializeAnchorScroll() {
        // Убираем предыдущие обработчики для ссылок, начинающихся с "#", "/#" и "/az#"
        $(document).off('click', 'a[href^="#"], a[href^="/#"], a[href^="/az#"]');
    
        $(document).on('click', 'a[href^="#"], a[href^="/#"], a[href^="/az#"]', function (event) {
            event.preventDefault();
            let href = $(this).attr('href');
    
            // Если ссылка начинается с "/#", заменяем её на чистый "#"
            if (href.indexOf('/#') === 0) {
                href = href.replace(/^\/#/, '#');
            }
            
            // Если ссылка начинается с "/az#", это ссылка на главную страницу азербайджанской версии
            if (href.indexOf('/az#') === 0) {
                const anchor = href.substring(3); // убираем "/az", получаем, например, "#about"
                if (window.location.pathname === '/az') {
                    // Если уже на главной странице, скроллим до якоря
                    const $target = $(anchor);
                    if ($target.length) {
                        const offset = getScrollOffset();
                        $('html, body').animate({ scrollTop: $target.offset().top - offset }, 400, () => {
                            history.pushState(null, '', '/az' + anchor);
                        });
                    }
                } else {
                    // Если не на главной, то переходим через swup
                    swup.navigate('/az' + anchor);
                }
                return; // дальше не обрабатываем
            }
            
            // Обработка чистых якорных ссылок вида "#about"
            if (href.indexOf('#') === 0) {
                const targetPath = window.location.pathname;
                const $target = $(href);
                if ($target.length) {
                    const offset = getScrollOffset();
                    $('html, body').animate({ scrollTop: $target.offset().top - offset }, 400, () => {
                        history.pushState(null, '', targetPath + href);
                    });
                }
            }
        });
    }    
    
    function initializeAppend() {
        $(".mil-arrow-place .mil-arrow, .mil-animation .mil-dodecahedron, .mil-current-page a").remove();
        $(".mil-arrow").clone().appendTo(".mil-arrow-place");
        $(".mil-dodecahedron").clone().appendTo(".mil-animation");
        $(".mil-lines").clone().appendTo(".mil-lines-place");
        $(".mil-main-menu ul li.mil-active > a").clone().appendTo(".mil-current-page");
    }

    function initializeAccordion() {
        // let groups = gsap.utils.toArray(".mil-accordion-group");
        // let menus = gsap.utils.toArray(".mil-accordion-menu");
        // let menuToggles = groups.map(createAnimation);

        // menus.forEach((menu) => {
        //     menu.addEventListener("click", () => toggleMenu(menu));
        // });

        // function toggleMenu(clickedMenu) {
        //     menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
        // }
        let groups = gsap.utils.toArray(".mil-accordion-group");
        let menus = gsap.utils.toArray(".mil-accordion-menu");

        // 1) Снимаем прежние "click"
        menus.forEach((menu) => {
            // Снимаем, если уже есть такой обработчик
            menu.removeEventListener("click", handleMenuClick);
        });

        // 2) Создаём массив функций-анимаций
        let menuToggles = groups.map(createAnimation);

        // Определяем функцию, которая будет вызываться при клике:
        function handleMenuClick(e) {
            toggleMenu(e.currentTarget);
        }

        // 3) Вешаем новый обработчик
        menus.forEach((menu) => {
            menu.addEventListener("click", handleMenuClick);
        });

        // Эта функция дёргает все анимации
        function toggleMenu(clickedMenu) {
            menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
        }

        function createAnimation(element) {
            let menu = element.querySelector(".mil-accordion-menu");
            let box = element.querySelector(".mil-accordion-content");
            let symbol = element.querySelector(".mil-symbol");
            let minusElement = element.querySelector(".mil-minus");
            let plusElement = element.querySelector(".mil-plus");

            gsap.set(box, { height: "auto" });

            let animation = gsap.timeline()
                .from(box, { height: 0, duration: 0.4, ease: "sine" })
                .from(minusElement, { duration: 0.4, autoAlpha: 0, ease: "none" }, 0)
                .to(plusElement, { duration: 0.4, autoAlpha: 0, ease: "none" }, 0)
                .to(symbol, { background: accent, ease: "none" }, 0)
                .reverse();

            return function (clickedMenu) {
                if (clickedMenu === menu) {
                    animation.reversed(!animation.reversed());
                } else {
                    animation.reverse();
                }
            };
        }
    }

    function initializeMenu() {
        // Сначала убираем старые обработчики
        $('.mil-menu-btn').off('click');
        $('.mil-main-menu a').off('click');
    
        // Вешаем заново
        $('.mil-menu-btn').on("click", function () {
            $(this).toggleClass('mil-active');
            $('.mil-menu').toggleClass('mil-active');
            if ($(window).width() < 1070) {
                $('.mil-menu-frame').toggleClass('mil-active');
            }
        });
    
        $('.mil-main-menu a').on('click', function () {
            if ($('.mil-menu-btn').hasClass('mil-active')) {
                $('.mil-menu-btn').removeClass('mil-active');
                $('.mil-menu').removeClass('mil-active');
                if ($(window).width() < 1070) {
                    $('.mil-menu-frame').removeClass('mil-active');
                }
            }
        });
    }
    
    function initializeCursor() {
        const cursor = document.querySelector('.mil-ball');
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });

        document.addEventListener('pointermove', (e) => {
            gsap.to(cursor, { duration: 0.6, ease: 'sine', x: e.clientX, y: e.clientY });
        });
    }

    function initializeAnimations() {
        const appearance = document.querySelectorAll(".mil-up");
        appearance.forEach((section) => {
            gsap.fromTo(section, { opacity: 0, y: 40, scale: .98 }, {
                y: 0, opacity: 1, scale: 1, duration: .4,
                scrollTrigger: { trigger: section, toggleActions: 'play none none reverse' }
            });
        });
    }

    function initializeFancybox() {
        $('[data-fancybox="gallery"]').fancybox({
            buttons: ["slideShow", "zoom", "fullScreen", "close"],
            loop: false,
            protect: true
        });
        $.fancybox.defaults.hash = false;
    }

    function initializeSliders() {
        // Слайдер для отзывов
        new Swiper('.mil-reviews-slider', {
            pagination: {
                el: '.mil-revi-pagination',
                clickable: true,
                renderBullet: function (index, className) {
                    const menu = ['<div class="mil-custom-dot mil-slide-1"></div>', '<div class="mil-custom-dot mil-slide-2"></div>', '<div class="mil-custom-dot mil-slide-3"></div>', '<div class="mil-custom-dot mil-slide-4"></div>', '<div class="mil-custom-dot mil-slide-5"></div>', '<div class="mil-custom-dot mil-slide-6"></div>', '<div class="mil-custom-dot mil-slide-7"></div>'];
                    return '<span class="' + className + '">' + menu[index] + '</span>';
                },
            },
            speed: 800,
            effect: 'fade',
            parallax: true,
            navigation: {
                nextEl: '.mil-revi-next',
                prevEl: '.mil-revi-prev',
            },
        });

        // Слайдер для лицензий
        new Swiper('.mil-infinite-show', {
            slidesPerView: 2,
            spaceBetween: 30,
            speed: 5000,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            loop: true,
            freeMode: true,
            breakpoints: {
                992: {
                    slidesPerView: 4,
                },
            },
        });
    }

    function initializeScripts() {
        console.log("Initializing slideshow...");
        initSlideshow();
    }
    // поменять в индексе первую фотку
    function initSlideshow() {
        const slideshowImages = [
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819300/01_flame_towers_ciq8ri.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819300/02_ritz_carlton_vw9oqf.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819301/03_port_baku_walk_gzmbc1.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819301/04_port_baku_mall_wfhw4o.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819301/05_rahat_gourmet_ldncq3.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819302/06_vasilchuki_q5shyf.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819301/07_casa_fs3n2i.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819302/08_deniz_mall_hr6gaj.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819303/09_crescent_mall_vqbbhv.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819304/10_bilgah_hotel_bwy6zl.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819304/11_mall_qatar_obolws.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819305/12_port_baku_residence_ugkj3k.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819306/13_marriott_absheron_baku_c9vgtz.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819306/14_ganjlik_mall_qguslc.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819307/15_mall28_qm0glh.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819307/16_marriott_boulevard_kk8grh.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819308/17_starbucks_gyd_fp1dt4.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819309/18_port_bazar_hg6y63.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819310/19_azure_center_usxqx7.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819311/20_ganja_mall_gewoa4.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819312/21_amburan_mall_s5q6dm.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819312/22_sheraton_baku_jcvaht.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819313/23_athletes_village_bqtcyf.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819314/24_shuvelan_park_dm2ebg.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819315/25_dinamo_hotel_qht3oy.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819315/26_dosa_mall_punk96.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819316/27_skechers_yhpmav.webp',
            'https://res.cloudinary.com/dlarkoumm/image/upload/v1738819317/28_Bumblbee_mywia0.webp',
        ];

        const slideshowLinks = [
            'portfolio_single?project=flame_towers', 
            'portfolio_single?project=ritz_carlton', 
            'portfolio_single?project=port_baku_walk', 
            'portfolio_single?project=port_baku_mall', 
            'portfolio_single?project=rahat_crescent_mall', 
            'portfolio_single?project=vasilchuki', 
            'portfolio_single?project=casa', 
            'portfolio_single?project=daniz_mall', 
            'portfolio_single?project=crescent_mall', 
            'portfolio_single?project=bilgah_hotel', 
            'portfolio_single?project=qatar_mall', 
            'portfolio_single?project=port_baku_residence', 
            'portfolio_single?project=marriott_absheron', 
            'portfolio_single?project=ganjlik_mall', 
            'portfolio_single?project=mall_28', 
            'portfolio_single?project=marriott_boulevard', 
            'portfolio_single?project=starbucks_gyd', 
            'portfolio_single?project=port_bazar', 
            'portfolio_single?project=azure_center', 
            'portfolio_single?project=ganja_mall', 
            'portfolio_single?project=amburan_mall', 
            'portfolio_single?project=sheraton_hotel', 
            'portfolio_single?project=athletes_village', 
            'portfolio_single?project=shuvelan_park', 
            'portfolio_single?project=dinamo_hotel', 
            'portfolio_single?project=dosa_mall', 
            'portfolio_single?project=skechers_crescent_mall', 
            'portfolio_single?project=bumblebee_kids_club'
        ];
        // Ganjlik Mall<br>Baku, Azerbaijan
        const slideshowTexts = [
            "Flame Towers",
            "The Ritz Carlton",
            "Port Baku Walk",
            "Port Baku Mall",
            "Rahat Gourmet Crescent Mall",
            "Vasilchuki Chaihona №1",
            "CASA Baku",
            "Daniz Mall",
            "Crescent Mall",
            "Bilgah Beach Hotel",
            "Mall of Qatar",
            "Port Baku Residence",
            "JW Marriott Absheron Baku",
            "Ganjlik Mall",
            "Mall28",
            "Baku Marriott Boulevard Hotel",
            "Starbucks Heydar Aliyev International Airport",
            "Port Bazar",
            "Azure Business Centre",
            "Ganja Mall",
            "Amburan Mall",
            "Sheraton Baku Intourist Hotel",
            "Athletes Village",
            "Shuvelan Park",
            "Dinamo Hotel",
            "Dosa Mall",
            "Skechers Crescent Mall",
            "Bumblbee Kids Club"
        ];

        let currentImageIndex = 0;

        const slideshowImageElement = document.getElementById('slideshow-image');
        const slideshowLinkElement = document.getElementById('slideshow-link');
        const slideshowTextElement = document.getElementById('slideshow-text');
        const nextSlideButton = document.getElementById("nextSlide");
        const prevSlideButton = document.getElementById("prevSlide");

        if (!slideshowImageElement || !slideshowLinkElement || !slideshowTextElement || !nextSlideButton || !prevSlideButton) {
            console.warn("Slideshow elements are missing in the DOM.");
            return;
        }

        clearInterval(window.slideshowInterval);
        nextSlideButton.replaceWith(nextSlideButton.cloneNode(true));
        prevSlideButton.replaceWith(prevSlideButton.cloneNode(true));

        // function showSlide(index) {
        //     currentImageIndex = (index + slideshowImages.length) % slideshowImages.length;
        //     slideshowImageElement.src = slideshowImages[currentImageIndex];
        //     slideshowLinkElement.href = slideshowLinks[currentImageIndex];
        //     slideshowTextElement.textContent = slideshowTexts[currentImageIndex];
        // }
        function showSlide(index) {
            const newIndex = (index + slideshowImages.length) % slideshowImages.length;
            const tempImg = new Image();
            tempImg.src = slideshowImages[newIndex];
    
            tempImg.onload = () => {
                slideshowImageElement.src = tempImg.src;
                slideshowLinkElement.href = slideshowLinks[newIndex];
                slideshowTextElement.textContent = slideshowTexts[newIndex];
                currentImageIndex = newIndex;
            };
        }

        function startSlideshow() {
            window.slideshowInterval = setInterval(() => {
                showSlide(currentImageIndex + 1);
            }, 3000);
        }

        const newNextButton = document.getElementById("nextSlide");
        const newPrevButton = document.getElementById("prevSlide");

        newNextButton.addEventListener("click", () => {
            clearInterval(window.slideshowInterval);
            showSlide(currentImageIndex + 1);
            startSlideshow();
        });

        newPrevButton.addEventListener("click", () => {
            clearInterval(window.slideshowInterval);
            showSlide(currentImageIndex - 1);
            startSlideshow();
        });

        showSlide(0);
        startSlideshow();
    }

    function initializeTabs() {
        function initAboutTabs() {
            const aboutTabs = document.querySelectorAll('._main_tabs_about_us-tab');
            const aboutTabContents = document.querySelectorAll('.mil-tab-content');
            const aboutImageElement = document.getElementById('tab-image');
            const aboutSelector = document.querySelector('._main_tabs_about_us-selector');

            const aboutImageMap = {
                'about': 'https://res.cloudinary.com/dlarkoumm/image/upload/v1726902814/1_lnanqk.jpg',
                'mission': 'https://res.cloudinary.com/dlarkoumm/image/upload/v1729795856/vision_edmxrm.jpg',
                'vision': 'https://res.cloudinary.com/dlarkoumm/image/upload/v1729796245/misssion_mkkup7.jpg'
            };

            function updateAboutSelectorPosition() {
                if (!aboutSelector) return;

                const activeTab = document.querySelector('._main_tabs_about_us-tab.active');
                if (activeTab) {
                    const activeWidth = activeTab.offsetWidth;
                    const itemPos = activeTab.offsetLeft;
                    aboutSelector.style.left = itemPos + 'px';
                    aboutSelector.style.width = activeWidth + 'px';
                }
            }

            aboutTabs.forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    aboutTabs.forEach(t => t.classList.remove('active'));
                    aboutTabContents.forEach(content => content.classList.remove('active'));

                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab');
                    const contentElement = document.getElementById(tabId + '-content');
                    if (contentElement) {
                        contentElement.classList.add('active');
                    }

                    updateAboutSelectorPosition();

                    if (aboutImageElement) {
                        aboutImageElement.src = aboutImageMap[tabId];
                    }
                });
            });

            updateAboutSelectorPosition();
            return updateAboutSelectorPosition;
        }

        function initServiceTabs() {
            const serviceTabs = document.querySelectorAll('._main_tabs_services-tab');
            const serviceTabContents = document.querySelectorAll('.services-section-content');
            const serviceSelector = document.querySelector('._main_tabs_services-selector');

            function updateServiceSelectorPosition() {
                if (!serviceSelector) return;

                const activeTab = document.querySelector('._main_tabs_services-tab.active');
                if (activeTab) {
                    const activeWidth = activeTab.offsetWidth;
                    const itemPos = activeTab.offsetLeft;
                    serviceSelector.style.left = itemPos + 'px';
                    serviceSelector.style.width = activeWidth + 'px';
                }
            }

            serviceTabs.forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    serviceTabs.forEach(t => t.classList.remove('active'));
                    serviceTabContents.forEach(content => content.classList.remove('active'));

                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab');
                    const contentElement = document.getElementById(tabId + '-content');
                    if (contentElement) {
                        contentElement.classList.add('active');
                    }

                    updateServiceSelectorPosition();
                });
            });

            updateServiceSelectorPosition();
            return updateServiceSelectorPosition;
        }

        const updateAboutSelector = initAboutTabs();
        const updateServiceSelector = initServiceTabs();

        window.removeEventListener('resize', handleResize);
        function handleResize() {
            updateAboutSelector();
            updateServiceSelector();
        }
        window.addEventListener('resize', handleResize);
    }

    function initializePortfolioSingle() {
        function initPortfolioSingle() {
            stopAutoSlide();
            
            const projects = {
                "rahat_crescent_mall": {
                    title: "Rahat Gourmet Crescent Mall",
                    bannerTitle: "Rahat Gourmet Crescent Mall",
                    breadcrumbs: ["Əsas", "Layihələr", "RAHAT GOURMET CRESCENT MALL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Qourmet Market"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Rahat Gourmet is the place, which combines the high-quality premium retail goods and the culinary art of the fine food and drinks."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have provided the full range of services for this project: design, construction, MEP and finishing works."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503753/rahat1_sz55dh.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503753/rahat2_oeorp1.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503755/rahat3_wchwn4.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503755/rahat4_i2bsgs.webp",
                            alt: "4 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "port_bazar", name: "Port Bazar" },
                        { id: "casa", name: "CASA Baku" },
                        { id: "bravo", name: "Bravo Supermarketləri" }
                    ]
                },
                "port_baku_walk": {
                    title: "Port Baku Walk",
                    bannerTitle: "Port Baku Walk",
                    breadcrumbs: ["Əsas", "Layihələr", "PORT BAKU WALK"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Biznes Mərkəzi və Restoranlar"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Port Baku Walk combines a business center with cafes and restaurants featuring diverse cuisines, providing visitors with a great opportunity to spend time in pleasant company. This new complex is set to become the new attraction center for both residents."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have provided quality management and third party consultancy services on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503750/port_baku_walk1_hlt65j.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503750/port_baku_walk2_pp2zys.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503750/port_baku_walk3_in1gvj.webp",
                            alt: "3 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "flame_towers", name: "Flame Towers" },
                        { id: "port_baku_residence", name: "Port Baku Residence" },
                        { id: "azure_center", name: "Azure Business Centre" }
                    ]
                },
                "casa": {
                    title: "CASA Baku",
                    bannerTitle: "CASA Baku",
                    breadcrumbs: ["Əsas", "Layihələr", "CASA BAKU"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Kulinariya Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "CASA is a culinary art Center founded in 2021 at the heart of rich culture and home to an ancient flavourful cuisine, Baku, Azerbaijan."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have provided MEP design and installation works on this project. SHP keeps the partnership relations with CASA, providing maintenance services of the various technical systems. SHP contributes and directly supports culinary education funds for aspiring chefs and community outreach programs, creating impact for the next generations of culinary leaders."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503707/casa1_jled2a.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503708/casa2_umsolh.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503709/casa3_wekhu2.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503710/casa4_ngrfou.webp",
                            alt: "4 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503710/casa5_d85xv7.webp",
                            alt: "5 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "rahat_crescent_mall", name: "Rahat Gourmet Crescent Mall" },
                        { id: "port_bazar", name: "Port Bazar" },
                        { id: "vasilchuki", name: "Vasilchuki Chaihona №1" }
                    ]
                },
                "daniz_mall": {
                    title: "Daniz Mall",
                    bannerTitle: "Daniz Mall",
                    breadcrumbs: ["Əsas", "Layihələr", "DANIZ MALL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Ticarət Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Daniz Mall is one of the favourite venues of Baku citizens and the guests of the city with over 70 branded shops and restaurants. It is located on Baku Boulevard on the shore of the Caspian sea."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-40",
                            text: "SHP provided various fit-out and MEP works at Daniz Mall."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503715/deniz_mall1_rfu5o8.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503715/deniz_mall2_mrhpkt.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503716/deniz_mall3_bdcyi5.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503716/deniz_mall4_vn6hjd.webp",
                            alt: "4 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503716/deniz_mall5_wbiihi.webp",
                            alt: "5 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "crescent_mall", name: "Crescent Mall" },
                        { id: "ganjlik_mall", name: "Ganjlik Mall" },
                        { id: "port_baku_mall", name: "Port Baku Mall" },
                        { id: "shuvelan_park", name: "Shuvelan Park" },
                        { id: "qatar_mall", name: "Mall of Qatar" },
                        { id: "mall_28", name: "Mall28" },
                        { id: "ganja_mall", name: "Ganja Mall" },
                        { id: "amburan_mall", name: "Amburan Mall" },
                        { id: "dosa_mall", name: "Dosa Mall" }
                    ]
                },
                "port_baku_mall": {
                    title: "Port Baku Mall",
                    bannerTitle: "Port Baku Mall",
                    breadcrumbs: ["Əsas", "Layihələr", "PORT BAKU WALK"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Ticarət Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Port Baku Mall is hosting luxury brands in Baku is the only luxury shopping centre in the region."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP provided various fit-out and MEP works at Port Baku Mall ."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503745/port_baku_mall1_ch1qhp.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503745/port_baku_mall2_iulwic.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503745/port_baku_mall3_pmm2xx.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503745/port_baku_mall4_d2lvxj.webp",
                            alt: "4 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503746/port_baku_mall5_jmftr6.webp",
                            alt: "5 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "crescent_mall", name: "Crescent Mall" },
                        { id: "ganjlik_mall", name: "Ganjlik Mall" },
                        { id: "daniz_mall", name: "Daniz Mall" },
                        { id: "shuvelan_park", name: "Shuvelan Park" },
                        { id: "qatar_mall", name: "Mall of Qatar" },
                        { id: "mall_28", name: "Mall28" },
                        { id: "ganja_mall", name: "Ganja Mall" },
                        { id: "amburan_mall", name: "Amburan Mall" },
                        { id: "dosa_mall", name: "Dosa Mall" }
                    ]
                },
                "vasilchuki": {
                    title: "Vasilchuki Chaihona №1",
                    bannerTitle: "Vasilchuki Chaihona №1",
                    breadcrumbs: ["Əsas", "Layihələr", "VASILCHUKI CHAIHONA №1"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Restoran"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Vasilchuki is the chain of exclusive restaurants in the post-soviet countries, which combines all of the best dishes found in the European, Pan-Asian, Central Asian, Slavic and Mediterranean."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed construction, MEP and finishing works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503763/vasilchuki1_eldmrw.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503764/vasilchuki2_s4v5d3.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503764/vasilchuki3_mgdkbp.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503765/vasilchuki4_fpkwba.webp",
                            alt: "4 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "casa", name: "CASA Baku" },
                        { id: "rahat_crescent_mall", name: "Rahat Gourmet Crescent Mall" },
                        { id: "port_bazar", name: "Port Bazar" },
                    ]
                },
                "flame_towers": {
                    title: "Flame Towers",
                    bannerTitle: "Flame Towers",
                    breadcrumbs: ["Əsas", "Layihələr", "FLAME TOWERS"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Biznes Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "The Flame Towers are a group of three skyscrapers, symbolizing the elements of fire, and are the reference to Azerbaijan’s nickname “Land of Fire” , historically rooted in a region where natural gas flares emit from the ground and Zoroastrian worshipers considered flames to be a symbol of the divine."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed technical consultancy works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503725/flame_towers1_j8yzj4.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503725/flame_towers2_io5esi.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503726/flame_towers3_mgxvhr.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1738819300/01_flame_towers_ciq8ri.webp",
                            alt: "4 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "ritz_carlton", name: "The Ritz Carlton" },
                        { id: "marriott_absheron", name: "JW Marriott Absheron Hotel" },
                        { id: "port_baku_walk", name: "Port Baku Walk" },
                        { id: "marriott_boulevard", name: "Baku Marriott Boulevard Hotel" },
                        { id: "sheraton_hotel", name: "Sheraton Baku Intourist Hotel" },
                        { id: "bilgah_hotel", name: "Bilgah Beach Hotel" },
                        { id: "port_baku_residence", name: "Port Baku Residence" },
                    ]
                },
                "ritz_carlton": {
                    title: "The Ritz Carlton Baku",
                    bannerTitle: "The Ritz Carlton Baku",
                    breadcrumbs: ["Əsas", "Layihələr", "THE RITZ CARLTON BAKU"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Lüks Otel Və Yaşayış Kompleksi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "The Ritz Carlton is the global iconic brand, which provides luxury services and experience to their guests."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed MEP and Fire Life Safety Consultancy works on this project, assuring the compliance of the refurbished building to the gold standards of international brand."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503755/ritz_carlton1_v5wi4n.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503756/ritz_carlton2_zapzax.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503756/ritz_carlton3_ay3l8z.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "flame_towers", name: "Flame Towers" },
                        { id: "bilgah_hotel", name: "Bilgah Beach Hotel" },
                        { id: "marriott_absheron", name: "JW Marriott Absheron Hotel" },
                        { id: "marriott_boulevard", name: "Baku Marriott Boulevard Hotel" },
                        { id: "sheraton_hotel", name: "Sheraton Baku Intourist Hotel" },
                    ]
                },
                "crescent_mall": {
                    title: "Crescent Mall",
                    bannerTitle: "Crescent Mall",
                    breadcrumbs: ["Əsas", "Layihələr", "CRESCENT MALL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Ticarət Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Crescent Mall is the shopping centre with over 100 world brands, family entertainment, new concept restaurants, toy and children's stores, home shopping, as well as health and fitness services."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-40",
                            text: "SHP provided various fit-out and MEP works at Crescent Mall."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503712/crescent_mall1_farbhn.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503713/crescent_mall2_fjwpph.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503713/crescent_mall3_iw0wfh.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503713/crescent_mall4_cdoq2p.webp",
                            alt: "4 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503714/crescent_mall5_bxqlqa.webp",
                            alt: "5 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "daniz_mall", name: "Daniz Mall" },
                        { id: "ganjlik_mall", name: "Ganjlik Mall" },
                        { id: "port_baku_mall", name: "Port Baku Mall" },
                        { id: "amburan_mall", name: "Amburan Mall" },
                        { id: "qatar_mall", name: "Mall of Qatar" },
                        { id: "mall_28", name: "Mall28" },
                        { id: "ganja_mall", name: "Ganja Mall" },
                        { id: "shuvelan_park", name: "Shuvelan Park" },
                        { id: "dosa_mall", name: "Dosa Mall" }
                    ]
                },
                "marriott_absheron": {
                    title: "JW Marriott Absheron Baku",
                    bannerTitle: "JW Marriott Absheron Baku",
                    breadcrumbs: ["Əsas", "Layihələr", "JW MARRIOTT ABSHERON BAKU"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Lüks Otel Və Yaşayış Kompleksi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "JW Marriott Absheron Baku is the modern luxury hotel, nestled in the centre of Baku city."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed various construction and MEP works on this project, including both the base-building and the retail areas on the ground floor."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503741/marriot_absheron1_uba2sz.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503742/marriot_absheron2_wwuqfo.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503744/marriot_absheron3_zmvnoz.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "flame_towers", name: "Flame Towers" },
                        { id: "bilgah_hotel", name: "Bilgah Beach Hotel" },
                        { id: "ritz_carlton", name: "The Ritz Carlton Baku" },
                        { id: "marriott_boulevard", name: "Baku Marriott Boulevard Hotel" },
                        { id: "sheraton_hotel", name: "Sheraton Baku Intourist Hotel" },
                        { id: "dinamo_hotel", name: "Dinamo Hotel" },
                    ]
                },
                "bilgah_hotel": {
                    title: "Bilgeh Beach Hotel",
                    bannerTitle: "Bilgeh Beach Hotel",
                    breadcrumbs: ["Əsas", "Layihələr", "BILGEH BEACH HOTEL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Lüks Otel"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Bilgah Beach Hotel is a 5-star hotel on the Caspian Sea coast with private beach, indoor and outdoor pools, spa and restaurants."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed various construction and MEP works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503704/bilgeh_hotel1_gxemca.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503704/bilgeh_hotel2_tmzoen.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503705/bilgeh_hotel3_vatrv2.webp",
                            alt: "3 project picture"
                        }
                        ,
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503706/bilgeh_hotel4_qt7wt0.webp",
                            alt: "4 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "flame_towers", name: "Flame Towers" },
                        { id: "marriott_absheron", name: "JW Marriott Absheron Hotel" },
                        { id: "ritz_carlton", name: "The Ritz Carlton Baku" },
                        { id: "marriott_boulevard", name: "Baku Marriott Boulevard Hotel" },
                        { id: "sheraton_hotel", name: "Sheraton Baku Intourist Hotel" },
                        { id: "dinamo_hotel", name: "Dinamo Hotel" },
                    ]
                },
                "qatar_mall": {
                    title: "Mall of Qatar",
                    bannerTitle: "Mall of Qatar",
                    breadcrumbs: ["Əsas", "Layihələr", "MALL OF QATAR"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Ticarət Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Mall of Qatar is 500,000 sqm shopping destination with over 480 retail locations, local and international cuisines, located in Doha, Qatar."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-40",
                            text: "SHP provided engineering services for compliance management of this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1738819304/11_mall_qatar_obolws.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503739/mall_qatar2_n1gwig.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503740/mall_qatar3_t1iolv.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503740/mall_qatar4_atlmww.webp",
                            alt: "4 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503740/mall_qatar5_s6yvox.webp",
                            alt: "5 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "daniz_mall", name: "Daniz Mall" },
                        { id: "crescent_mall", name: "Crescent Mall" },
                        { id: "port_baku_mall", name: "Port Baku Mall" },
                        { id: "amburan_mall", name: "Amburan Mall" },
                        { id: "ganjlik_mall", name: "Ganjlik Mall" },
                        { id: "mall_28", name: "Mall28" },
                        { id: "ganja_mall", name: "Ganja Mall" },
                        { id: "shuvelan_park", name: "Shuvelan Park" },
                        { id: "dosa_mall", name: "Dosa Mall" }
                    ]
                },
                "ganjlik_mall": {
                    title: "Ganjlik Mall",
                    bannerTitle: "Ganjlik Mall",
                    breadcrumbs: ["Əsas", "Layihələr", "GANJLIK MALL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Ticarət Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Ganjlik Mall is one of the largest shopping malls in Azerbaijan, it contains famous clothing brands alongside with a range of cafes and dining with a beautiful city view."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-40",
                            text: "SHP provided various fit-out and MEP works at Ganjlik Mall."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503730/ganjlik_mall2_tbjium.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503730/ganjlik_mall3_cw02hy.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503731/ganjlik_mall4_jpc7al.webp",
                            alt: "4 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "daniz_mall", name: "Daniz Mall" },
                        { id: "crescent_mall", name: "Crescent Mall" },
                        { id: "port_baku_mall", name: "Port Baku Mall" },
                        { id: "amburan_mall", name: "Amburan Mall" },
                        { id: "qatar_mall", name: "Mall of Qatar" },
                        { id: "mall_28", name: "Mall28" },
                        { id: "ganja_mall", name: "Ganja Mall" },
                        { id: "shuvelan_park", name: "Shuvelan Park" },
                        { id: "dosa_mall", name: "Dosa Mall" }
                    ]
                },
                "mall_28": {
                    title: "Mall28",
                    bannerTitle: "Mall28",
                    breadcrumbs: ["Əsas", "Layihələr", "MALL28"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Ticarət Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Mall28 is one of the first shopping centres in Baku. It is located in a historic location near the central metro station. The architecture of Mall28 was inspired by the surrounding area."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-40",
                            text: "SHP provided various construction, fit-out and MEP works at Mall28."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503769/28_mall1_accfmf.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503770/28_mall2_agr2hk.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503770/28_mall3_jkykc6.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503701/28_mall5_bsewxt.webp",
                            alt: "5 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "daniz_mall", name: "Daniz Mall" },
                        { id: "crescent_mall", name: "Crescent Mall" },
                        { id: "port_baku_mall", name: "Port Baku Mall" },
                        { id: "amburan_mall", name: "Amburan Mall" },
                        { id: "qatar_mall", name: "Mall of Qatar" },                
                        { id: "ganjlik_mall", name: "Ganjlik Mall" },
                        { id: "ganja_mall", name: "Ganja Mall" },
                        { id: "shuvelan_park", name: "Shuvelan Park" },
                        { id: "dosa_mall", name: "Dosa Mall" }
                    ]
                },
                "ganja_mall": {
                    title: "Ganja Mall",
                    bannerTitle: "Ganja Mall",
                    breadcrumbs: ["Əsas", "Layihələr", "GANJA MALL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Ticarət Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Ganja Mall, located in the city of Ganja, is the first shopping and entertainment centre built in the western region in Azerbaijan."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-40",
                            text: "SHP provided various construction, fit-out and MEP works at Ganja Mall."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503727/ganja_mall1_ikxzi7.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503727/ganja_mall2_m76u0x.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503727/ganja_mall3_wtthgp.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503729/ganja_mall4_i2dcd2.webp",
                            alt: "4 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503730/ganja_mall5_mcujkn.webp",
                            alt: "5 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "daniz_mall", name: "Daniz Mall" },
                        { id: "crescent_mall", name: "Crescent Mall" },
                        { id: "port_baku_mall", name: "Port Baku Mall" },
                        { id: "amburan_mall", name: "Amburan Mall" },
                        { id: "qatar_mall", name: "Mall of Qatar" },                
                        { id: "mall_28", name: "Mall28" },
                        { id: "ganjlik_mall", name: "Ganjlik Mall" },
                        { id: "shuvelan_park", name: "Shuvelan Park" },
                        { id: "dosa_mall", name: "Dosa Mall" }
                    ]
                },
                "amburan_mall": {
                    title: "Amburan Mall",
                    bannerTitle: "Amburan Mall",
                    breadcrumbs: ["Əsas", "Layihələr", "AMBURAN MALL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Ticarət Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Amburan Mall is located beachside of the Caspian Sea. It is the loved place of beach-goers on the sunny summer days."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-40",
                            text: "SHP have provided various construction, fit-out and MEP works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1738819312/21_amburan_mall_s5q6dm.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503702/amburan_mall2_jzqwa3.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503702/amburan_mall3_bdwju7.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503702/amburan_mall4_iuf6tw.webp",
                            alt: "4 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "daniz_mall", name: "Daniz Mall" },
                        { id: "crescent_mall", name: "Crescent Mall" },
                        { id: "port_baku_mall", name: "Port Baku Mall" },
                        { id: "shuvelan_park", name: "Shuvelan Park" },
                        { id: "qatar_mall", name: "Mall of Qatar" },                
                        { id: "mall_28", name: "Mall28" },
                        { id: "ganjlik_mall", name: "Ganjlik Mall" },
                        { id: "ganja_mall", name: "Ganja Mall" },
                        { id: "dosa_mall", name: "Dosa Mall" }
                    ]
                },
                "marriott_boulevard": {
                    title: "Baku Marriott Boulevard Hotel",
                    bannerTitle: "Baku Marriott Boulevard Hotel",
                    breadcrumbs: ["Əsas", "Layihələr", "BAKU MARRIOTT BOULEVARD HOTEL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Lüks Otel"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Baku Marriott Boulevard Hotel is a 5-star family-friendly seaside hotel, located in the White City district of Baku city."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed various construction and MEP works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503744/marriott_boulevard_hotel1_naputs.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503744/marriott_boulevard_hotel2_mzwhxa.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503744/marriott_boulevard_hotel3_n8rqah.webp",
                            alt: "3 project picture"
                        }
                        ,
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503744/marriott_boulevard_hotel4_lipfbz.webp",
                            alt: "4 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "flame_towers", name: "Flame Towers" },
                        { id: "bilgah_hotel", name: "Bilgah Beach Hotel" },
                        { id: "ritz_carlton", name: "The Ritz Carlton Baku" },
                        { id: "marriott_absheron", name: "JW Marriott Absheron Hotel" },
                        { id: "sheraton_hotel", name: "Sheraton Baku Intourist Hotel" },
                        { id: "dinamo_hotel", name: "Dinamo Hotel" },
                    ]
                },
                "sheraton_hotel": {
                    title: "Sheraton Baku Intourist Hotel",
                    bannerTitle: "Sheraton Baku Intourist Hotel",
                    breadcrumbs: ["Əsas", "Layihələr", "SHERATON BAKU INTOURIST HOTEL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Lüks Otel"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Sheraton Baku Intourist is a 5-star hotel, nestled by the seafront of Baku city centre."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed various construction and MEP works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503756/sheraton_hotel1_gjpop0.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503757/sheraton_hotel2_nxx8qk.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503757/sheraton_hotel3_q2ji6i.webp",
                            alt: "3 project picture"
                        }
                        ,
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503759/sheraton_hotel4_h6bx69.webp",
                            alt: "4 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "flame_towers", name: "Flame Towers" },
                        { id: "bilgah_hotel", name: "Bilgah Beach Hotel" },
                        { id: "ritz_carlton", name: "The Ritz Carlton Baku" },
                        { id: "marriott_absheron", name: "JW Marriott Absheron Hotel" },
                        { id: "marriott_boulevard", name: "Baku Marriott Boulevard Hotel" },
                        { id: "dinamo_hotel", name: "Dinamo Hotel" },
                    ]
                },
                "port_baku_residence": {
                    title: "Port Baku Residence",
                    bannerTitle: "Port Baku Residence",
                    breadcrumbs: ["Əsas", "Layihələr", "PORT BAKU RESIDENCE"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Premium Yaşayış Kompleksi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "A premier high-end residential development boasting breathtaking views of the Caspian Sea, nestled in the heart of Baku's vibrant city centre, renowned as a prestigious business and cultural hub."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed various construction and MEP works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503748/port_baku_residence1_eusez1.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503749/port_baku_residence2_dpdvuo.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503749/port_baku_residence3_rdkm7l.webp",
                            alt: "3 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "flame_towers", name: "Flame Towers" },
                        { id: "port_baku_walk", name: "Port Baku Walk" },
                        { id: "azure_center", name: "Azure Business Centre" },
                        { id: "athletes_village", name: "Athletes Village" }
                    ]
                },
                "azure_center": {
                    title: "Azure Business Center",
                    bannerTitle: "Azure Business Center",
                    breadcrumbs: ["Əsas", "Layihələr", "AZURE BUSINESS CENTER"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Biznes Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Azure is 30-storey, A+ business center. It’s building resembling a sailing-ship due to architectural appearance, which has a reference to a symbol of success and achievements in a business activity."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have provided engineering services on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503703/azure_center1_itocar.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503703/azure_center2_sirzrs.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503703/azure_center3_ljdndt.webp",
                            alt: "3 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "flame_towers", name: "Flame Towers" },
                        { id: "port_baku_residence", name: "Port Baku Residence" },
                        { id: "port_baku_walk", name: "Port Baku Walk" }
                    ]
                },
                "athletes_village": {
                    title: "Athletes Village",
                    bannerTitle: "Athletes Village",
                    breadcrumbs: ["Əsas", "Layihələr", "ATHLETES VILLAGE"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Yaşayış Kompleksi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Athletes Village is a residential area in Baku. Although it was initially constructed as a residential area, after its opening, it served as an Olympic Village, dedicated for 2015 European Games and 2017 Islamic Solidarity Games."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed electrical works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503702/athletes_village1_wvgdxx.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503702/athletes_village2_ncv3dt.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503703/athletes_village3_uroger.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503703/athletes_village4_necim6.webp",
                            alt: "4 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503703/athletes_village5_b77gae.webp",
                            alt: "5 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "azure_center", name: "Azure Business Centre" },
                        { id: "port_baku_residence", name: "Port Baku Residence" }
                    ]
                },
                "dinamo_hotel": {
                    title: "Dinamo Hotel",
                    bannerTitle: "Dinamo Hotel",
                    breadcrumbs: ["Əsas", "Layihələr", "DINAMO HOTEL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Otel"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Dinamo Hotel Baku is a four-floor hotel with a swimming pool, a spa, a gym, and a conference room."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed various construction and MEP works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503718/dinamo_hotel1_t77mo9.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503719/dinamo_hotel2_k20at1.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503719/dinamo_hotel3_odht6p.webp",
                            alt: "3 project picture"
                        }
                        ,
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503720/dinamo_hotel4_doihzw.webp",
                            alt: "4 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "flame_towers", name: "Flame Towers" },
                        { id: "bilgah_hotel", name: "Bilgah Beach Hotel" },
                        { id: "ritz_carlton", name: "The Ritz Carlton Baku" },
                        { id: "marriott_absheron", name: "JW Marriott Absheron Hotel" },
                        { id: "sheraton_hotel", name: "Sheraton Baku Intourist Hotel" },
                        { id: "marriott_boulevard", name: "Baku Marriott Boulevard Hotel" },
                    ]
                },
                "shuvelan_park": {
                    title: "Shuvelan Park",
                    bannerTitle: "Shuvelan Park",
                    breadcrumbs: ["Əsas", "Layihələr", "SHUVELAN PARK"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Ticarət Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Shuvelan Park is located at the Caspian sea nearby district Shuvelan. With a rental area of 7,834 m², the shopping center is highly accessible with its restaurants, premium retail stores, and children's entertainment centers."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-40",
                            text: "SHP provided various construction, fit-out and MEP works at Shuvelan Park."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503759/shuvelan_park1_zap5m8.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1737042691/shuvelan_park2_iy4v63.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1737042691/shuvelan_park3_g34cfa.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "daniz_mall", name: "Daniz Mall" },
                        { id: "crescent_mall", name: "Crescent Mall" },
                        { id: "port_baku_mall", name: "Port Baku Mall" },
                        { id: "amburan_mall", name: "Amburan Mall" },
                        { id: "qatar_mall", name: "Mall of Qatar" },                
                        { id: "ganjlik_mall", name: "Ganjlik Mall" },
                        { id: "ganja_mall", name: "Ganja Mall" },
                        { id: "mall_28", name: "Mall28" },
                        { id: "dosa_mall", name: "Dosa Mall" }
                    ]
                },
                "dosa_mall": {
                    title: "Dosa Mall",
                    bannerTitle: "Dosa Mall",
                    breadcrumbs: ["Əsas", "Layihələr", "DOSA MALL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Ticarət Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Dosa Mall is the shopping centre, located in city centre of Lankaran. Dosa is the favourite destination of the local people and the tourists."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-40",
                            text: "SHP have completed technical consultancy works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503721/dosa_mall1_nmakl1.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503721/dosa_mall2_mwgtzt.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503721/dosa_mall3_hhvfyp.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "daniz_mall", name: "Daniz Mall" },
                        { id: "crescent_mall", name: "Crescent Mall" },
                        { id: "port_baku_mall", name: "Port Baku Mall" },
                        { id: "amburan_mall", name: "Amburan Mall" },
                        { id: "ganjlik_mall", name: "Ganjlik Mall" },
                        { id: "mall_28", name: "Mall28" },
                        { id: "ganja_mall", name: "Ganja Mall" },
                        { id: "shuvelan_park", name: "Shuvelan Park" },
                        { id: "qatar_mall", name: "Mall of Qatar" }
                    ]
                },
                "port_bazar": {
                    title: "Port Bazar",
                    bannerTitle: "Port Bazar",
                    breadcrumbs: ["Əsas", "Layihələr", "PORT BAZAR"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Qastronom Bazarı"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Port Bazar is an upscale premium market providing a wide range of products to cover everyday needs, as well as delicatessens from all over the world to satisfy the requests of the most sophisticated gourmands."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed design renovation works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503751/port_bazar1_bjlojp.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503752/port_bazar2_mus8u7.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503752/port_bazar3_f1ysyc.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503752/port_bazar4_imwdew.webp",
                            alt: "4 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503753/port_bazar5_ggsgcr.webp",
                            alt: "5 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "rahat_crescent_mall", name: "Rahat Gourmet Crescent Mall" },
                        { id: "casa", name: "CASA Baku" },
                        { id: "bravo", name: "Bravo Supermarketləri" }
                    ]
                },
                "starbucks_gyd": {
                    title: "Starbucks Heydar Aliyev International Airport",
                    bannerTitle: "Starbucks Heydar Aliyev International Airport",
                    breadcrumbs: ["Əsas", "Layihələr", "Starbucks GYD"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Qida Və İçki Sahəsi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Starbucks is the coffee shop chain, welcoming millions of people every week all around the world."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have provided the full range of services for this project at Heydar Aliyev International Airport, including construction, MEP and finishing works."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503760/starbucks_gyd1_c6sxzt.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503762/starbucks_gyd2_dcowac.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503762/starbucks_gyd3_dy48ts.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503762/starbucks_gyd4_mc0xnp.webp",
                            alt: "4 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503763/starbucks_gyd5_g56ca8.webp",
                            alt: "5 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "coffee_shops", name: "Costa Coffee" },
                        { id: "coffee_shops", name: "Second Cup" },
                        { id: "coffee_shops", name: "The Bagel Bar" }
                    ]
                },
                "skechers_crescent_mall": {
                    title: "Skechers Crescent Mall",
                    bannerTitle: "Skechers Crescent Mall",
                    breadcrumbs: ["Əsas", "Layihələr", "SKECHERS CRESCENT MALL"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Pərakəndə Satış"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Skechers is the famous American retailer of lifestyle and athletic footware and apparel for men, women and kids."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have provided the full range of services for the retail unit project at Crescent mall- design, construction, MEP and finishing works."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503759/skechers_crescent_mall1_yee5ii.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503760/skechers_crescent_mall2_aumgeu.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503760/skechers_crescent_mall3_uwg9qu.webp",
                            alt: "3 project picture"
                        },
                    ],
                    relatedProjects: [
                        { id: "fashion_retail", name: "Courir" },
                        { id: "fashion_retail", name: "Nike" },
                        { id: "fashion_retail", name: "Balenciaga" }
                    ]
                },
                "bumblebee_kids_club": {
                    title: "Bumblebee Kids Club",
                    bannerTitle: "Bumblebee Kids Club",
                    breadcrumbs: ["Əsas", "Layihələr", "BUMBLEBEE KIDS CLUB"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Təhsil"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Bumblebee Montessori & Preschool is the entity, providing education in English for kids from 3 to 6 years old. It is located in Port Baku."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed renovation works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736696114/bumblebee1_qbo5ct.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736696115/bumblebee2_iuz1j0.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736696117/bumblebee3_aosylt.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736696118/bumblebee4_yt1u2j.webp",
                            alt: "4 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "kids_city", name: "Kids City" },
                        { id: "kinderland", name: "Kinderland" }
                    ]
                },
                "kinderland": {
                    title: "Kinderland",
                    bannerTitle: "Kinderland",
                    breadcrumbs: ["Əsas", "Layihələr", "KINDERLAND"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Əyləncə Və Təhsil"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Kinderland is a 5,000 m² scaled replica of a real city with streets, shops, theatre and its own currency. It is carefully adapted for children aged 4-14 and combines entertainment and education, with over 60 real-life activities for all kids to enjoy. It is located at Daniz Mall."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed various fit-out and MEP works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503736/kinderland1_iia3xr.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503736/kinderland2_zqzkim.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503736/kinderland3_pkbszv.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503737/kinderland4_zcl4wi.webp",
                            alt: "4 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "kids_city", name: "Kids City" },
                        { id: "bumblebee_kids_club", name: "Bumblebee Kids Club" }
                    ]
                },
                "kids_city": {
                    title: "Kids City",
                    bannerTitle: "Kids City",
                    breadcrumbs: ["Əsas", "Layihələr", "KIDS CITY"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Əyləncə Mərkəzi"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Kids City is an entertainment centre with various activities for the kids from 2 to 12 years old."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed fit-out works on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503734/kids_club1_xi0lsc.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503734/kids_club2_rpkbox.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503734/kids_club3_h4hngy.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "kinderland", name: "Kinderland" },
                        { id: "bumblebee_kids_club", name: "Bumblebee Kids Club" }
                    ]
                },
                "xudat_food": {
                    title: "Xudat Food City Agrocomplex",
                    bannerTitle: "Xudat Food City Agrocomplex",
                    breadcrumbs: ["Əsas", "Layihələr", "XUDAT FOOD CITY AGROCOMPLEX"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Kənd Təsərrüfatı"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Food City Agrocomplex, located in Xudt city is an agrocluster, covering an area of 11.7 hectares, specializing in import and export clearance, logistics, storage, segregation, food safety laboratory and many other specialized operations."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have provided quality management and third party consultancy services on this project."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503767/xudat_food1_zmilrm.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503767/xudat_food2_d0w2ej.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503768/xudat_food3_uc3l0l.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503768/xudat_food4_zuxjuk.webp",
                            alt: "4 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "fuzuli_city", name: "Füzuli Şəhərin İnfrastrukturası" },
                        { id: "karabakh_projects", name: "Qarabağ Layihələri" },
                        { id: "ministry_of_defence", name: "Müdafiə Nazirliyinin Layihələri" }
                    ]
                },
                "fuzuli_city": {
                    title: "Füzuli Şəhərin İnfrastrukturası",
                    bannerTitle: "Füzuli Şəhərin İnfrastrukturası",
                    breadcrumbs: ["Əsas", "Layihələr", "FÜZULI ŞƏHƏRIN İNFRASTRUKTURASI"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Şəhər İnfrastrukturu"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "SHP have participated in the rebuilding process of the Fuzuli city, which was occupied during the period from 1993 to 2020."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP has provided quality management and third party consultancy services for the infrastructure installation works of the domestic water, sewage, rain water, gas line, electrical and communication lines of the new constructed city."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503723/fizuli_city1_dtc9nv.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503724/fizuli_city2_zvqutd.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503724/fizuli_city3_wwf8h1.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "karabakh_projects", name: "Qarabağ Layihələri" },
                        { id: "ministry_of_defence", name: "Müdafiə Nazirliyinin Layihələri" },
                        { id: "xudat_food", name: "Xudat Food City Agrocomplex" },
                    ]
                },
                "karabakh": {
                    title: "Qarabağ Layihələri",
                    bannerTitle: "Qarabağ Layihələri",
                    breadcrumbs: ["Əsas", "Layihələr", "QARABAĞ LAYIHƏLƏRI"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Bərpa İşləri"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "SHP have participated in the rebuilding process of many projects in various regions of Karabakh, which was occupied during the period from 1993 to 2020."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP has provided design services for these projects, as well as managed the quality of execution."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503731/karabakh1_o5nawr.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503733/karabakh2_v9716m.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503733/karabakh3_cfbwso.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "fuzuli_city", name: "Füzuli Şəhərin İnfrastrukturası" },
                        { id: "ministry_of_defence", name: "Müdafiə Nazirliyinin Layihələri" },
                        { id: "xudat_food", name: "Xudat Food City Agrocomplex" },
                    ]
                },
                "ministry_of_defence": {
                    title: "Müdafiə Nazirliyinin Layihələri",
                    bannerTitle: "Müdafiə Nazirliyinin Layihələri",
                    breadcrumbs: ["Əsas", "Layihələr", "MÜDAFIƏ NAZIRLIYININ LAYIHƏLƏRI"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Hərbi Obyektlər"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "SHP have participated in various projects of the Ministry of Defence."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP has provided design services for these projects, as well as managed the quality of execution."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1737283794/MinistryOfDefenceProjects_oscyia.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1738863434/MinistryOfDefenceProjects_2_yecfwx.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1738863435/MinistryOfDefenceProjects_3_xprxh2.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "karabakh", name: "Qarabağ Layihələri" },
                        { id: "fuzuli_city", name: "Füzuli Şəhərin İnfrastrukturası" },
                        { id: "xudat_food", name: "Xudat Food City Agrocomplex" },
                    ]
                },
                "bravo": {
                    title: "Bravo Supermarketləri",
                    bannerTitle: "Bravo Supermarketləri",
                    breadcrumbs: ["Əsas", "Layihələr", "BRAVO SUPERMARKETLƏRI"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Supermarketlər"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "Bravo is a network of supermarkets in Azerbaijan. Currently the number. Currently the number of operating Bravo markets is 137 nos."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "SHP have completed various construction and MEP works on Bravo projects."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503706/bravo1_qjyi2g.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503706/bravo2_w6yvu2.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503707/bravo3_fdlazk.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "rahat_crescent_mall", name: "Rahat Gourmet Crescent Mall" },
                        { id: "port_bazar", name: "Port Bazar" }
                    ]
                },
                "coffee_shops": {
                    title: "Kafelər",
                    bannerTitle: "Kafelər",
                    breadcrumbs: ["Əsas", "Layihələr", "KAFELƏR"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Kafelər"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "SHP have participated on various coffee shop projects, like Starbucks, Costa Coffee, Second Cup and the Bagel Bar."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "We completed design, fit-out and MEP works on various projects of these coffee shop networks."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503710/coffee_shops1_kto0co.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503710/coffee_shops2_umxvf5.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503711/coffee_shops3_vfkig3.webp",
                            alt: "3 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503712/coffee_shops4_jyofvb.webp",
                            alt: "4 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "starbucks_gyd", name: "Starbucks Heydar Aliyev International Airport" }
                    ]
                },
                "fashion_retail": {
                    title: "Brend mağazaları",
                    bannerTitle: "Brend mağazaları",
                    breadcrumbs: ["Əsas", "Layihələr", "BREND MAĞAZALARI"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Pərakəndə Satış"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "SHP have participated on several fashion retail projects, like Courir, Skechers, Nike and Balenciaga."
                        },
                        {
                            tag: "p",
                            class: "mil-mb-60",
                            text: "We completed design, fit-out and MEP works on various projects of these networks."
                        },
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503723/fashion_retail1_kcr2mu.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503722/fashion_retail2_im9psk.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503723/fashion_retail3_berun9.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: [
                        { id: "skechers_crescent_mall", name: "Skechers Crescent Mall" }
                    ]
                },
                "villa": {
                    title: "Villa Layihələri",
                    bannerTitle: "Villa Layihələri",
                    breadcrumbs: ["Əsas", "Layihələr", "VILLA LAYIHƏLƏRI"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Təmir-Tikinti"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "SHP have completed construction of several premium class Villa Layihələri."
                        }
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503766/villa1_mkcvmx.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503766/villa2_fwqfjt.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503767/villa3_v75yws.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: []
                },
                "maintenance": {
                    title: "İstismar Xidmətləri",
                    bannerTitle: "İstismar Xidmətləri",
                    breadcrumbs: ["Əsas", "Layihələr", "İSTİSMAR XIDMƏTLƏRI"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "İstismar Xidmətləri"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "SHP provides planned preventive maintenance services for the several completed projects."
                        }
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503737/maintenance1_fc2kqr.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503739/maintenance2_qphhz3.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503739/maintenance3_dgchs3.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: []
                },
                "design": {
                    title: "Dizayn",
                    bannerTitle: "Dizayn",
                    breadcrumbs: ["Əsas", "Layihələr", "DİZAYN"],
                    info: [
                        {
                            tag: "h4",
                            class: "mil-mb-30",
                            text: "Dizayn Xidmətləri"
                        },
                        {
                            tag: "p",
                            class: "mil-mb-15",
                            text: "SHP provides architectural, structural, MEP design, as well as prepares 3D visualisation and conceptual drawings for their projects."
                        }
                    ],
                    images: [
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1736503717/design1_ykhl1m.webp",
                            alt: "1 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1738863372/design_2_m9gxsb.webp",
                            alt: "2 project picture"
                        },
                        {
                            src: "https://res.cloudinary.com/dlarkoumm/image/upload/v1738863370/design_3_e7tv8c.webp",
                            alt: "3 project picture"
                        }
                    ],
                    relatedProjects: []
                },
                // Other projects...
            };

            const queryParams = new URLSearchParams(window.location.search);
            const projectId = queryParams.get('project');
            const project = projects[projectId];

            if (!project) {
                console.warn("Project not found:", projectId);
                stopAutoSlide();
                return;
            }

            // Проверяем наличие DOM-элементов
            const banner = document.querySelector('.mil-inner-banner h1');
            const breadcrumbsContainer = document.querySelector('.mil-breadcrumbs');
            const infoContainer = document.querySelector('.col-lg-5 .mil-p-0-90');
            const imagesContainer = document.querySelector('.col-lg-7');

            if (!banner || !breadcrumbsContainer || !infoContainer || !imagesContainer) {
                console.error("Required DOM elements are missing.");
                return;
            }

            // Заполняем контент
            banner.textContent = project.bannerTitle;
            breadcrumbsContainer.innerHTML = project.breadcrumbs
                .map((crumb, index) =>
                    index < project.breadcrumbs.length - 1
                        ? `<li><a href="${index === 0 ? '/' : 'portfolio_az'}">${crumb}</a></li>`
                        : `<li>${crumb}</li>`
                )
                .join("");

            infoContainer.innerHTML = project.info
                .map(item => `<${item.tag} class="${item.class}">${item.text}</${item.tag}>`)
                .join("");

            if (project.relatedProjects && project.relatedProjects.length > 0) {
                infoContainer.innerHTML += `<div>
                    <h4 class="mil-mb-30 similar-projects">OXŞAR LAYIHƏLƏR</h4>
                    ${project.relatedProjects
                        .map(rp => `<a href="?project=${rp.id}" class="mil-mb-30 mil-hashtag">${rp.name}</a>`)
                        .join("")}
                </div>`;
            }

            imagesContainer.innerHTML = `
                <div class="slider-container">
                    <div class="slider">
                        ${project.images.map(
                            image => `
                            <div class="slide">
                                <a href="${image.src}" data-lightbox="project-gallery">
                                    <img src="${image.src}" alt="${image.alt}">
                                </a>
                            </div>
                        `
                        ).join('')}
                    </div>
                    <div class="slider-controls">
                        <button class="slider-btn prev">←</button>
                        <button class="slider-btn next">→</button>
                    </div>
                </div>
            `;

            // Слайдер
            initializeSlider();
            startAutoSlide();

            // Удаляем старые обработчики "prev"/"next" через клонирование кнопок
            const oldPrevBtn = document.querySelector('.slider-btn.prev');
            const oldNextBtn = document.querySelector('.slider-btn.next');

            if (oldPrevBtn && oldNextBtn) {
                // Клонируем кнопки, чтобы удалить старые обработчики
                const newPrevBtn = oldPrevBtn.cloneNode(true);
                const newNextBtn = oldNextBtn.cloneNode(true);

                // Заменяем старые на новые (без обработчиков)
                oldPrevBtn.replaceWith(newPrevBtn);
                oldNextBtn.replaceWith(newNextBtn);

                // Добавляем обработчики заново
                newPrevBtn.addEventListener('click', () => {
                    stopAutoSlide();
                    moveSlide('prev');
                    startAutoSlide();
                });

                newNextBtn.addEventListener('click', () => {
                    stopAutoSlide();
                    moveSlide('next');
                    startAutoSlide();
                });
            }
        }

        function initializeSlider() {
            const slides = document.querySelectorAll('.slide');
            if (slides.length === 0) return;

            slides.forEach((slide, index) => {
                slide.classList.remove('left', 'active', 'right');
                if (index === 0) slide.classList.add('active');
                if (index === 1) slide.classList.add('right');
                if (index === slides.length - 1) slide.classList.add('left');
            });
        }

        function moveSlide(direction) {
            const slides = document.querySelectorAll('.slide');
            if (slides.length < 3) return;

            const activeSlide = document.querySelector('.slide.active');
            const activeIndex = Array.from(slides).indexOf(activeSlide);

            slides.forEach(slide => slide.classList.remove('left', 'active', 'right'));

            const newActiveIndex = direction === 'next'
                ? (activeIndex + 1) % slides.length
                : (activeIndex - 1 + slides.length) % slides.length;

            slides[(newActiveIndex - 1 + slides.length) % slides.length].classList.add('left');
            slides[newActiveIndex].classList.add('active');
            slides[(newActiveIndex + 1) % slides.length].classList.add('right');
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                moveSlide('next');
            }, 3000);
        }
        // Сначала снимаем слушатели, если уже были
        document.removeEventListener('swup:willReplaceContent', stopAutoSlide);
        document.removeEventListener('swup:contentReplaced', initPortfolioSingle);

        document.addEventListener('swup:willReplaceContent', stopAutoSlide);
        document.addEventListener('swup:contentReplaced', initPortfolioSingle);

        initPortfolioSingle();
    }

    // Инициализация при загрузке страницы
    initializeDynamicElements();

    // Повторная инициализация после Swup
    document.addEventListener("swup:animationInDone", () => {
        console.log("Swup animation completed. Reinitializing slideshow...");
        initializeDynamicElements();
    });
});
