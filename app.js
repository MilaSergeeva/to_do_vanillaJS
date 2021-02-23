//Selectors
const todoInput = document.querySelector(".todo__input");
const todoButton = document.querySelector(".todo__button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const filterItems = document.querySelectorAll(".select__input");
const themeChangeBtn = document.querySelector(".themeBtn");

const selectSingle = document.querySelector(".select");
const selectSingleContainer = selectSingle.querySelector(".filter-todo");
const selectSingleLabels = selectSingle.querySelectorAll(".select__label");

const popupTodo = document.querySelector(".popup");
const popupTodoContainer = document.querySelector(".popup__container");
const popupTodoText = document.querySelector(".popup__todo");
const popupTodoCloseButton = document.querySelector(".popup__closeBtn");
const popupTodoSaveButton = document.querySelector(".popup__saveBtn");

let todoTextContent = "";
let inputValue = "";
let todoValue = "";

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodoesFromLocalStorage);
document.addEventListener("DOMContentLoaded", checkPageTheme);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("dragover", debounceDragoverTodo);
themeChangeBtn.addEventListener("click", changeTheme);

popupTodoCloseButton.addEventListener("click", () => {
  closePopup();
});

popupTodo.addEventListener("click", handleOverlayClose);

for (let filterItem of filterItems) {
  filterItem.addEventListener("click", filterTodo);
}

todoInput.addEventListener("input", function () {
  inputValue = todoInput.value;
  if (inputValue !== "") {
    todoButton.disabled = false;
  } else {
    todoButton.disabled = true;
  }
});

//Functions

function debounce(func, wait, immediate) {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

function dragoverTodo(e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(todoList, e.clientY);

  const draggable = document.querySelector(".dragging");

  if (afterElement == null) {
    todoList.appendChild(draggable);
  } else {
    todoList.insertBefore(draggable, afterElement);
  }
}

function debounceDragoverTodo(e) {
  debounce(dragoverTodo(e), 1000);
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".todo-list__item-container:not(.dragging)"),
  ];

  const positioning = draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;

  return positioning;
}

function sortTodoList() {
  const todoItemsArray = Array.from(
    todoList.querySelectorAll(".todo-list__item-container")
  );

  todoItemsArray.sort(function (a, b) {
    if (a.classList.contains("completed")) {
      return -1;
    } else if (b.classList.contains("completed")) {
      return 1;
    } else {
      return 0;
    }
  });

  todoItemsArray.forEach((el) => todoList.prepend(el));
}

function layoutTodoItem(text, id, completed, addTo) {
  // list el <li>
  const newTodo = document.createElement("li");
  newTodo.setAttribute("draggable", "true");
  completed === true
    ? newTodo.classList.add("todo-list__item-container", "completed")
    : newTodo.classList.add("todo-list__item-container");
  newTodo.setAttribute("data-id", id);

  newTodo.addEventListener("dragstart", () => {
    newTodo.classList.add("dragging");
  });

  newTodo.addEventListener("dragend", () => {
    newTodo.classList.remove("dragging");
  });

  //todo DIV
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo-list__text");
  newTodo.appendChild(todoDiv);

  //p
  const todoItem = document.createElement("p");
  todoItem.innerText = text;
  todoItem.classList.add("todo-list__item");
  todoDiv.appendChild(todoItem);

  //check mark button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("todo-list__completed-buttons");
  newTodo.appendChild(completedButton);
  completedButton.addEventListener("click", checkTodo);

  //trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("todo-list__trash-buttons");
  newTodo.appendChild(trashButton);
  trashButton.addEventListener("click", deleteTodo);

  // edit copy block
  const edit = document.createElement("div");
  edit.classList.add("todo-list__edit-container");
  todoDiv.appendChild(edit);

  const moveItemIcon = document.createElement("i");
  moveItemIcon.classList.add("fas", "fa-arrows-alt");
  newTodo.appendChild(moveItemIcon);

  //edit button
  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="fas fa-edit"></i>';
  editButton.classList.add("todo-list__edit-button");
  edit.appendChild(editButton);
  editButton.addEventListener("click", editTodo);

  //copy button
  const copyButton = document.createElement("button");
  copyButton.innerHTML = '<i class="fas fa-clone"></i>';
  copyButton.classList.add("todo-list__edit-button");
  edit.appendChild(copyButton);
  copyButton.addEventListener("click", duplecateToto);

  //view button
  const viewButton = document.createElement("button");
  viewButton.innerHTML = '<i class="far fa-eye"></i>';
  viewButton.classList.add("todo-list__edit-button");
  edit.appendChild(viewButton);
  viewButton.addEventListener("click", seeTodo);

  //prepend to list
  addTo.prepend(newTodo);

  // dark theme

  if (themeChangeBtn.classList.contains("themeBtn-black")) {
    newTodo.classList.add("black");
    completedButton.classList.add("button-black");
    moveItemIcon.classList.add("button-black");
    trashButton.classList.add("button-black");
    edit.classList.add("overlay-black");
    editButton.classList.add("icon-black");
    copyButton.classList.add("icon-black");
    viewButton.classList.add("icon-black");
  } else {
    newTodo.classList.remove("black");
    completedButton.classList.remove("button-black");
    moveItemIcon.classList.remove("button-black");
    trashButton.classList.remove("button-black");
    edit.classList.remove("overlay-black");
    editButton.classList.remove("icon-black");
    copyButton.classList.remove("icon-black");
    viewButton.classList.remove("icon-black");
  }
}

