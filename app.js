//Selectors
const todoInput = document.querySelector(".todo__input");
const todoButton = document.querySelector(".todo__button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const filterItems = document.querySelectorAll(".select__input");

const selectSingle = document.querySelector(".select");
const selectSingleContainer = selectSingle.querySelector(".filter-todo");
const selectSingleLabels = selectSingle.querySelectorAll(".select__label");

let editTodo = "";
let inputValue = "";

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodoesFromLocalStorage);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteAndCheck);

for (let filterItem of filterItems) {
  filterItem.addEventListener("click", filterTodo);
}

todoInput.addEventListener("input", function () {
  inputValue = todoInput.value;
  console.log(inputValue);
  if (inputValue !== "") {
    todoButton.disabled = false;
  } else {
    todoButton.disabled = true;
  }
});

//Functions

function addTodo(event) {
  event.preventDefault();

  // //todo DIV
  // const todoDiv = document.createElement("div");
  // todoDiv.classList.add("todo-list__item-container");

  // //li
  // const newTodo = document.createElement("li");
  // newTodo.innerText = todoInput.value;
  // newTodo.classList.add("todo-list__item");

  // todoDiv.appendChild(newTodo);

  //todo DIV
  const todoDiv = document.createElement("li");
  todoDiv.classList.add("todo-list__item-container");

  //li
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-list__item");

  todoDiv.appendChild(newTodo);

  //add todo list to lockal storage
  saveTodosToLocalStorage({
    title: todoInput.value,
    completed: false,
  });

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

  // edit copy block
  const editOrCopy = document.createElement("div");
  editOrCopy.classList.add("todo-list__edit-clone-container");
  todoDiv.appendChild(editOrCopy);

  // buttons to edit copy block

  //edit button
  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="fas fa-edit"></i>';
  editButton.classList.add("todo-list__edit-button");
  editOrCopy.appendChild(editButton);

  //copy button
  const copyButton = document.createElement("button");
  copyButton.innerHTML = '<i class="fas fa-clone"></i>';
  copyButton.classList.add("todo-list__clone-button");
  editOrCopy.appendChild(copyButton);

  //append to list
  todoList.appendChild(todoDiv);

  //clear todo input value
  todoInput.value = "";
  todoButton.disabled = true;
}

// console.log("todoInput", todoInput);
// console.log("todoInput.value", todoInput.value);
// console.log("typeof todoInput.value", typeof todoInput.value);

// function addNewTodo() {
//   if (inputValue !== "") {
//     todoButton.disabled = false;
//     addTodo();
//   } else {
//     todoButton.disabled = true;
//   }
// }
console.log("todoInput.value", todoInput.value);
function deleteAndCheck(e) {
  e.preventDefault();

  const item = e.target;

  //delete todo
  if (item.classList[0] === "todo-list__trash-buttons") {
    const todo = item.parentElement;
    //animation
    todo.classList.add("fall");
    removeTodosFromLocalStorage(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  //check mark
  if (item.classList[0] === "todo-list__completed-buttons") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    updateTodosLocalStorage(todo);
  }

  //edit todo
  if (item.classList[0] === "todo-list__edit-buttons") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    updateTodosLocalStorage(todo);
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;

  todos.forEach((todo) => {
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

function saveTodosToLocalStorage(todo) {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTodosLocalStorage(todo) {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  const todoIndex = todo.children[0].innerText;
  const deletedObj = { title: todoIndex, completed: false };
  const indexOfTodo = todos.findIndex((i) => i.title === deletedObj.title);
  if (todo.classList.contains("completed")) {
    todos[indexOfTodo].completed = true;
    localStorage.setItem("todos", JSON.stringify(todos));
  } else {
    todos[indexOfTodo].completed = false;

    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function getTodoesFromLocalStorage() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    //todo DIV
    const todoDiv = document.createElement("div");
    if (todo.completed === true) {
      todoDiv.classList.add("todo-list__item-container", "completed");
    } else {
      todoDiv.classList.add("todo-list__item-container");
    }

    //li
    const newTodo = document.createElement("li");
    newTodo.innerText = todo.title;
    newTodo.classList.add("todo-list__item");

    todoDiv.appendChild(newTodo);

    //check mark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("todo-list__completed-buttons");
    todoDiv.appendChild(completedButton);

    //edit button
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.add("todo-list__edit-buttons");
    todoDiv.appendChild(editButton);

    //trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("todo-list__trash-buttons");
    todoDiv.appendChild(trashButton);

    //append to list
    todoList.appendChild(todoDiv);
  });
}

function removeTodosFromLocalStorage(todo) {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  const deletedObj = { title: todoIndex, completed: false };

  todos.splice(
    todos.findIndex((i) => i.title === deletedObj.title),
    1
  );

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
