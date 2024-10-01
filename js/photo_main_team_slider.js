// Пути к изображениям
const photos = [
    'img/preffered_photos/4.jpg',
    'img/preffered_photos/5.jpg',
    'img/preffered_photos/6.jpg',
    'img/preffered_photos/7.jpg',
    'img/preffered_photos/8.jpg',
    'img/preffered_photos/9.jpg',
    'img/preffered_photos/10.jpg'
];

// Индекс текущей фотографии
let currentPhotoIndex = 0;

// Элементы DOM
const sliderImg = document.getElementById('slider-img');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Функция для обновления фотографии
function updatePhoto(index) {
    sliderImg.src = photos[index];
}

// Обработчики нажатий на стрелки
prevBtn.addEventListener('click', () => {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    updatePhoto(currentPhotoIndex);
});

nextBtn.addEventListener('click', () => {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    updatePhoto(currentPhotoIndex);
});

// Автосмена фотографий каждые 3 секунды
setInterval(() => {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    updatePhoto(currentPhotoIndex);
}, 3000);
