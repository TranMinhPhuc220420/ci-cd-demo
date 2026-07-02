/**
 * script.js
 * Xử lý tương tác DOM + lưu trữ localStorage.
 * Dùng các hàm thuần từ utils.js để dễ tách test.
 */

const STORAGE_KEY = "cicd-demo-tasks";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const statTotal = document.getElementById("stat-total");
const statDone = document.getElementById("stat-done");
const statPending = document.getElementById("stat-pending");

let tasks = loadTasks();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Không thể đọc localStorage:", e);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.done ? " done" : "");
    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} data-id="${task.id}" class="task-item__checkbox" />
      <span class="task-item__text">${escapeHtml(task.text)}</span>
      <button class="task-item__delete" data-id="${task.id}">Xoá</button>
    `;
    list.appendChild(li);
  });

  const stats = calculateStats(tasks);
  statTotal.textContent = stats.total;
  statDone.textContent = stats.done;
  statPending.textContent = stats.pending;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    const task = createTask(input.value);
    tasks.push(task);
    saveTasks();
    render();
    input.value = "";
  } catch (err) {
    console.warn(err.message);
  }
});

list.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("task-item__checkbox")) {
    tasks = toggleTask(tasks, id);
    saveTasks();
    render();
  }

  if (e.target.classList.contains("task-item__delete")) {
    tasks = removeTask(tasks, id);
    saveTasks();
    render();
  }
});

render();
