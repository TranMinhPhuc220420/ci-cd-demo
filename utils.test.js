const { createTask, calculateStats, toggleTask, removeTask } = require("./utils");

describe("createTask", () => {
  test("creates a valid task with the correct text", () => {
    const task = createTask("Learn GitHub Actions");
    expect(task.text).toBe("Learn GitHub Actions");
    expect(task.done).toBe(false);
    expect(task.id).toBeDefined();
  });

  test("trims extra whitespace", () => {
    const task = createTask("   Deploy app   ");
    expect(task.text).toBe("Deploy app");
  });

  test("throws an error when the text is empty", () => {
    expect(() => createTask("")).toThrow();
    expect(() => createTask("   ")).toThrow();
  });
});

describe("calculateStats", () => {
  test("computes total/done/pending correctly", () => {
    const tasks = [
      { done: true },
      { done: false },
      { done: true },
      { done: false },
    ];
    expect(calculateStats(tasks)).toEqual({ total: 4, done: 2, pending: 2 });
  });

  test("returns 0 for an empty array", () => {
    expect(calculateStats([])).toEqual({ total: 0, done: 0, pending: 0 });
  });

  test("handles invalid input (not an array)", () => {
    expect(calculateStats(null)).toEqual({ total: 0, done: 0, pending: 0 });
  });
});

describe("toggleTask", () => {
  test("toggles the done state of the correct task by id", () => {
    const tasks = [
      { id: "1", done: false },
      { id: "2", done: false },
    ];
    const result = toggleTask(tasks, "1");
    expect(result.find((t) => t.id === "1").done).toBe(true);
    expect(result.find((t) => t.id === "2").done).toBe(false);
  });
});

describe("removeTask", () => {
  test("removes the correct task by id", () => {
    const tasks = [{ id: "1" }, { id: "2" }];
    const result = removeTask(tasks, "1");
    expect(result).toEqual([{ id: "2" }]);
  });
});
