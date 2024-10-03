// Go through all data-insert buttons, add click event that will insert character into input field. If it has data-noswitch do not switch keyboards
var dataInsertButtons = document.querySelectorAll('[data-insert]');

for (var i = 0; i < dataInsertButtons.length; i++) {
    dataInsertButtons[i].addEventListener('click', function() {
        var insert = this.getAttribute('data-insert');
        var noswitch = this.getAttribute('data-noswitch');
        input.value += insert;
        if (noswitch == null) {
            switchKeyboard();
        }
        // invoke input event
        let event = new Event("input");
        input.dispatchEvent(event);
    });
}

// Data delete
document.querySelector("[data-delete]").addEventListener("click", () => {
    input.value = "";
})

function switchKeyboard() {
    // Make one keyboard hidden and other visible. Keyboards have class keyboard
    const keyboards = document.querySelectorAll(".keyboard");
    keyboards.forEach(k => {
        if (k.hidden) {
            k.hidden = false;
        } else {
            k.hidden = true;
        }
    })
}

// if the device is a computer, then focus on input
if (window.innerWidth > 768) { // Assuming width greater than 768px is a computer
    input.focus();
} else {
    // close aside
    document.querySelector("aside").style.visibility = "hidden";
}
