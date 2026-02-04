import TaskForm from "../components/TaskForm";

export default function NewTask() {
  return (
    <div className="task-form-page">
      <TaskForm refresh={() => window.location.href = "/dashboard"} />
    </div>
  );
}
