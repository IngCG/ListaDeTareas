document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskButton = document.getElementById("add-task-button");
  const taskList = document.getElementById("task-list");
  const errorMessage = document.getElementById("error-message");

  // Cargar tareas desde localStorage al iniciar la aplicación
  loadTasks();

  // Función para cargar tareas desde localStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      addTaskToDOM(task.text, task.completed);
    });
  }

  // Función para agregar una tarea
  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
      showError("Please enter a task.");
      return;
    }

    errorMessage.textContent = ""; // Limpiar mensaje de error
    addTaskToDOM(taskText, false);
    saveTask(taskText, false);
    taskInput.value = ""; // Limpiar el campo de entrada
  }

  // Función para mostrar error
  function showError(message) {
    errorMessage.textContent = message;
  }

  // Función para agregar tarea al DOM
  function addTaskToDOM(taskText, completed) {
    const li = document.createElement("li");
    li.textContent = taskText;
    if (completed) {
      li.classList.add("completed");
    }

    // Permitir marcar tarea como completada
    li.addEventListener("click", () => {
      li.classList.toggle("completed");
      const isCompleted = li.classList.contains("completed");
      updateTaskInStorage(taskText, isCompleted);
    });

    // Crear botón de eliminar
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Evitar que el click en el botón active el evento de la lista
      taskList.removeChild(li);
      removeTaskFromStorage(taskText);
    });

    li.appendChild(deleteButton);
    taskList.appendChild(li);
  }

  // Guardar tarea en localStorage
  function saveTask(taskText, completed) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, completed: completed });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Actualizar tarea en localStorage
  function updateTaskInStorage(taskText, completed) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex((task) => task.text === taskText);
    if (taskIndex > -1) {
      tasks[taskIndex].completed = completed;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

  // Eliminar tarea de localStorage
  function removeTaskFromStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.filter((task) => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  // Agregar tarea al hacer clic en el botón
  addTaskButton.addEventListener("click", addTask);

  // Agregar tarea al presionar "Enter"
  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  });
});
