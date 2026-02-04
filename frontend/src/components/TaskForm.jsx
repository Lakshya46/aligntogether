import { useState } from "react";
import { createTask } from "../services/taskService";
import { FaPlus, FaCalendarAlt, FaFlag } from "react-icons/fa";
import Select from "react-select";
import "../styles/TaskForm.css";

export default function TaskForm({ refresh }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const priorityOptions = [
    { value: "High", label: "High Priority", color: "#e11d48" },
    { value: "Medium", label: "Medium Priority", color: "#d97706" },
    { value: "Low", label: "Low Priority", color: "#10b981" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePriorityChange = (selectedOption) => {
    setForm({ ...form, priority: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) {
      setError("Title and due date are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createTask(form);
      setForm({ title: "", description: "", dueDate: "", priority: "Medium" });
      refresh();
    } catch {
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      height: "52px", 
      borderRadius: "12px",
      paddingLeft: "35px", 
      background: state.isFocused ? "#fff" : "#f8fafc",
      border: state.isFocused ? "1.5px solid #6366f1" : "1.5px solid #e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(99, 102, 241, 0.15)" : "none",
      transition: "all 0.25s ease",
      "&:hover": { borderColor: "#6366f1" }
    }),
    valueContainer: (base) => ({ ...base, padding: "0 8px" }),
    placeholder: (base) => ({ ...base, color: "#94a3b8" }),
    option: (base, { isFocused, isSelected, data }) => ({
      ...base,
      backgroundColor: isSelected ? "#6366f1" : isFocused ? "#f0f1ff" : "#fff",
      color: isSelected ? "#fff" : isFocused ? "#6366f1" : "#334155",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.95rem"
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 })
  };

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h3>
          <FaPlus className="form-icon icon-add" /> Add New Task
        </h3>
        <span className="task-form-hint">Create and organize your work efficiently</span>
      </div>

      {error && <p className="form-error">{error}</p>}

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
          autoFocus
        />

        <textarea
          name="description"
          placeholder="Task description (optional)"
          value={form.description}
          onChange={handleChange}
          rows="5"
        />

        <div className="form-row">
          <div className="input-icon">
            <FaCalendarAlt className="icon-date" size={16} style={{ zIndex: 5 }} />
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="input-icon">
            <FaFlag className="icon-priority" size={16} style={{ zIndex: 5 }} />
            <Select
              options={priorityOptions}
              value={priorityOptions.find((opt) => opt.value === form.priority)}
              onChange={handlePriorityChange}
              styles={customSelectStyles}
              isSearchable={false}
              menuPortalTarget={document.body}
              menuPosition={'fixed'}
              className="react-select-container"
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}