function addTodo(event) {
  event.preventDefault();

  todoValue = todoInput.value;
  const id = new Date().toISOString();

  layoutTodoItem(todoValue, id, false, todoList);

  //add todo list to lockal storage
  saveTodosToLocalStorage({
    title: todoValue,
    completed: false,
    id: id,
  });

  //clear todo input value
  todoInput.value = "";
  todoButton.disabled = true;
}

function deleteTodo(e) {
  e.preventDefault();

  const item = e.target;

  //delete todo

  const todo = item.parentElement;
  //animation
  todo.classList.add("fall");
  removeTodosFromLocalStorage(todo);
  todo.addEventListener("transitionend", function () {
    todo.remove();
  });
}

function checkTodo(e) {
  e.preventDefault();

  const item = e.target;
  //check mark

  const todo = item.parentElement;
  todo.classList.toggle("completed");
  updateTodosLocalStorage(todo);
  // sortTodoList();
}

function duplecateToto(e) {
  e.preventDefault();

  const item = e.target.closest(".todo-list__item-container");
  todoTextContent = item.querySelector(".todo-list__item").innerText;

  const id = new Date().toISOString();

  layoutTodoItem(todoTextContent, id, false, todoList);

  //add todo list to lockal storage
  saveTodosToLocalStorage({
    title: todoTextContent,
    completed: false,
    id: id,
  });
}

function seeTodo(e) {
  e.preventDefault();

  const item = e.target.closest(".todo-list__item-container");

  todoTextContent = item.querySelector(".todo-list__item");

  popupTodoText.textContent = todoTextContent.innerText;

  popupTodoText.hasAttribute("readonly", "true")
    ? ""
    : popupTodoText.setAttribute("readonly", "true");

  popupTodoSaveButton.classList.contains("none-display")
    ? ""
    : popupTodoSaveButton.classList.add("none-display");

  openPopup();
}

function editTodo(e) {
  e.preventDefault();

  const item = e.target;

  const itemParent = item.closest(".todo-list__item-container");
  todoTextContent = itemParent.querySelector(".todo-list__item");

  popupTodoText.textContent = todoTextContent.innerText;

  popupTodoText.hasAttribute("readonly")
    ? popupTodoText.removeAttribute("readonly")
    : "";

  popupTodoSaveButton.classList.contains("none-display")
    ? popupTodoSaveButton.classList.remove("none-display")
    : "";

  openPopup();

  popupTodoSaveButton.addEventListener("click", () => {
    todoTextContent.textContent = popupTodoText.value;
    updateTodosLocalStorage(itemParent);
  });
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

  const todoText = todo.children[0].innerText;
  const todoId = todo.getAttribute("data-id");
  const todoObj = { title: todoText, completed: false, id: todoId };
  const indexOfTodo = todos.findIndex((i) => i.id === todoObj.id);

  if (todo.classList.contains("completed")) {
    todos[indexOfTodo].completed = true;
    todos[indexOfTodo].title = todoText;
    localStorage.setItem("todos", JSON.stringify(todos));
  } else {
    todos[indexOfTodo].completed = false;
    todos[indexOfTodo].title = todoText;
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function saveThemeValueToLocalStorage() {
  if (themeChangeBtn.classList.contains("themeBtn-black")) {
    localStorage.setItem("dark-theme", true);
  } else {
    localStorage.setItem("dark-theme", false);
  }
}

function getTodoesFromLocalStorage() {
  getThemeValueFromLocalStorage();

  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    layoutTodoItem(todo.title, todo.id, todo.completed, todoList);
  });
}

