// Пути к изображениям
const photos = [
    'https://res.cloudinary.com/dlarkoumm/image/upload/v1727864956/4.jpg',
    'https://res.cloudinary.com/dlarkoumm/image/upload/v1727864963/5.jpg',
    'https://res.cloudinary.com/dlarkoumm/image/upload/v1727864963/6.jpg',
    'https://res.cloudinary.com/dlarkoumm/image/upload/v1727864963/7.jpg',
    'https://res.cloudinary.com/dlarkoumm/image/upload/v1727864963/8.jpg',
    'https://res.cloudinary.com/dlarkoumm/image/upload/v1727864963/9.jpg',
    'https://res.cloudinary.com/dlarkoumm/image/upload/v1727864956/10.jpg'
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
