import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTasks, FaSignOutAlt, FaPlus, FaColumns, FaBars, FaTimes } from "react-icons/fa";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    navigate("/");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
     
        <div className="navbar-brand" onClick={() => { navigate("/dashboard"); setIsOpen(false); }}>
          <div className="logo-box">
            <FaTasks className="logo-icon" />
          </div>
          <span className="brand-name">Task<span>ly</span></span>
        </div>

        {token && (
          <>
         
            <button className="mobile-menu-toggle" onClick={toggleMenu}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>

          
            <div className={`navbar-content ${isOpen ? "active" : ""}`}>
              <ul className="nav-menu">
                <li>
                  <Link to="/dashboard" className="nav-item" onClick={() => setIsOpen(false)}>
                    <FaColumns className="nav-icon" />
                    <span>Dashboard</span>
                  </Link>
                </li>
              </ul>

              <div className="nav-actions">
                <Link to="/tasks/new" className="btn-primary" onClick={() => setIsOpen(false)}>
                  <FaPlus className="btn-icon" />
                  <span>New Task</span>
                </Link>
                
                <div className="divider"></div>

                <button onClick={logout} className="btn-logout">
                  <FaSignOutAlt className="btn-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}