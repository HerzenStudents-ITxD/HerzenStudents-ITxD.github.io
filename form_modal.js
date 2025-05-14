var button = document.getElementById('myButton');
var button1 = document.getElementById('myButton-1');
var modal = document.getElementById('myModal');
var close = document.getElementById('myClose');


button.onclick = function() {
    modal.style.display = "block";
}

button1.onclick = function() {
    modal.style.display = "block";
}

close.onclick = function() {
    modal.style.display = "none";
}



myModal.onclick = function(event) {
    if(event.target.id === "myModal")
    {
        myModal.style.display = "none";
    }
}