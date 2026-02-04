import { useState } from "react";
import { deleteTask, updateTaskStatus } from "../services/taskService";
import { Link } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";
import Select from "react-select";
import "../styles/TaskCard.css";

export default function TaskCard({ task, refresh }) {
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "Pending", label: "Pending", color: "#ffa500" },
    { value: "In Progress", label: "In Progress", color: "#007bff" },
    { value: "Completed", label: "Completed", color: "#28a745" },
  ];

  const handleStatusChange = async (selectedOption) => {
    try {
      await updateTaskStatus(task._id, selectedOption.value);
      refresh();
    } catch {
      alert("Failed to update status");
    }
  };

  
  const customStyles = {
    control: (base) => ({
      ...base,
      minWidth: "140px",
      height: "38px",
      minHeight: "38px",
      fontSize: "14px",
      borderRadius: "8px",
      cursor: "pointer",
      border: "1px solid #e2e8f0",
      backgroundColor: "#f8fafc",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#6366f1",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
      height: "38px",
      display: "flex",
      alignItems: "center",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "38px",
    }),
    option: (base, { data, isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected 
        ? data.color 
        : isFocused ? `${data.color}22` : "transparent",
      color: isSelected ? "#fff" : isFocused ? data.color : "#333",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "14px",
    }),
  };

  const statusClass = task.status.toLowerCase().replace(/\s+/g, '-');

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      setLoading(true);
      await deleteTask(task._id);
      refresh();
    } catch {
      alert("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`task-card ${task.priority}`}>
      <div className="task-header">
        <h4 title={task.title}>{task.title}</h4>
        <span className={`status-pill ${statusClass}`}>{task.status}</span>
      </div>

      <p className="task-desc">{task.description || "No description"}</p>

      <p className="task-date">
        Due: {task.dueDate ? task.dueDate.slice(0, 10) : "N/A"}
      </p>

      <div className="task-actions">
        <div className="select-container">
          <Select
            options={statusOptions}
            value={statusOptions.find((opt) => opt.value === task.status)}
            onChange={handleStatusChange}
            styles={customStyles}
            isSearchable={false}
            menuPortalTarget={document.body}
            menuPosition={"fixed"}
          />
        </div>

        <Link to={`/tasks/${task._id}`} className="view-btn">
          <FaEye /> View
        </Link>

        <button 
          className="delete-btn" 
          onClick={handleDelete} 
          disabled={loading}
        >
          <FaTrash /> {loading ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
}