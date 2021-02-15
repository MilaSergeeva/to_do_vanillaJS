//Selectors
const todoInput = document.querySelector(".todo__input");
const todoButton = document.querySelector(".todo__button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const filterItems = document.querySelectorAll(".select__input");

const selectSingle = document.querySelector(".select");
const selectSingleContainer = selectSingle.querySelector(".filter-todo");
const selectSingleLabels = selectSingle.querySelectorAll(".select__label");

const popupTodo = document.querySelector(".popup");
const popupTodoContainer = document.querySelector(".popup__container");
const popupTodoText = document.querySelector(".popup__todo");
const popupTodoCloseButton = document.querySelector(".popup__close");
const popupTodoSaveButton = document.querySelector(".popup__save");

let todoTextContent = "";
let inputValue = "";
let todoValue = "";
let draggable = "";

document.addEventListener("click", (e) => {
  console.log(e.target);
});
//Event Listeners
document.addEventListener("DOMContentLoaded", getTodoesFromLocalStorage);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("dragover", dragoverTodo);

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

function dragoverTodo(e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(todoList, e.clientY);
  draggable = document.querySelector(".dragging");
  if (afterElement == null) {
    console.log("проверка", draggable);
    todoList.appendChild(draggable);
  } else {
    console.log("2", draggable);
    todoList.insertBefore(draggable, afterElement);
  }
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".todo-list__item-container:not(.dragging)"),
  ];

  return draggableElements.reduce(
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
}

function sortTodoList() {
  console.log("mau");
  const todoItemsArray = Array.from(
    todoList.querySelectorAll(".todo-list__item-container")
  );

  todoItemsArray.sort(function (a, b) {
    if (a.classList.contains("completed")) {
      return 1;
    } else if (b.classList.contains("completed")) {
      return -1;
    } else {
      return 0;
    }
  });

  todoItemsArray.forEach((el) => todoList.prepend(el));
}

function layoutTodoItem(text, id, completed, addTo) {
  console.log(id);

  // list el <li>
  const newTodo = document.createElement("li");
  newTodo.setAttribute("draggable", "true");
  completed === true
    ? newTodo.classList.add("todo-list__item-container", "completed")
    : newTodo.classList.add("todo-list__item-container");
  newTodo.setAttribute("data-id", id);

  newTodo.addEventListener("dragstart", () => {
    newTodo.classList.add(".dragging");
    console.log("1");
  });

  newTodo.addEventListener("dragend", () => {
    newTodo.classList.remove(".dragging");
  });

  // const moveItemIcon = document.createElement("button");
  // moveItemIcon.innerHTML = '<i class="fas fa-arrows-alt"></i>';
  // moveItemIcon.classList.add("todo-list__move-buttons");
  // newTodo.appendChild(moveItemIcon);

  //todo DIV
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo-list__text");
  newTodo.appendChild(todoDiv);

  //p
  const todoItem = document.createElement("p");
  todoItem.innerText = text;
  todoItem.classList.add("todo-list__item");
  todoDiv.appendChild(todoItem);

  // todoItem.addEventListener("dragstart", () => {
  //   todoItem.classList.add(".dragging");
  //   console.log("bla");
  // });

  // todoItem.addEventListener("dragend", () => {
  //   todoItem.classList.remove(".dragging");
  //   console.log("boom");
  // });

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
  const editOrCopy = document.createElement("div");
  editOrCopy.classList.add("todo-list__edit-clone-container");
  todoDiv.appendChild(editOrCopy);

  const moveItemIcon = document.createElement("i");
  moveItemIcon.classList.add("fas", "fa-arrows-alt");
  newTodo.appendChild(moveItemIcon);

  //edit button
  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="fas fa-edit"></i>';
  editButton.classList.add("todo-list__edit-button");
  editOrCopy.appendChild(editButton);
  editButton.addEventListener("click", editTodo);

  //copy button
  const copyButton = document.createElement("button");
  copyButton.innerHTML = '<i class="fas fa-clone"></i>';
  copyButton.classList.add("todo-list__clone-button");
  editOrCopy.appendChild(copyButton);
  copyButton.addEventListener("click", duplecateToto);

  //view button
  const viewButton = document.createElement("button");
  viewButton.innerHTML = '<i class="far fa-eye"></i>';
  viewButton.classList.add("todo-list__clone-button");
  editOrCopy.appendChild(viewButton);
  viewButton.addEventListener("click", seeTodo);

  //prepend to list
  addTo.prepend(newTodo);
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
  sortTodoList();
}

function duplecateToto(e) {
  e.preventDefault();

  const item = e.target.closest(".todo-list__item-container");
  // const itemParent = item.closest(".todo-list__item-container");
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
  console.log(todoId, todoText, todo);
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

function getTodoesFromLocalStorage() {
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

//close open popup
function handleEscClose(event) {
  const ESC_KEYCODE = 27;
  console.log("esc");
  if (event.keyCode === ESC_KEYCODE) {
    console.log("esc1");
    const popupOpened = popupTodo.querySelector(".popup_opened");

    if (popupOpened) {
      closePopup(popupOpened);
    }
  }
}

function handleOverlayClose(event) {
  if (popupTodo === event.target && popupTodo.classList.contains("popup")) {
    console.log("haha");
    closePopup();
  }
}

function openPopup() {
  popupTodo.classList.add("popup_opened");

  popupTodo.addEventListener("keydown", handleEscClose);

  popupTodoSaveButton.addEventListener("click", closePopup);
}

function closePopup() {
  popupTodo.classList.remove("popup_opened");

  popupTodo.removeEventListener("keydown", handleEscClose);
  popupTodoSaveButton.removeEventListener("click", closePopup);
}

function toggleClass(el, className) {
  console.log(el, className);
  el.classList.contains(className)
    ? el.classList.remove(className)
    : el.classList.add(className);
}
