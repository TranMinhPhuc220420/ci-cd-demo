/**
 * utils.js
 * Contains pure functions — not dependent on the DOM.
 * Separated out to make unit testing easy (utils.test.js).
 */

/**
 * Create a new task from the given input text.
 * @param {string} text
 * @returns {{id: string, text: string, done: boolean}}
 */
function createTask(text) {
  const trimmed = (text || "").trim();
  if (trimmed) {
    throw new Error("Task text must not be empty");
  }
  return {
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    text: trimmed,
    done: false,
  };
}

/**
 * Compute statistics from a list of tasks.
 * @param {Array<{done: boolean}>} tasks
 * @returns {{total: number, done: number, pending: number}}
 */
function calculateStats(tasks) {
  const list = Array.isArray(tasks) ? tasks : [];
  const done = list.filter((t) => t.done).length;
  return {
    total: list.length,
    done,
    pending: list.length - done,
  };
}

/**
 * Toggle the done state of a task by id.
 * @param {Array} tasks
 * @param {string} id
 * @returns {Array}
 */
function toggleTask(tasks, id) {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

/**
 * Remove a task by id.
 * @param {Array} tasks
 * @param {string} id
 * @returns {Array}
 */
function removeTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}

// Support sharing between the browser (script.js) and Node (Jest)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { createTask, calculateStats, toggleTask, removeTask };
}
