import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import { getTasks } from "../services/taskService";
import "../styles/Dashboard.css";


export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data.tasks || res.data);
    } catch (err) {
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Tasks</h1>
          <p className="dashboard-subtitle">Manage your workflow and stay productive</p>
        </div>
        <div className="stats-pill">
          Total Tasks: <strong>{tasks.length}</strong>
        </div>
      </header>

      {/* Status messages */}
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Fetching your tasks...</p>
        </div>
      )}
      
      {error && <div className="alert-error">{error}</div>}

      {/* Empty State */}
      {!loading && tasks.length === 0 && (
        <div className="empty-state">
          <h3>No tasks yet</h3>
          <p>Start by creating your first task to stay organized.</p>
          <button onClick={() => navigate("/tasks/new")} className="btn-primary">
            + Create First Task
          </button>
        </div>
      )}

      {/* Kanban Board */}
      {!loading && tasks.length > 0 && (
        <div className="task-board">
          {["High", "Medium", "Low"].map((priority) => {
            const filteredTasks = tasks.filter((t) => t.priority === priority);
            return (
              <div className="task-column" key={priority}>
                <div className={`column-header-line ${priority}`}></div>
                <h3 className="column-title">
                  {priority}
                  <span className="badge">{filteredTasks.length}</span>
                </h3>

                <div className="column-content">
                  {filteredTasks.map((task) => (
                    <TaskCard key={task._id} task={task} refresh={loadTasks} />
                  ))}
                  
                  {filteredTasks.length === 0 && (
                    <div className="column-empty">
                      No {priority.toLowerCase()} priority tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}