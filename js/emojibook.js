const btnSound_book = new Audio('sounds/button-fx.mp3');

const defaultEmojis = ["✨", "🌱", "🐰", "😇", "🌻", "⭐", "🌿", "🪐", "💎", "🐛",'🦄', "🐝",'⚡'];

const emojis = [
    {
      category: "ꜰᴀᴄᴇ",
      emojis: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','😈','👿','🤡',
      '🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑',
      '🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😶‍🌫️','😏','😒','🙄','😬','😮‍💨','🤥',
      '😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','😵‍💫','🤯',
      '🤠','🥳','🥸','😎','🤓','🧐','😕','🫤','😟','🙁','😮','😯','😲','😳','🥺','😦','😧','😨',
      '😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','👶','🧒','👦',
      '👧','🧑','👱','👨','🧔','🧔‍♂️','🧔‍♀️','👨‍🦰','👨‍🦱','👨‍🦳','👨‍🦲','👩','👩‍🦰','🧑‍🦰','👩‍🦱','🧑‍🦱','👩‍🦳','🧑‍🦳','👩‍🦲','🧑‍🦲','👱‍♀️','👱‍♂️','🧓','👴','👵','👼'
    ]
    },
    {
        category: "ʙᴏᴅʏ",
        emojis: ['👋','🤚','🖐','✋','🖖','👌','🤌','🤏','✌','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝',,'👍','👎','✊','👊','🤛','🤜',
        '👏','🙌','🫶','👐','🤲','🤝','🙏','💪','🦵','🦶','👂','🦻','👃']
    },
    {
    category: "ᴀɴɪᴍᴀʟ",
    emojis: ['🐵','🙈','🙉','🙊','🐒','🦍','🦧','🐶','🐕','🦮','🐕‍🦺','🐩','🐺','🦊','🦝','🐱','😺','😸','😹',
    '😻','😼','😽','🙀','😿','😾','🐈','🐈‍⬛','🦁','🐯','🐅','🐆','🐴','🐎','🦄','🦓','🦌','🦬','🐮','🐂','🐃','🐄','🐷','🐖'
    ,'🐗','🐽','🐏','🐑','🐐','🐪','🐫','🦙','🦒','🐘','🦣','🦏','🦛','🐭','🐁','🐀','🐹','🐰','🐇','🐿','🦫','🦔','🦇','🐻'
    ,'🐻‍❄️','🐨','🐼','🦥','🦦','🦨','🦘','🦡','🐾','🦃','🐔','🐓','🐣','🐤','🐥','🐦','🐧','🦅','🦆','🦢','🦉','🦤','🪶','🦩',
    '🦚','🦜','🐸','🐊','🐢','🦎','🐍','🐲','🐉','🦕','🦖','🐳','🐋','🐬','🦭','🐟','🐠','🐡','🦈','🐙','🐚','🦀','🦞','🦐',
    '🦑','🐌','🦋','🐛','🐜','🐝','🪲','🐞','🦗','🪳','🦂','🦟','🪰','🪱',]
  },
  {
    category: "ꜰᴏᴏᴅ",
    emojis: ['🍇','🍈','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍏','🍐','🍑','🍒','🍓','🫐','🥝','🍅','🫒','🥥',
    '🥑','🍆','🥔','🥕','🌽','🌶','🫑','🥒','🥬','🥦','🧄','🧅','🍄','🥜','🌰','🍞','🥐','🥖','🫓','🥨','🥯','🥞'
    ,'🧇','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🫔','🥙','🧆','🥚','🍳','🥘','🍲','🫕','🥗',
    '🍿','🧈','🧂','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥠','🥡','🦪','🍦',
    '🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯','☕','🫖','🍵','🍷','🍸','🍹','🍺','🥤','🧋','🧉','🍴']
  },
      {
        category: "ᴀᴄᴛɪᴠɪᴛʏ",
        emojis: ['🙍','🙍‍♂️','🙍‍♀️','🙎','🙎‍♂️','🙎‍♀️','🙅','🙅‍♂️','🙅‍♀️','🙆','🙆‍♂️','🙆‍♀️','💁','💁‍♂️','💁‍♀️','🙋','🙋‍♂️','🙋‍♀️','🧏','🧏‍♂️','🧑‍⚕️','👨‍⚕️',
        '👩‍⚕️','🧑‍🎓','👨‍🎓','👩‍🎓','🧑‍🏫','👨‍🏫','👩‍🏫','🧑‍⚖️','👨‍⚖️','👩‍⚖️','🧑‍🌾','👨‍🌾','👩‍🌾','🧑‍🍳','👨‍🍳','👩‍🍳','🧑‍🔧','👨‍🔧','👩‍🔧','🧑‍🏭','👨‍🏭','👩‍🏭','🧑‍💼',
        '👨‍💼','👩‍💼','🧑‍🔬','👨‍🔬','👩‍🔬','🧑‍💻','👨‍💻','👩‍💻','🧑‍🎤','👨‍🎤','👩‍🎤','🧑‍🎨','👨‍🎨','👩‍🎨','🧑‍✈️','👨‍✈️','👩‍✈️','🧑‍🚀','👨‍🚀','👩‍🚀','🧑‍🚒','👨‍🚒','👩‍🚒','👮'
        ,'👮‍♂️','👮‍♀️','🕵','🕵️‍♂️','🕵️‍♀️','💂','💂‍♂️','💂‍♀️','🥷','👷','👷‍♂️','👷‍♀️','🤴','👸','👲','🧕','🤵','🤵‍♂️','🤵‍♀️','👰','👰‍♂️','👰‍♀️','🤰','🤱'
        ,'👩‍🍼','👨‍🍼','🧑‍🍼','🦸','🦸‍♂️','🦸‍♀️','🦹','🦹‍♂️','🦹‍♀️','🧙','🧙‍♂️','🧙‍♀️','🧚','🧚‍♂️','🧚‍♀️','🧛','🧛‍♂️','🧛‍♀️','🧜','🧜‍♂️','🧜‍♀️','🧝','🧝‍♂️','🧝‍♀️','🧞'
        ,'🧞‍♂️','🧞‍♀️','🧟','🧟‍♂️','🧟‍♀️','🤹','🤹‍♂️','🤹‍♀️',
        '💆','💆‍♂️','💆‍♀️','💇','💇‍♂️','💇‍♀️','🚶','🚶‍♂️','🚶‍♀️','🧍','🧍‍♂️','🧍‍♀️','🧎','🧎‍♂️','🧎‍♀️','🏃','🏃‍♂️','🏃‍♀️','💃','🕺','🧗','🧗‍♂️','🧗‍♀️','🤺'
        ,'🏇','🏂','🏌','🏌️‍♂️','🏌️‍♀️','🏄','🏄‍♂️','🏄‍♀️','🚣','🚣‍♂️','🚣‍♀️','🏊','🏊‍♂️','🏊‍♀️','⛹','⛹️‍♂️','⛹️‍♀️','🏋','🏋️‍♂️','🏋️‍♀️','🚴','🚴‍♂️','🚴‍♀️','🚵',
        '🚵‍♂️','🚵‍♀️','🤸','🤸‍♂️','🤸‍♀️','🤼','🤼‍♂️','🤼‍♀️','🤽','🤽‍♂️','🤽‍♀️','🤾','🤾‍♂️','🤾‍♀️','🧘','🧘‍♂️','🧘‍♀️','🛀','🛌']
      },
      {
      
        category: "ᴏᴛʜᴇʀ",
        emojis: ['🦠','📌','📍','🎼','🎵','🎶','🎤','🎧','📻','💐','🌸','💮','🌹','🥀','🌺','🌻','🌼','🌷','💩','💀','👻','👹','👺','👽',
        '👾','🤖','💯','💢','💥','💫','💦','💣','💤','🌱','🪴','🌲','🌳','🌴','🌵','🌾','🌿','🍀','🍁','🍂','🍃'
        ,'🧭','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌙','🌚','🌛','🌜','🌝','🌞','🪐','⭐','🌟','🌠','🌌','⛅','🌀','🌈','🌂','☔','⚡',
        '⛄', '🔥','💧','🌊','🎃','🎄','🎆','🎇','🧨','✨','🎈','🎉','🎊','🎋','🎍','🎎','🎏','🎐','🎑','🧧','🎀','🎁','🎫','🏆','🏅','⚽',
        '⚾','🥎','🏀','🏐','🏈','🏉','🎾','🥏','🎳','🏏','🏑','🏒','🥍','🏓','🏸','🥊','🥋','🥅','⛳','🎣','🤿','🎽','🎿','🛷','🥌','🎯',
        '🪀','🪁','🎱','🔮','🪄','🧿','🎮','🕹','🎰','🎲','🧩','🧸','🪅','🪆','🃏','🀄','🎴','🎭','🎨','🧵','🪡','🧶','🪢','👓','🥽','🥼','🦺','👔',
        '👕','👖','🧣','🧤','🧥','🧦','👗','👘','🥻','🩱','🩲','🩳','👙','👚','👛','👜','👝','🎒','🩴','👞','👟','🥾','🥿','👠','👡','🩰','👢',
        '👑','👒','🎩','🎓','🧢','🪖','📿','💄','💍','💎','🎷','🪗','🎸','🎹','🎺','🎻','🪕','🥁','🪘','🧪','🧫','🧬','🔬','🔭','📡','🏁','🚩',
        '🎌','🏴‍☠️','💝','💖','💗','💓','💞','💕','💟','💔','❤️‍🔥','🧡','💛','💚','💙','💜','🤎','🖤','🤍']

      },
    // Add more categories and emojis here
  ];

  const recentEmojis = JSON.parse(localStorage.getItem("recentEmojis")) || [];