function getThemeValueFromLocalStorage() {
  const themeValue = localStorage.getItem("dark-theme");
  if (themeValue === "true") {
    themeChangeBtn.classList.add("themeBtn-black");
  } else {
    if (themeChangeBtn.classList.contains("themeBtn-black")) {
      themeChangeBtn.classList.remove("themeBtn-black");
    }
  }
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
for (let selectSingleLabel of selectSingleLabels) {
  selectSingleLabel.addEventListener("click", (evt) => {
    selectSingleContainer.textContent = evt.target.textContent;
    selectSingle.setAttribute("data-state", "");
  });
}

//close popup
function handleEscClose(event) {
  const ESC_KEYCODE = 27;
  console.log(event.keyCode);
  if (event.keyCode === ESC_KEYCODE) {
    // const popupOpened = popupTodo.querySelector(".popup_opened");

    if (popupTodo.classList.contains("popup_opened")) {
      closePopup();
    }
  }
}

function handleOverlayClose(event) {
  if (popupTodo === event.target && popupTodo.classList.contains("popup")) {
    closePopup();
  }
}

function openPopup() {
  popupTodo.classList.add("popup_opened");

  document.addEventListener("keydown", handleEscClose);

  popupTodoSaveButton.addEventListener("click", closePopup);
}

function closePopup() {
  popupTodo.classList.remove("popup_opened");

  document.removeEventListener("keydown", handleEscClose);
  popupTodoSaveButton.removeEventListener("click", closePopup);
}

function toggleClass(el, className) {
  el.classList.contains(className)
    ? el.classList.remove(className)
    : el.classList.add(className);
}

function changeTheme() {
  themeChangeBtn.classList.toggle("themeBtn-black");
  toggleThemeChangeBtnText();
  saveThemeValueToLocalStorage();

  checkPageTheme();
  checkListTheme();
}

function toggleThemeChangeBtnText() {
  if (themeChangeBtn.classList.contains("themeBtn-black")) {
    themeChangeBtn.textContent = "Color Theme";
  } else {
    themeChangeBtn.textContent = "Dark Theme";
  }
}

function checkListTheme() {
  if (themeChangeBtn.classList.contains("themeBtn-black")) {
    todoList
      .querySelectorAll(".todo-list__item-container")
      .forEach((el) => el.classList.add("black"));
    todoList
      .querySelectorAll(".todo-list__completed-buttons")
      .forEach((el) => el.classList.add("button-black"));
    todoList
      .querySelectorAll(".fa-arrows-alt")
      .forEach((el) => el.classList.add("button-black"));
    todoList
      .querySelectorAll(".todo-list__trash-buttons")
      .forEach((el) => el.classList.add("button-black"));
    todoList
      .querySelectorAll(".todo-list__edit-container")
      .forEach((el) => el.classList.add("overlay-black"));
    todoList
      .querySelectorAll(".todo-list__edit-button")
      .forEach((el) => el.classList.add("icon-black"));
  } else {
    todoList
      .querySelectorAll(".todo-list__item-container")
      .forEach((el) => el.classList.remove("black"));
    todoList
      .querySelectorAll(".todo-list__completed-buttons")
      .forEach((el) => el.classList.remove("button-black"));
    todoList
      .querySelectorAll(".fa-arrows-alt")
      .forEach((el) => el.classList.remove("button-black"));
    todoList
      .querySelectorAll(".todo-list__trash-buttons")
      .forEach((el) => el.classList.remove("button-black"));
    todoList
      .querySelectorAll(".todo-list__edit-container")
      .forEach((el) => el.classList.remove("overlay-black"));
    todoList
      .querySelectorAll(".todo-list__edit-button")
      .forEach((el) => el.classList.remove("icon-black"));
  }
}

function checkPageTheme() {
  toggleThemeChangeBtnText();
  if (themeChangeBtn.classList.contains("themeBtn-black")) {
    document.querySelector(".body").classList.add("body-black");
    document.querySelector(".todo-header").classList.add("h1-black");
    document.querySelector(".todo__input").classList.add("input-black");
    document.querySelector(".todo__button").classList.add("add-button-black");
    document.querySelector(".filter-todo").classList.add("filter-black");
    document.querySelector(".select").classList.add("select-black");
    document
      .querySelector(".select__content")
      .classList.add("select-content-black");
    document.querySelector(".footer").classList.add("footer-black");
    document.querySelector(".popup__container").classList.add("popup-black");
    document.querySelector(".popup__todo").classList.add("popup-black");
    popupTodoCloseButton.classList.add("popup-closeBtn-black");
    popupTodoSaveButton.classList.add("popup-saveBtn-black");
  } else {
    document.querySelector(".body").classList.remove("body-black");
    document.querySelector(".todo-header").classList.remove("h1-black");
    document.querySelector(".todo__input").classList.remove("input-black");
    document
      .querySelector(".todo__button")
      .classList.remove("add-button-black");
    document.querySelector(".filter-todo").classList.remove("filter-black");
    document.querySelector(".select").classList.remove("select-black");
    document
      .querySelector(".select__content")
      .classList.remove("select-content-black");
    document.querySelector(".footer").classList.remove("footer-black");
    document.querySelector(".popup__container").classList.remove("popup-black");
    document.querySelector(".popup__todo").classList.remove("popup-black");
    popupTodoCloseButton.classList.remove("popup-closeBtn-black");
    popupTodoSaveButton.classList.remove("popup-saveBtn-black");
  }
}
