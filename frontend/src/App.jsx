import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the guard

import Dashboard from "./pages/Dashboard";
import TaskDetail from "./pages/TaskDetail";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx";
import NewTask from "./pages/NewTask";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
       
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/tasks/new" element={<NewTask />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}