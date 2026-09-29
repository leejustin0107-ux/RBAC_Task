import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../context/UseAuth";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <strong>RBAC</strong>
        </div>

        <nav className="nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          {user?.role === "admin" && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              User Management
            </NavLink>
          )}

          {user?.role === "manager" && (
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Reports
            </NavLink>
          )}
        </nav>

        <div className="header-user">
          <span>
            {user?.name} ({user?.role})
          </span>

          <button
            className="secondary-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}