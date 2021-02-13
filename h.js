function layoutTodoItem(event) {
  event.preventDefault();
  const id = new Date().toISOString();
  console.log(id);

  // list el <li>
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo-list__item-container");
  newTodo.setAttribute("data-id", id);

  //todo DIV
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo-list__text");
  newTodo.appendChild(todoDiv);

  //p
  const todoItem = document.createElement("p");
  todoItem.innerText = todoInput.value;
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
  const editOrCopy = document.createElement("div");
  editOrCopy.classList.add("todo-list__edit-clone-container");
  todoDiv.appendChild(editOrCopy);

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
  // copyButton.addEventListener("click", editTodo);

  //view button
  const viewButton = document.createElement("button");
  viewButton.innerHTML = '<i class="far fa-eye"></i>';
  viewButton.classList.add("todo-list__clone-button");
  editOrCopy.appendChild(viewButton);
  viewButton.addEventListener("click", seeTodo);

  //append to list
  todoList.appendChild(newTodo);
}
