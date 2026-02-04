import API from "./api";

// Create task
export const createTask = (taskData) => {
  return API.post("/tasks", taskData);
};

// Get all tasks (with pagination support)
export const getTasks = (page = 1, limit = 10) => {
  return API.get(`/tasks?page=${page}&limit=${limit}`);
};

// Get single task
export const getTaskById = (id) => {
  return API.get(`/tasks/${id}`);
};

// Update task
export const updateTask = (id, updatedData) => {
  return API.put(`/tasks/${id}`, updatedData);
};

// Delete task
export const deleteTask = (id) => {
  return API.delete(`/tasks/${id}`);
};

// Update task status
export const updateTaskStatus = (id, status) => {
  return API.patch(`/tasks/${id}/status`, { status });
};

// Update task priority
export const updateTaskPriority = (id, priority) => {
  return API.patch(`/tasks/${id}/priority`, { priority });
};
