// 定義一個陣列包含多個句子
var sentences = [
    "X"
  ];
  
  // 在網頁載入時執行的函數
  window.onload = function() {
    // 從句子陣列中隨機選取一個句子
    var randomIndex = Math.floor(Math.random() * sentences.length);
    var randomSentence = "\""+ sentences[randomIndex]+"\"";
  
    // 在 id 為 "random-sentence" 的元素中顯示隨機句子
    // document.getElementById("random-sentence").innerHTML = randomSentence;
  };