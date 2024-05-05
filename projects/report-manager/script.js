
const calender = document.querySelector(".calender");
const calenderInput = document.getElementById("calender-input");

const toDate = new Date();
let year = toDate.getFullYear();
let month = toDate.getMonth();
let day = toDate.getDay();
let date = toDate.getDate();

if (date === 1) {
    // remove month before last homework data
    let rm_month = month;
    let rm_year = year;
    if (rm_month === 1) {
        rm_month = 11;
        rm_year --;
    } else {
        rm_month --;
    }

    for (let i = 1; i < 32; i ++) {
        console.log(formatDateToInputValue(rm_year, rm_month, i));
        if (localStorage.getItem(formatDateToInputValue(rm_year, rm_month, i))) {
            localStorage.removeItem(formatDateToInputValue(rm_year, rm_month, i));
        }
    }
}

function dateInit()
{
    const toDate = new Date();
    year = toDate.getFullYear();
    month = toDate.getMonth();
    day = toDate.getDay();
    date = toDate.getDate();
}

calenderInputValuePut();
createCalender();
createHomeWorkList();
createManagerData();

function calenderInputValuePut()
{
    calenderInput.value = formatDateToInputValue(year, month + 1, isToday() ? date : 1);
}

calenderInput.addEventListener("change", () => {
    if (calenderInput.value == "") {
        dateInit();
        calenderInputValuePut();
    }
    const currentDate = calenderInput.value.split("-")
    year = parseInt(currentDate[0]);
    month = parseInt(currentDate[1]) - 1;
    date = parseInt(currentDate[2]);

    createCalender();
});

function formatDateToInputValue(year, month, date)
{
    let ret_date = year + "-";

    if (month.toString().split("").length == 2) {
        ret_date += month + "-";
    } else {
        ret_date += "0" + month + "-";
    }

    if (date.toString().split("").length == 2) {
        ret_date += date;
    } else {
        ret_date += "0" + date;
    }

    return ret_date;
}

function changeMonth(num)
{
    month += num;
    if (month === 12) {
        month = 0;
        year ++;
    } else if (month === -1) {
        month = 11;
        year --;
    }
    
    calenderInputValuePut();
    createCalender();
}

function getFirstLastDate()
{
    const firstDay = new Date(year, month, 1).getDay();
    let lastDate = 0;

    if (month === 11) {
        lastDate = new Date(year + 1, 0, 0).getDate();
    } else {
        lastDate = new Date(year, month + 1, 0).getDate();
    }

    return ({
        "first-day": firstDay,
        "last-date": lastDate
    });
}

function isToday()
{
    const toDate = new Date();
    return (toDate.getFullYear() === year && toDate.getMonth() === month && toDate.getDate() === date);
}

function createCalender()
{
    clearCalender();

    let dayCount = 0;
    for (let r = 0; r < 6; r ++) {
        const week = document.createElement("div");
        week.classList.add("week");
        for (let c = 0; c < 7; c ++) {
            const dayBox = document.createElement("div");
            dayBox.classList.add("day-box");
            

            if ( ! r && c >= getFirstLastDate()["first-day"]) {
                dayCount ++;
            } else if (dayCount) {
                dayCount ++;
            }

            if ( ! dayCount || dayCount > getFirstLastDate()["last-date"]) {
                dayBox.innerText = "";
            } else {
                dayBox.innerText = dayCount;

                if (isToday() && date === dayCount) {
                    dayBox.appendChild(createLabel("Today"));
                }
            }

            if (dayCount) {
                const toData = JSON.parse(localStorage.getItem(formatDateToInputValue(year, month + 1, dayCount)));
                if (toData) {
                    toData.forEach((data) => {
                        dayBox.appendChild(createLabel(data.title));
                    });
                }
            }

            week.appendChild(dayBox);
        }
        calender.appendChild(week);
    }
}

function clearCalender()
{
    const week_s = calender.querySelectorAll(".week");
    if (week_s) {
        week_s.forEach((week) => {
            week.remove();
        });
    }
}

function createLabel(text)
{
    const label = document.createElement("div");
    label.classList.add("label");
    label.innerText =text;

    if (text === "Today") {
        label.classList.add("label-today");
    }
    return label;
}

function addHomeWork(title, about, created_at)
{
    const main = document.createElement("div");
    main.classList.add("back-board");

    const input = document.createElement("input");
    input.placeholder = "課題のタイトルを入力してください";
    if (title) {
        input.value = title;
    }

    const calender = document.createElement("input");
    calender.type = "date";
    if (created_at) {
        calender.value = created_at;
        calender.style.display = "none";
    }

    const textarea = document.createElement("textarea");
    textarea.placeholder = "課題についての説明を入力してください";
    if (about) {
        textarea.value = about;
    }

    const button = document.createElement("button");
    button.innerText = "課題に追加";
    if (title) {
        button.innerText = "課題を更新";
    }
    button.onclick = () => {
        if (input.value.trim() !== "" && calender.value !== "" && textarea.value.trim() !== "") {
            const date_s = calender.value.split("-");
            saveHomeWork(input.value.trim(), textarea.value.trim(), date_s[0], date_s[1], date_s[2], title);
        } else {
            alert("すべての入力欄に入力してください");
        }
    }

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "キャンセル";
    cancelButton.onclick = () => {
        removeEditorBoard();
    }

    main.appendChild(calender);
    main.appendChild(input);
    main.appendChild(textarea);
    main.appendChild(button);
    main.appendChild(cancelButton);
    document.getElementById("homeworks").appendChild(main);
}

