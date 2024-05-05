const snowContainer = document.querySelector(".snow-container");

setInterval(() => {
    createSnow();
}, 100);

function createSnow()
{
    const snow = document.createElement("span");
    snow.classList.add("snow");

    snow.style.width = snow.style.height = Math.random() * 8 + "px";
    snow.style.left = Math.random() * 100 + "%";

    snowContainer.appendChild(snow);

    setTimeout(() => {
        snow.remove();
    }, 10000);
}

