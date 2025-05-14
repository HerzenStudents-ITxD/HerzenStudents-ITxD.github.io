const advantagesData = [
    {
        imageScr: "images/chicken.png",
        alt: "Игрушка цыплёнок",
        title: "Цыпа",
        description: "Вес: 300 г\nВысота: 12 см (тело), ноги 10 см\nЦена: 500 руб",
    }, 
    {
        imageScr: "images/capybara.png",
        alt: "Игрушка Капибара",
        title: "Капибара",
        description: "Вес: 550 г\nВысота: 25 см\nЦена: 2800 руб",
    }, 
    {
        imageScr: "images/rabbit.png",
        alt: "Игрушка кролик",
        title: "Зайка",
        description: "Вес: 300 г\nВысота: 10 см (тело), ушки 8 см\nЦена: 500 руб",
    }, 
    {
        imageScr: "images/frog.png",
        alt: "Игрушка лягушка",
        title: "Лягушонок",
        description: "Вес: 80 г\nВысота: 10 см\nЦена: 700 руб\nВ комплекте идут булавки",
    }, 
    {
        imageScr: "images/cat_tykva_small.png",
        alt: "Игрушка маленькая кототыква",
        title: "Кототыква\nмини",
        description: "Вес: 300 г\nВысота: 10 см\nШляпка снимается\nЦена: 800 руб",
    }, 
    {
        imageScr: "images/dragon.png",
        alt: "Игрушка дракон",
        title: "Дракончик",
        description: "Вес: 700 г\nДлина: 25 см\nЦена: 3.500 руб",
    }, 
    
]

var current_start_index = 0;


var carusel_1 = document.getElementById('carusel_1');
var carusel_2 = document.getElementById('carusel_2');
var carusel_3 = document.getElementById('carusel_3');

var carusel_left = document.getElementById('carusel_left');
var carusel_right = document.getElementById('carusel_right');


function updateCarusel () {
    carusel_1.src = advantagesData[current_start_index %6].imageScr;
    carusel_2.src = advantagesData[(current_start_index+1)%6].imageScr;
    carusel_3.src = advantagesData[(current_start_index+2)%6].imageScr;

    carusel_1.alt = advantagesData[current_start_index %6].alt;
    carusel_2.alt = advantagesData[(current_start_index+1)%6].alt;
    carusel_3.alt = advantagesData[(current_start_index+2)%6].alt;
}

carusel_left.onclick = function() {
    current_start_index = (current_start_index-1+6);
    updateCarusel();
}

carusel_right.onclick = function() {
    current_start_index = (current_start_index+1);
    updateCarusel();
}


var modal_image = document.getElementById('modal_image');
var modal_name = document.getElementById('modal_name');
var modal_characteristics = document.getElementById('modal_characteristics');

var CapybaraModal = document.getElementById('CapybaraModal');
var modal_close = document.getElementById('myCapybaraClose');


carusel_1.onclick = function() {
    CapybaraModal.style.display = "block";
    modal_name.innerHTML = advantagesData[current_start_index %6].title;
    modal_image.src = advantagesData[current_start_index %6].imageScr;
    modal_characteristics.innerHTML = advantagesData[current_start_index %6].description;
}

carusel_2.onclick = function() {
    CapybaraModal.style.display = "block";
    modal_name.innerHTML = advantagesData[(current_start_index+1)%6].title;
    modal_image.src = advantagesData[(current_start_index+1)%6].imageScr;
    modal_characteristics.innerHTML = advantagesData[(current_start_index+1)%6].description;
}

carusel_3.onclick = function() {
    CapybaraModal.style.display = "block";
    modal_name.innerHTML = advantagesData[(current_start_index+2)%6].title;
    modal_image.src = advantagesData[(current_start_index+2)%6].imageScr;
    modal_characteristics.innerHTML = advantagesData[(current_start_index+2)%6].description;
}

modal_close.onclick = function() {
    CapybaraModal.style.display = "none";
}

CapybaraModal.onclick = function(event) {
    if(event.target.id === "CapybaraModal")
    {
        CapybaraModal.style.display = "none";
    }
}








// {
//     imageScr: "images/snowman.png",
//     title: "Снеговик",
//     characteristics: "Характеристики",
//     description: "Вес: 300 г\nВысота: 15 см\nЦена: 500 руб",
// }, 
// {
//     imageScr: "images/cat_tykva_big.png",
//     title: "Кототыква",
//     characteristics: "Характеристики",
//     description: "Вес: 800 г\nДиаметр: 20 см\nЦена: 2.400 руб без шляпки, 2.600 с ней",
// }, 