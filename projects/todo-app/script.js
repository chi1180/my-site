const input = document.getElementById("input");
const form = document.getElementById("form");
const listContainer = document.getElementById("list-container");

const todo_s = JSON.parse(localStorage.getItem("todo_s"));

if (todo_s) {
    todo_s.forEach ( todo => add(todo) );
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const todo = {
        text: input.value.trim(),
        line: false
    };
    add(todo);
});

function add(todo)
{
    if (todo.text) {
        const list = document.createElement("li");
        list.innerText = todo.text;
        list.classList.add("list");

        if (todo.line) {
            list.classList.add("line");
        }

        list.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            list.remove();
            save();
        });

        list.addEventListener('click', () => {
            list.classList.toggle("line");
            save();
        });

        listContainer.appendChild(list);

        save();
        input.value = "";
    }
}

function save()
{
    const list_s = listContainer.querySelectorAll("li");
    let todo_s = [];

    list_s.forEach((list) => {
        const todo = {
            text: list.innerText,
            line: list.classList.contains("line")
        };
        todo_s.push(todo);
    });
    localStorage.setItem("todo_s", JSON.stringify(todo_s));
}

