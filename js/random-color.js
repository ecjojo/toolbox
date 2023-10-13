const btnSound_color = new Audio('sounds/button-fx.mp3');

const colorBtn = document.getElementById("color-btn");
const colorName = document.getElementById("color-name");

// button click event
colorBtn.addEventListener("click", () => { 
  btnSound_color.play();
    for(let i=0;i<5;i++){
      setTimeout(function() {
        colorGen();
   }, 150 * i)
   }
   
});

const colorGen = () =>{
  var randomColor = generateRandomColor();
  colorBtn.style.backgroundColor = randomColor;
  colorName.innerText = randomColor;
}

function generateRandomColor() {
  var letters = "0123456789ABCDEF";
  var colorCode = "#";
  for (var i = 0; i < 6; i++) {
    colorCode += letters[Math.floor(Math.random() * 16)];
  }
  return colorCode;
}