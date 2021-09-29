//Variables
const TASKS_KEY = "tasks";
let tasks = [];

//main
window.onload = () => {

  //Restore
  tasks = restoreTasks();
  renderTasks();

  //Set listeners
  setOnSubmitFormListener();
  setOnEditFormListener();

}

//Forms Control
const setOnSubmitFormListener = () => {
  const form = document.querySelector("#todo-form");

  form.addEventListener("submit", (e)=> {
    e.preventDefault();

    const formData = new FormData(form);
    const newTask = formData.get("task");

    if(!newTask) return;

    addTask(newTask);
    updateTasks();

    form.reset();
  })
}

const setOnEditFormListener = () => { 
  const form = document.querySelector("#edit-form");

  form.addEventListener("submit", (e)=> {
    e.preventDefault();

    const formData = new FormData(form);
    const newTask = formData.get("task");
    const id = formData.get("id");

    if(!newTask) return;

    onFindTask(id, (index) => {
      tasks[index].task = newTask;
      updateTasks();
    })

    form.reset();
    document.querySelector("#edit-modal").classList.remove("visible");
  })
}

//DOM functions
const updateTasks = () => {
  renderTasks();
  saveTasks(tasks);
}

const renderTasks = () => {
  const list = document.querySelector("#task-list");
  
  const tasksHTML = tasks.reduce((prev, task)=> {
    return prev + `
    <li class="task-item ${task.done ? "done" : ""}" data-id="${task.id}">
      <div class="task-btn complete" role="button" onclick="onToggleHandler('${task.id}')">✓</div>
      <p>
        ${task.task}
      </p>
      <div class="task-btn edit"    role="button" onclick="onEditHandler('${task.id}')">✎</div>
      <div class="task-btn delete"  role="button" onclick="onDeleteHandler('${task.id}')">⊘</div>
    </li>\n
    `;
  }, "");

  list.innerHTML = tasksHTML;
}

const showEditModal = (task) => {
  const modal = document.querySelector("#edit-modal");
  const form = modal.querySelector("form");
  const idInput = form.querySelector("input[name=id]");
  const taskInput = form.querySelector("input[name=task]");

  idInput.value = task.id;
  taskInput.value = task.task;

  modal.classList.add("visible");
}

//On click handlers
const onToggleHandler = (id) => {
  const onFindHandler = (index) => {
    const { done } = tasks[index];
    tasks[index].done = !done;
    updateTasks();
  };

  onFindTask(id, onFindHandler);
}

const onDeleteHandler = (id) => {
  onFindTask(id, (index)=> {
    tasks.splice(index, 1);
    updateTasks();
  })
}

const onEditHandler = (id) => {
  onFindTask(id, (index)=> {
    showEditModal(tasks[index])
  })
}


//Logic functions
const addTask = (task) => {
  const newTask = {
    id: `task_${new Date().getTime()}`,
    task: task,
    done: false,
  };

  tasks.push(newTask);
}

const onFindTask = (id, onFind) => {
  const index = tasks.findIndex(task => task.id === id);

  if(index >= 0) {
    onFind(index);
  }
}

//Local Storage functions
const saveTasks = (list = []) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(list));
}

const restoreTasks = () => JSON.parse(localStorage.getItem(TASKS_KEY)) || [];