const buttons = document.querySelectorAll('.toggle-button');
const contents = document.querySelectorAll('.toggle-content');

// 預設顯示第5個div
contents[0].classList.add('active');

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    // 移除所有按鈕和內容的active類別
    buttons.forEach(btn => btn.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    // 為點擊的按鈕和對應的內容添加active類別
    button.classList.add('active');
    contents[index].classList.add('active');
  });
});