function removeEditorBoard()
{
    const main = document.querySelector(".back-board");
    main.style.animation = "hiddenBackBoard 0.5s ease-in-out";
    setTimeout(() => {
        main.remove();
    }, 500);
}

function saveHomeWork(title, about, year, month, date, edit) {
    let data_s = [];
    const savedData_s = JSON.parse(localStorage.getItem(formatDateToInputValue(year, month, date)));
    const data = {
        title: title,
        about: about,
        created_at: formatDateToInputValue(year, month, date)
    };

    let wasUsedTitle = false;
    if (savedData_s) {
        savedData_s.forEach((data) => {
            if (data.title === title && ! edit) {
                alert("このタイトルはすでにほかの課題で使用されています\n別のタイトルを使用してください");
                wasUsedTitle = true;
            } else if (edit !== data.title) {
                data_s.push(data);
            }
        });
    }

    if ( ! wasUsedTitle) {
        data_s.push(data);

        localStorage.setItem(formatDateToInputValue(year, month, date), JSON.stringify(data_s));
        if (edit) {
            alert("課題を更新しました");
        } else {
            alert("課題を追加しました");
        }
        removeEditorBoard();
        createCalender();
        createHomeWorkList();
        createManagerData();
    }
}

function deleteHomeWork(title, key) {
    const data_s = JSON.parse(localStorage.getItem(key));
    let save_data_s = [];
    data_s.forEach((data) => {
        if (data.title !== title) {
            save_data_s.push(data);
        }
    });
    localStorage.setItem(key, JSON.stringify(save_data_s));
}

function createHomeWorkList()
{
    if (localStorage.length !== null) {
        removeHomeWorkList();

        const homeworkList = document.getElementById("homework-list");

        let data_s = [];
        for (let i = 0; i < localStorage.length; i ++) {
            JSON.parse(localStorage.getItem(localStorage.key(i))).forEach((data) => {
                data_s.push(data);
            });
        }

        data_s.forEach((data) => {
            const list = document.createElement("li");
            list.onclick = () => {
                if (text.innerText.includes(data.about) && text.innerText !== data.about) {
                    text.innerText = data.title;
                } else {
                    text.innerText += "\n\n" + data.about;
                }
            }

            const text = document.createElement("p");
            text.innerText = data.title;

            const div = document.createElement("div");

            const edit_img = document.createElement("img");
            edit_img.src = "img_s/edit.png";
            edit_img.alert_img = "homework to edit";
            edit_img.onclick = () => {
                addHomeWork(data.title, data.about, data.created_at);
            }

            const delete_img = document.createElement("img");
            delete_img.src = "img_s/delete.png";
            delete_img.alert = "homework to delete";
            delete_img.onclick = () => {
                
                const askOK = confirm("この課題を削除しても構いませんか？");
                if (askOK) {
                    deleteHomeWork(data.title, data.created_at);
                    alert("課題を削除しました");
                    createCalender();
                    createHomeWorkList();
                    createManagerData();
                }
            }

            div.appendChild(edit_img);
            div.appendChild(delete_img);
            list.appendChild(text);
            list.appendChild(div);

            homeworkList.appendChild(list);
        });
    }
}

function removeHomeWorkList()
{
    const list_s = document.getElementById("homework-list").querySelectorAll("li");
    if (list_s) {
        list_s.forEach((list) => {
            list.remove();
        });
    }
}

function createManagerData()
{
    const toDayHomeWork = document.getElementById("today-homework");
    if (toDayHomeWork.querySelectorAll("li")) {
        toDayHomeWork.querySelectorAll("li").forEach((list) => {
            list.remove();
        });
    }
    const nearDayHomeWork = document.getElementById("near-day-homework");
    if (nearDayHomeWork.querySelectorAll("li")) {
        nearDayHomeWork.querySelectorAll("li").forEach((list) => {
            list.remove();
        });
    }

    const toDate = new Date();
    const toData = JSON.parse(localStorage.getItem(formatDateToInputValue(toDate.getFullYear(), toDate.getMonth() + 1, toDate.getDate())));
    if (toData) {
        toData.forEach((data) => {
            toDayHomeWork.appendChild(createHomeWorkLabel(data.title, data.about));
        });
    }

    let checkData_s = [];
    for (let i = 0; i < localStorage.length; i ++) {
        if (localStorage.key(i) !== formatDateToInputValue(toDate.getFullYear(), toDate.getMonth() + 1, toDate.getDate()) && JSON.parse(localStorage.getItem(localStorage.key(i))).length) {
            checkData_s.push(localStorage.key(i));
        }
    }
    for (let i = 0; i < checkData_s.length; i ++) {
        checkData_s[i] = parseInt(checkData_s[i].split("-").join(""));
    }
    if (checkData_s.length) {
        const checkData = checkData_s.sort((a, b) => { return (a < b) ? -1 : 1 })[0].toString();
        const checkDataKey = checkData.slice(0, 4) + "-" + checkData.slice(4, 6) + "-" + checkData.slice(6, 8);
        JSON.parse(localStorage.getItem(checkDataKey)).forEach((data) => {
            nearDayHomeWork.appendChild(createHomeWorkLabel(data.title, data.about));
        });
    }
}

function createHomeWorkLabel(title, about)
{
    const label = document.createElement("li");
    label.classList.add("homework-label");
    label.innerText = title;
    label.onclick = () => {
        if (label.innerText.includes(about) && label.innerText !== about) {
            label.innerText = title;
        } else {
            label.innerText += "\n\n" + about;
        }
    }
    return label;
}

