let tasks = []
// dom functions

const showEditModal = (task) => {
  const modal = document.querySelector('#edit-modal')
  const form = modal.querySelector('#edit-form')
  const idInput = form.querySelector('input[name=id]')
  const taskInput = form.querySelector('input[name=task]')

  idInput.value = task.id
  taskInput.value = task.task

  modal.classList.add('visible')
}

// render functions
const renderTask = () => {
  const list = document.querySelector('#task-list')

  const listHTML = tasks.reduce((acc, current) => {
    const complete = current.done ? 'done' : ''

    return (
      acc +
      `
     <li class="task-item ${complete}" >
        <div class="task-btn " onclick="onToggleHandler('${current.id}')" role="button">✓</div>
        <p>
        ${current.task}
        </p>
        <div class="task-btn edit"  onclick="onEditHandler('${current.id}')"  role="button">✎</div>
        <div class="task-btn delete" onclick="onDeleteHandler('${current.id}')"  role="button">⊘</div>
      </li> \n
      `
    )
  }, '')

  list.innerHTML = listHTML
}

const onToggleHandler = (taskId) => {
  const taskIndex = tasks.findIndex((task) => task.id === taskId)

  if (taskIndex < 0) return

  const toggleTask = (task) => {
    const { done, ...remains } = task

    tasks[taskIndex] = {
      ...remains,
      done: !done
    }

    renderTask()
  }

  onFindTask(taskId, toggleTask)

  /*
    const { done, ...remains } = tasks[taskIndex]

    tasks[taskIndex] = {
        ...remains,
        done: !done
    }
    */
}

const onFindTask = (id, callback) => {
  const taskIndex = tasks.findIndex((task) => task.id === id)

  if (taskIndex < 0) return

  callback(tasks[taskIndex])
}

const onDeleteHandler = (taskId) => {
  const taskIndex = tasks.findIndex((task) => task.id === taskId)

  if (taskIndex < 0) return

  tasks.splice(taskIndex, 1) // programacion funcional -> filter
  renderTask()
}

const onEditHandler = (taskId) => {
  const taskIndex = tasks.findIndex((task) => task.id === taskId)

  if (taskIndex < 0) return

  showEditModal(tasks[taskIndex])
}

function eventsListeners() {
  const taskForm = document.querySelector('#todo-form')
  taskForm.addEventListener('submit', (e) => createTask(e, taskForm))

  const editForm = document.querySelector('#edit-form')
  editForm.addEventListener('submit', (e) => editTask(e, editForm))
}

const addTask = (taskName) => {
  const newTask = {
    id: `task_${new Date().getTime()}`,
    task: taskName,
    done: false
  }

  tasks.push(newTask)
}

const createTask = (e, form) => {
  e.preventDefault()

  const formData = new FormData(form)
  const taskName = formData.get('task')

  addTask(taskName)
  renderTask()
  form.reset()
}

const editTask = (e, form) => {
  e.preventDefault()

  const formData = new FormData(form)
  const editedTaskName = formData.get('task') // "" -> falsie
  const idTask = formData.get('id')

  const taskIndex = tasks.findIndex((task) => task.id === idTask)

  if (taskIndex < 0) return

  if (!editedTaskName) return

  const { ...remains } = tasks[taskIndex]

  tasks[taskIndex] = {
    ...remains,
    task: editedTaskName
  }

  renderTask()
  document.querySelector('#edit-modal').classList.remove('visible')
}

function App() {
  console.log('starting app...')
  eventsListeners()
}

window.onload = App
