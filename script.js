const nav = document.querySelector("nav");

nav.querySelectorAll("a").forEach((a, index) => {
    a.addEventListener("click", () => {
        nav.querySelectorAll("li").forEach(li => {
            const is_selected = li.classList.contains("selecting");
            if (is_selected) li.classList.remove("selecting");
        });
        nav.querySelectorAll("li")[index].classList.add("selecting");
    });
});

requestAnimationFrame(update_learning_days);


function update_learning_days() {
    const learning_days = Math.floor((new Date() - new Date(2023, 0, 1)) / 1000 / 60 / 60 / 24);
    const learn_time = document.getElementById("learn-time");
    learn_time.innerText = learning_days.toString() + "days";
}

const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

messageInput.addEventListener("keydown", () => {
    massageInputEventListener();
});
messageInput.addEventListener("keyup", () => {
    massageInputEventListener();
});
messageInput.addEventListener("change", () => {
    massageInputEventListener();
});

let massageInputEventListener = () => {
    const is_filled = messageInput.value.trim() !== "";
    if (is_filled) {
        sendBtn.classList.add("send-btn");
    } else if (sendBtn.classList.contains("send-btn")) {
        sendBtn.classList.remove("send-btn");
    }
};

let clicked_count = 0;

sendBtn.addEventListener("click", () => {
    if (!clicked_count) {
        clicked_count ++;
        message = messageInput.value;
        sendMail(message);
    }
});

emailjs.init("kSkyNdkMfA1J1a17O");

async function sendMail(message) {
    const templateVariables = {
        message: message
    };

    await emailjs.send(
        'service_fht8v2p',
        'template_1mejccm',
        templateVariables,
    );

    sendBtn.classList.remove("send-btn");
    massageInputEventListener = () => { };

    alert("無事にあなたのメッセージが私に送信されたようです！\n誠に有難うございました！\n今後もプログラミングと人生に励んでまいります！");
}

document.querySelectorAll("a").forEach(a => {
    a.target = "_blank";
});
nav.querySelectorAll("a").forEach(a => {
    a.target = "_self";
});


