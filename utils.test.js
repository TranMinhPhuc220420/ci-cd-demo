const { createTask, calculateStats, toggleTask, removeTask } = require("./utils");

describe("createTask", () => {
  test("tạo task hợp lệ với text đúng", () => {
    const task = createTask("Học GitHub Actions");
    expect(task.text).toBe("Học GitHub Actions");
    expect(task.done).toBe(false);
    expect(task.id).toBeDefined();
  });

  test("trim khoảng trắng thừa", () => {
    const task = createTask("   Deploy app   ");
    expect(task.text).toBe("Deploy app");
  });

  test("throw lỗi khi text rỗng", () => {
    expect(() => createTask("")).toThrow();
    expect(() => createTask("   ")).toThrow();
  });
});

describe("calculateStats", () => {
  test("tính đúng total/done/pending", () => {
    const tasks = [
      { done: true },
      { done: false },
      { done: true },
      { done: false },
    ];
    expect(calculateStats(tasks)).toEqual({ total: 4, done: 2, pending: 2 });
  });

  test("trả về 0 khi mảng rỗng", () => {
    expect(calculateStats([])).toEqual({ total: 0, done: 0, pending: 0 });
  });

  test("xử lý input không hợp lệ (không phải mảng)", () => {
    expect(calculateStats(null)).toEqual({ total: 0, done: 0, pending: 0 });
  });
});

describe("toggleTask", () => {
  test("đảo trạng thái done đúng task theo id", () => {
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
  test("xoá đúng task theo id", () => {
    const tasks = [{ id: "1" }, { id: "2" }];
    const result = removeTask(tasks, "1");
    expect(result).toEqual([{ id: "2" }]);
  });
});
