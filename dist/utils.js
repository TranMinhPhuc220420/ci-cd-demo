/**
 * utils.js
 * Chứa các hàm thuần (pure functions) — không phụ thuộc DOM.
 * Tách riêng ra để dễ viết unit test (utils.test.js).
 */

/**
 * Tạo 1 task mới từ nội dung nhập vào.
 * @param {string} text
 * @returns {{id: string, text: string, done: boolean}}
 */
function createTask(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    throw new Error("Task text không được để trống");
  }
  return {
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    text: trimmed,
    done: false,
  };
}

/**
 * Tính thống kê từ danh sách task.
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
 * Toggle trạng thái done của 1 task theo id.
 * @param {Array} tasks
 * @param {string} id
 * @returns {Array}
 */
function toggleTask(tasks, id) {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

/**
 * Xoá 1 task theo id.
 * @param {Array} tasks
 * @param {string} id
 * @returns {Array}
 */
function removeTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}

// Hỗ trợ dùng chung cho cả trình duyệt (script.js) và Node (Jest)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { createTask, calculateStats, toggleTask, removeTask };
}
