//Selectors
const todoInput = document.querySelector(".todo__input");
const todoButton = document.querySelector(".todo__button");
const todoList = document.querySelector(".todo-list");

//Event Listeners
todoButton.addEventListener("click", addTodo);

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
