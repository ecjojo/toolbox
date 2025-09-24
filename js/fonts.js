const btnSound_copy = new Audio('sounds/button-fx.mp3');
// Cute Font Map
const cuteMap = {
  "A": "ᴀ", "B": "ʙ", "C": "ᴄ", "D": "ᴅ", "E": "ᴇ",
  "F": "ꜰ", "G": "ɢ", "H": "ʜ", "I": "ɪ", "J": "ᴊ",
  "K": "ᴋ", "L": "ʟ", "M": "ᴍ", "N": "ɴ", "O": "ᴏ",
  "P": "ᴘ", "Q": "Q", "R": "ʀ", "S": "ꜱ", "T": "ᴛ",
  "U": "ᴜ", "V": "ᴠ", "W": "ᴡ", "X": "x", "Y": "ʏ", "Z": "ᴢ"
};

// 將輸入字串轉換成 Cute Font
function toCuteFont(text) {
  return text.split('').map(ch => {
    const upper = ch.toUpperCase();
    return cuteMap[upper] || ch; // 有對應就轉，否則原樣
  }).join('');
}

// 綁定輸入框事件
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.fancytext');
  const output = document.getElementById('copy_8');

  if (input && output) {
    input.addEventListener('input', () => {
      output.value = toCuteFont(input.value);
       btnSound_pick.play();
    });
  }
});
