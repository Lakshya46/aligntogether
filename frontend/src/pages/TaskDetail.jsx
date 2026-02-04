import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaArrowLeft, FaCalendarAlt, FaInfoCircle, FaCheckCircle, FaFlag } from "react-icons/fa";
import Select from "react-select";
import "../styles/TaskDetail.css";
import { getTaskById, updateTask, deleteTask } from "../services/taskService";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  
  const priorityOptions = [
    { value: "High", label: "High Priority", color: "#e11d48" },
    { value: "Medium", label: "Medium Priority", color: "#d97706" },
    { value: "Low", label: "Low Priority", color: "#10b981" },
  ];

  const statusOptions = [
    { value: "Pending", label: "Pending", color: "#64748b" },
    { value: "In Progress", label: "In Progress", color: "#3b82f6" },
    { value: "Completed", label: "Completed", color: "#10b981" },
  ];


  const selectStyles = {
    control: (base, state) => ({
      ...base,
      height: "50px",
      borderRadius: "12px",
      background: state.isFocused ? "#fff" : "#f8fafc",
      border: state.isFocused ? "1.5px solid #6366f1" : "1.5px solid #e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(99, 102, 241, 0.15)" : "none",
      transition: "all 0.25s ease",
      fontSize: "16px", // Prevents mobile zoom
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#6366f1" : isFocused ? "#f0f1ff" : "#fff",
      color: isSelected ? "#fff" : "#334155",
      cursor: "pointer",
      fontWeight: "600",
      padding: "12px",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      zIndex: 20
    })
  };

  const loadTask = async () => {
    try {
      setLoading(true);
      const res = await getTaskById(id);
      setTask(res.data);
    } catch (err) {
      setError("Failed to load task details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

 
  const handleSelectChange = (selectedOption, field) => {
    setTask({ ...task, [field]: selectedOption.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Destructure to remove MongoDB internal fields before sending to API
      const { _id, __v, createdAt, updatedAt, user, ...cleanData } = task;
      await updateTask(id, cleanData); 
      setEditMode(false);
      await loadTask(); 
    } catch (err) {
      alert("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this task permanently?")) return;
    deleteTask(id)
      .then(() => navigate("/dashboard"))
      .catch(() => alert("Delete failed"));
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (error) return <div className="error-screen"><p>{error}</p><button onClick={() => navigate("/dashboard")}>Go Back</button></div>;

  return (
    <div className="detail-page-wrapper">
      <div className="detail-card">
        <div className="detail-header">
          <h3 className="detail-main-title">{editMode ? "Edit Task" : "Task Overview"}</h3>
        </div>

        {!editMode ? (
          <div className="view-content">
            <div className="detail-section">
              <label><FaInfoCircle /> Title</label>
              <h3 className="view-title">{task.title}</h3>
            </div>

            <div className="detail-section">
              <label><FaInfoCircle /> Description</label>
              <p className="desc-text">{task.description || "No description provided."}</p>
            </div>

            <div className="detail-grid">
              <div className="detail-section">
                <label><FaCalendarAlt /> Due Date</label>
                <p className="view-data">{task.dueDate ? task.dueDate.split('T')[0] : "N/A"}</p>
              </div>

              <div className="detail-section">
                <label><FaFlag /> Priority</label>
                <div>
                    <span className={`prio-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
              </div>

              <div className="detail-section">
                <label><FaCheckCircle /> Status</label>
                <div>
                    <span className={`status-badge ${task.status.toLowerCase().replace(/\s+/g, '-')}`}>{task.status}</span>
                </div>
              </div>
            </div>

            <div className="detail-footer-actions">
              <button className="btn-edit-mode" onClick={() => setEditMode(true)}>
                <FaEdit /> Edit Task
              </button>
              <button className="btn-delete-mode" onClick={handleDelete}>
                <FaTrash /> Delete Task
              </button>
              <button className="btn-back" onClick={() => navigate("/dashboard")}>
                <FaArrowLeft /> Back 
              </button>
            </div>
          </div>
        ) : (
          <form className="modern-edit-form" onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Task Title</label>
              <input 
                name="title" 
                type="text"
                value={task.title} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description" 
                value={task.description} 
                onChange={handleChange} 
                rows="4" 
              />
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  name="dueDate" 
                  value={task.dueDate ? task.dueDate.split('T')[0] : ""} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Priority</label>
                <Select
                  options={priorityOptions}
                  value={priorityOptions.find(opt => opt.value === task.priority)}
                  onChange={(opt) => handleSelectChange(opt, 'priority')}
                  styles={selectStyles}
                  isSearchable={false}
                  menuPortalTarget={document.body}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <Select
                  options={statusOptions}
                  value={statusOptions.find(opt => opt.value === task.status)}
                  onChange={(opt) => handleSelectChange(opt, 'status')}
                  styles={selectStyles}
                  isSearchable={false}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>

            <div className="form-actions-sticky">
              <button className="btn-save" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button className="btn-secondary" type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}