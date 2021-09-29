//Variables
let tasks = [];

//Main
window.onload = () => {

  //Render PrevTasks
  tasks = getLSTasks();
  renderTasks();

  //Set Listeners
  setOnSubmitFormListener();
  setOnEditFormListener();
}

//Form control functions
const setOnSubmitFormListener = () => {
  const form = document.querySelector("#todo-form");
  
  form.addEventListener("submit", (e)=> {
    e.preventDefault();
    
    const formData = new FormData(form);
    const newTask = formData.get("task");
    
    if(!newTask) return;
    
    //Logica de procesar la task
    addTask(newTask);
    renderTasks();

    form.reset()
  });
}

const setOnEditFormListener = () => {
  const form = document.querySelector("#edit-form");

  form.addEventListener("submit", (e)=> {
    e.preventDefault();

    const formData = new FormData(form);
    const newTask = formData.get("task");
    const id = formData.get("id");
    
    if(!newTask || !id) return;

    onFindTask(id, true, (index) => {
      tasks[index] = {
        ...tasks[index],
        task: newTask
      }

      document.querySelector("#edit-modal").classList.remove("visible")
    });

    form.reset();
  })
}

//render functions
const renderTasks = () => {
  const list = document.querySelector("#task-list");

  const tasksHTML = tasks.reduce((acc, task)=> {
    return acc + `
    <li class="task-item ${task.done ? "done" : ""}" data-id="${task.id}">
      <div class="task-btn complete" role="button" onclick="onToggleHandler('${task.id}')">✓</div>
      <p>
        ${task.task}
      </p>
      <div class="task-btn edit" role="button" onclick="onEditHandler('${task.id}')" >✎</div>
      <div class="task-btn delete" role="button" onclick="onDeleteHandler('${task.id}')">⊘</div>
    </li>
     \n`
  }, "");

  list.innerHTML = tasksHTML;
  setLSTasks(tasks);
}

//On click handlers
const onToggleHandler = (id) => {
  onFindTask(id, true, (index)=> {
    const { done, ...rest } = tasks[index];
    tasks[index] = {
      ...rest,
      done: !done
    };
  })
}

const onDeleteHandler = (id) => {
  onFindTask(id, true, (index)=> {
    tasks.splice(index, 1);
  }); 
}

const onEditHandler = (id) => {
  onFindTask(id, false, (index)=> {
    showEditModal(tasks[index]);
  })
}

//logic functions
const addTask = (task) => {
  const newTask = {
    id: `task_${new Date().getTime()}`,
    task: task,
    done: false,
  };

  tasks.push(newTask);
}

const onFindTask = (id, rerender, onFind) => {
  const index = tasks.findIndex(task => task.id === id);
  if(index >= 0) {
    onFind(index);
    rerender && renderTasks();
  }
}

//DOM functions
const showEditModal = (task)=> {
  const modal = document.querySelector("#edit-modal");
  const form = modal.querySelector("form#edit-form");
  const idInput = form.querySelector("input[name=id]");
  const taskInput = form.querySelector("input[name=task]");

  idInput.value = task.id;
  taskInput.value = task.task;

  modal.classList.add("visible");
}

//Local Storage functions
const getLSTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];
const setLSTasks = (tasksList = []) => localStorage.setItem("tasks", JSON.stringify(tasksList));