const emojiContainer = document.getElementById("emoji-book");
const recentEmojiContainer = document.getElementById("recent-emojis");

function updateEmojiContainer() {
  emojiContainer.innerHTML = "";
  recentEmojiContainer.innerHTML = "";

  // 最近使用的 emoji
  for (let i = 0; i < recentEmojis.length; i++) {
    const emojiItem = recentEmojis[i];
    const emojiElement = createEmojiElement(emojiItem);
    recentEmojiContainer.appendChild(emojiElement);
  }

  // 預設 emoji
  const defaultEmojiCount = Math.min(11 - recentEmojis.length, defaultEmojis.length);
  for (let i = 0; i < defaultEmojiCount; i++) {
    const emojiItem = defaultEmojis[i];
    const emojiElement = createEmojiElement(emojiItem);
    recentEmojiContainer.appendChild(emojiElement);
  }

  // 分類 emoji
  for (let i = 0; i < emojis.length; i++) {
    const categoryItem = emojis[i];
    const categoryElement = document.createElement("div");
    categoryElement.textContent = categoryItem.category;
    categoryElement.classList.add("category");
    emojiContainer.appendChild(categoryElement);

    const emojiList = categoryItem.emojis;
    for (let j = 0; j < emojiList.length; j++) {
      const emojiItem = emojiList[j];
      const emojiElement = createEmojiElement(emojiItem);
      emojiContainer.appendChild(emojiElement);
    }
  }
}

updateEmojiContainer();

function createEmojiElement(emojiItem) {
  const emojiElement = document.createElement("div");
  emojiElement.textContent = emojiItem;
  emojiElement.classList.add("emoji");
  emojiElement.addEventListener("click", function () {
    copyToClipboard(emojiItem);
    updateRecentEmojis(emojiItem);
    updateEmojiContainer();
  });
  return emojiElement;
}

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function updateRecentEmojis(emojiItem) {
  const emojiIndex = recentEmojis.indexOf(emojiItem);
  if (emojiIndex !== -1) {
    recentEmojis.splice(emojiIndex, 1);
  }
  recentEmojis.unshift(emojiItem);
  if (recentEmojis.length > 11) {
    recentEmojis.pop();
  }
  localStorage.setItem("recentEmojis", JSON.stringify(recentEmojis));
  btnSound_book.play();
}
  

  //alert("表情符號已複製到剪貼板！");
  