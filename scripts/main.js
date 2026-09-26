"use strict";

/* =========================================================
   AUREX Week 4 — Task Manager
   Vanilla JavaScript only: DOM manipulation, events,
   form validation, and localStorage persistence.
   ========================================================= */

// ---------- State (variables) ----------
const STORAGE_KEY = "aurex-week4-tasks";
let tasks = []; // array of task objects: { id, text, completed }
let currentFilter = "all"; // "all" | "active" | "completed"

// ---------- DOM references ----------
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const formError = document.getElementById("formError");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");

// ---------- localStorage helpers ----------
function saveTasks() {
  // JSON.stringify: turn the array of task objects into a string
  // localStorage can actually hold.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);

  // Conditional: nothing saved yet -> start with an empty list
  if (!stored) {
    return [];
  }

  try {
    // JSON.parse: turn the saved string back into real JS objects
    return JSON.parse(stored);
  } catch (error) {
    console.error("Saved tasks were corrupted, starting fresh.", error);
    return [];
  }
}

// ---------- Utility functions (functions, loops) ----------
function generateId(taskArray) {
  // for loop: walk every existing task once to find the highest id,
  // so a new task never reuses one.
  let maxId = 0;
  for (let i = 0; i < taskArray.length; i++) {
    if (taskArray[i].id > maxId) {
      maxId = taskArray[i].id;
    }
  }
  return maxId + 1;
}

function findTaskById(taskArray, id) {
  // while loop: manual linear search for the task with a matching id.
  let index = 0;
  while (index < taskArray.length) {
    if (taskArray[index].id === id) {
      return taskArray[index];
    }
    index++;
  }
  return null;
}

function escapeHtml(text) {
  // Route the text through the DOM's own escaping instead of
  // inserting raw user input into innerHTML.
  const holder = document.createElement("div");
  holder.textContent = text;
  return holder.innerHTML;
}

// ---------- Core task operations (objects, arrays) ----------
function addTask(text) {
  // Object: each task is a plain object with three properties.
  const newTask = {
    id: generateId(tasks),
    text: text,
    completed: false,
  };

  tasks.push(newTask); // array method: add to the end
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  // array method: filter returns a new array without the matching task
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}

function toggleComplete(id) {
  const task = findTaskById(tasks, id);

  if (task) {
    task.completed = !task.completed; // update a property on the object
    saveTasks();
    renderTasks();
  }
}

function editTaskText(id, newText) {
  const trimmed = newText.trim();
  const task = findTaskById(tasks, id);

  if (task && trimmed !== "") {
    task.text = trimmed;
    saveTasks();
    renderTasks();
  }
}

// ---------- Filtering ----------
function getFilteredTasks() {
  // else if chain: pick the array method that matches the active filter
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  } else {
    return tasks;
  }
}

function setFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach((btn) => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle("active", isActive);
  });

  renderTasks();
}

// ---------- Rendering / DOM manipulation ----------
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item" + (task.completed ? " completed" : "");
  li.dataset.id = task.id;

  // Template literal to build the row's inner markup in one piece.
  li.innerHTML = `
    <label class="task-checkbox">
      <input type="checkbox" ${task.completed ? "checked" : ""} aria-label="Mark task complete" />
    </label>
    <span class="task-text">${escapeHtml(task.text)}</span>
    <input type="text" class="task-edit-input hidden" value="${escapeHtml(task.text)}" />
    <div class="task-actions">
      <button type="button" class="btn-icon edit-btn">Edit</button>
      <button type="button" class="btn-icon save-btn hidden">Save</button>
      <button type="button" class="btn-icon delete-btn">Delete</button>
    </div>
  `;

  return li;
}

function renderTasks() {
  const visibleTasks = getFilteredTasks();

  taskList.innerHTML = ""; // clear and rebuild the list each render

  if (visibleTasks.length === 0) {
    emptyMessage.classList.remove("hidden");
  } else {
    emptyMessage.classList.add("hidden");
  }

  visibleTasks.forEach((task) => {
    const li = createTaskElement(task);
    taskList.appendChild(li);
  });
}

// ---------- Edit-mode helpers ----------
function enterEditMode(li) {
  li.classList.add("editing");
  li.querySelector(".task-text").classList.add("hidden");
  li.querySelector(".task-edit-input").classList.remove("hidden");
  li.querySelector(".edit-btn").classList.add("hidden");
  li.querySelector(".save-btn").classList.remove("hidden");
  li.querySelector(".task-edit-input").focus();
}

function saveEditMode(li, id) {
  const input = li.querySelector(".task-edit-input");
  editTaskText(id, input.value);
}

// ---------- Events: form submission + validation ----------
taskForm.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading

  const value = taskInput.value.trim();

  if (value === "") {
    formError.textContent = "Please enter a task before adding it.";
    taskInput.classList.add("invalid");
    return;
  }

  if (value.length > 120) {
    formError.textContent = "Task text must be under 120 characters.";
    taskInput.classList.add("invalid");
    return;
  }

  formError.textContent = "";
  taskInput.classList.remove("invalid");

  addTask(value);
  taskForm.reset();
  taskInput.focus();
});

// Events: input event clears the error as soon as the user starts fixing it
taskInput.addEventListener("input", () => {
  if (taskInput.classList.contains("invalid")) {
    taskInput.classList.remove("invalid");
    formError.textContent = "";
  }
});

// Events: filter buttons
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setFilter(btn.dataset.filter);
  });
});

// Events: edit / save / delete, handled once via event delegation
// on the shared parent instead of one listener per task row.
taskList.addEventListener("click", (event) => {
  const li = event.target.closest(".task-item");
  if (!li) {
    return;
  }

  const id = Number(li.dataset.id);

  if (event.target.matches(".delete-btn")) {
    deleteTask(id);
  } else if (event.target.matches(".edit-btn")) {
    enterEditMode(li);
  } else if (event.target.matches(".save-btn")) {
    saveEditMode(li, id);
  }
});

// Events: checkbox toggling (change event)
taskList.addEventListener("change", (event) => {
  if (event.target.matches('input[type="checkbox"]')) {
    const li = event.target.closest(".task-item");
    const id = Number(li.dataset.id);
    toggleComplete(id);
  }
});

// Events: keyboard event — press Enter while editing to save
taskList.addEventListener("keydown", (event) => {
  if (event.target.matches(".task-edit-input") && event.key === "Enter") {
    const li = event.target.closest(".task-item");
    const id = Number(li.dataset.id);
    saveEditMode(li, id);
  }
});

// ---------- Init ----------
function init() {
  tasks = loadTasks(); // retrieve tasks saved from a previous visit
  renderTasks();
}

init();
