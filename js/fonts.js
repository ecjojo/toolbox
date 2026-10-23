// Loaded only when the font tab is opened. Audio is shared with the other tools.
const cuteMap = {
  "A": "ᴀ", "B": "ʙ", "C": "ᴄ", "D": "ᴅ", "E": "ᴇ",
  "F": "ꜰ", "G": "ɢ", "H": "ʜ", "I": "ɪ", "J": "ᴊ",
  "K": "ᴋ", "L": "ʟ", "M": "ᴍ", "N": "ɴ", "O": "ᴏ",
  "P": "ᴘ", "Q": "Q", "R": "ʀ", "S": "ꜱ", "T": "ᴛ",
  "U": "ᴜ", "V": "ᴠ", "W": "ᴡ", "X": "x", "Y": "ʏ", "Z": "ᴢ"
};

function toCuteFont(text) {
  return Array.from(text, ch => cuteMap[ch.toUpperCase()] || ch).join('');
}

let mounted = false;
export function mountFontTool() {
  if (mounted) return;
  const input = document.querySelector('.fancytext');
  const output = document.getElementById('copy_8');
  if (!input || !output) return;
  input.addEventListener('input', () => {
    output.value = toCuteFont(input.value);
    void window.btnSound_book?.play();
  });
  // Preserve text entered while the module was downloading.
  if (input.value) output.value = toCuteFont(input.value);
  mounted = true;
}
