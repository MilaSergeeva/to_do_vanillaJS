//Selectors
const todoInput = document.querySelector(".todo__input");
const todoButton = document.querySelector(".todo__button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const filterItems = document.querySelectorAll(".select__input");

const selectSingle = document.querySelector(".select");
const selectSingleContainer = selectSingle.querySelector(".filter-todo");
const selectSingleLabels = selectSingle.querySelectorAll(".select__label");

console.log(filterOption, todoList);
console.log(filterItems, "filter");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodoes);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
// filterOption.addEventListener("change", filterTodo);
// filterOption.addEventListener("click", filterTodo);

for (let filterItem of filterItems) {
  filterItem.addEventListener("click", filterTodo);
  console.log("nhfv");
}

//Functions

function addTodo(event) {
  event.preventDefault();

  //todo DIV
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo-list__item-container");

  //li
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-list__item");

  todoDiv.appendChild(newTodo);

  //add todo list to lockal storage
  saveLocalTodos(todoInput.value);

  //check mark button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("todo-list__completed-buttons");
  todoDiv.appendChild(completedButton);

  //trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("todo-list__trash-buttons");
  todoDiv.appendChild(trashButton);

  //append to list
  todoList.appendChild(todoDiv);

  //clear todo input value
  todoInput.value = "";
}

function deleteCheck(e) {
  e.preventDefault();

  const item = e.target;

  //delete todo
  if (item.classList[0] === "todo-list__trash-buttons") {
    const todo = item.parentElement;
    //animation
    todo.classList.add("fall");
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  //check mark
  if (item.classList[0] === "todo-list__completed-buttons") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;

  console.log(todos, "todos");
  todos.forEach((todo) => {
    console.log(todo, "todo");
    if (todo.classList !== undefined) {
      switch (e.target.value) {
        case "all":
          todo.style.display = "flex";
          break;
        case "completed":
          if (todo.classList.contains("completed")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
          break;
        case "uncompleted":
          if (!todo.classList.contains("completed")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
          break;
      }
    }
    return;
  });
}

function saveLocalTodos(todo) {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodoes() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    //todo DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo-list__item-container");

    //li
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-list__item");

    todoDiv.appendChild(newTodo);

    //check mark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("todo-list__completed-buttons");
    todoDiv.appendChild(completedButton);

    //trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("todo-list__trash-buttons");
    todoDiv.appendChild(trashButton);

    //append to list
    todoList.appendChild(todoDiv);
  });
}

function removeLocalTodos(todo) {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Toggle menu
selectSingleContainer.addEventListener("click", () => {
  if (selectSingle.getAttribute("data-state") === "active") {
    selectSingle.setAttribute("data-state", "");
  } else {
    selectSingle.setAttribute("data-state", "active");
  }
});

// Close when click to option
for (let i = 0; i < selectSingleLabels.length; i++) {
  selectSingleLabels[i].addEventListener("click", (evt) => {
    selectSingleContainer.textContent = evt.target.textContent;
    selectSingle.setAttribute("data-state", "");
  });
}

// Close when click to option
for (let selectSingleLabel of selectSingleLabels) {
  selectSingleLabel.addEventListener("click", (evt) => {
    selectSingleContainer.textContent = evt.target.textContent;
    selectSingle.setAttribute("data-state", "");
  });
}
