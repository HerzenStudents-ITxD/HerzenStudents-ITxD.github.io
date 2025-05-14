const advantagesData2 = [
    {
        imageScr: "images/review_1.png",
    }, 
    {
        imageScr: "images/review_2.png",
    }, 
    {
        imageScr: "images/review_3.png",
    }, 
    {
        imageScr: "images/review_4.png",
        
    }, 
    {
        imageScr: "images/review_5.png",
        
    }, 
    {
        imageScr: "images/review_6.png",
    }, 
    
]

var current_start_index_2 = 0;



var review_carusel_1 = document.getElementById('review_carusel_1');
var review_carusel_2 = document.getElementById('review_carusel_2');
var review_carusel_3 = document.getElementById('review_carusel_3');

var carusel_review_left = document.getElementById('carusel_review_left');
var carusel_review_right = document.getElementById('carusel_review_right');


function updateCaruselReview () {
    review_carusel_1.src = advantagesData2[current_start_index_2 %6].imageScr;
    review_carusel_2.src = advantagesData2[(current_start_index_2+1)%6].imageScr;
    review_carusel_3.src = advantagesData2[(current_start_index_2+2)%6].imageScr;
}

carusel_review_left.onclick = function() {
    current_start_index_2 = (current_start_index_2-1+6);
    updateCaruselReview();
}

carusel_review_right.onclick = function() {
    current_start_index_2 = (current_start_index_2+1);
    updateCaruselReview();
}
