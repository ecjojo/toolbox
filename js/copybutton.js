const btnSound_copy = new Audio('sounds/button-fx.mp3');

$(function() {
    var intv;

    function resetCopyButton() {
        $(".copybutton").html('Copy');
        intv = setInterval(function() {
            $(".copybutton").html('Copy');
        }, 1000);
    }

    resetCopyButton();

    $("body").on('click', ".copybutton", function() {
        var $button = $(this);
        $button.html('Copied');
        clearInterval(intv);
        setTimeout(function() {
            $button.html('Copy');
            resetCopyButton();
        }, 1000);
    });
});

var clipboard = new ClipboardJS('.copybutton');
clipboard.on('success', function(e) {
    btnSound_copy.play();
    //console.log(e);
});
clipboard.on('error', function(e) {
    //console.log(e);
});
