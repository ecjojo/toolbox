const btnSound = new Audio('sounds/button-fx.mp3');

// const emojifaceBtn = document.getElementById("emoji-face-btn");
// const emojihandBtn = document.getElementById("emoji-hand-btn");
const emojicuteBtn = document.getElementById("emoji-cute-btn");

// Get emojis from https://emojipedia.org/

const emojifaces = [
  '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','🫠','😉','😊','😇',
  '🥰','😍','🤩','😘','😗','😚','😙','🥲',
  '😋','😛','😜','🤪','😝','🤑',
  '🤗','🤭','🫢','🫣','🤫','🤔','🫡',
  '🤐','🤨','😐','😑','😶','🫥','😶‍🌫️','😏','😒','🙄','😬','😮‍💨','🤥',
  '😌','😔','😪','🤤','😴',
  '😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','😵‍💫','🤯',
  '🤠','🥳','🥸',
  '😎','🤓','🧐',
  '😕','🫤','😟','🙁','☹','😮','😯','😲','😳','🥺','🥹','😦','😧','😨','😰',
  '😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱',
  '😤','😡','😠','🤬'
];

const emojihands = [
  '👋','🤚','🖐','✋','🖖','🫱','🫲','🫳','🫴',
  '👌','🤌','🤏','✌','🤞','🫰','🤟','🤘','🤙',
  '👈','👉','👆','🖕','👇','☝','🫵',
  '👍','👎','✊','👊','🤛','🤜'
];

const emojicutes = [

  '🌸','🌷','🍀','🌹','🌻','🌺','🌿','🍄','🐣','🎀','💜','💕','💎','🐛','✨','🫶','⭐','🍀',
  '💩','🐑','🦕','🐟','🐌'
];


// emojifaceBtn.addEventListener("click", () => { 
//   btnSound.play();
//   emojifaceBtn.style = "filter: grayscale(0);";
//     for(let i=0;i<7;i++){
//       setTimeout(function() {
//         emojifaceBtn.innerText = emojifaces[Math.floor(Math.random() * emojifaces.length)];
//    }, 100 * i)
//    }
// });


// emojihandBtn.addEventListener("click", () => { 
//   btnSound.play();
//   emojihandBtn.style = "filter: grayscale(0);";
//     for(let i=0;i<7;i++){
//       setTimeout(function() {
//         emojihandBtn.innerText = emojihands[Math.floor(Math.random() * emojihands.length)];
//    }, 100 * i)
//    }
// });

emojicuteBtn.addEventListener("click", () => { 
   btnSound.play();
  emojicuteBtn.style = "filter: grayscale(0);";
    for(let i=0;i<7;i++){
      setTimeout(function() {
        emojicuteBtn.innerText = emojicutes[Math.floor(Math.random() * emojicutes.length)];
   }, 100 * i)
   }
});



