// 获取文本框和预览文本框的引用
const inputText = document.getElementById('convertor-input');
const covertText = document.getElementById('convertor-rule');
const previewText = document.getElementById('convertor');
const originalPreviewText = previewText.value;  // 保存原始的预览文本

// 添加文本框的事件监听器
inputText.addEventListener('input', convertText);
covertText.addEventListener('input', convertText);

// 转换函数
function convertText() {
  const text = inputText.value;  // 获取文本框的值
  const convertedText = addDelimiter(text);  // 使用指定的分隔符进行转换
  const trimmedText = convertedText.replace(/\s/g, '');  // 移除空白格
  previewText.value = trimmedText !== '' ? trimmedText : originalPreviewText;  // 如果转换后的文本为空，则保留原始的预览文本
}

// 使用指定的分隔符进行转换的函数
function addDelimiter(text) {
  const delimiter = covertText.value;  // 获取分隔符
  // 在每个字符之间添加分隔符，并处理表情符号
  const convertedText = [...text].map(char => isEmoji(char) ? char : char + delimiter).join('');
  return convertedText;
}

// 检查字符是否为表情符号的函数
function isEmoji(char) {
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;  // 匹配表情符号的正则表达式
  return emojiRegex.test(char);
}

// 初始化时进行一次转换
convertText();