import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const emptyForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: "user",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadUsers() {
    try {
      const data = await apiRequest("/users");
      setUsers(data.users);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    apiRequest("/users")
      .then((data) => {
        if (!cancelled) {
          setUsers(data.users);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(error.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function startEdit(user) {
    setEditingId(user.id);

    setForm({
      name: user.name,
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });

    setError("");
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      if (editingId) {
        const updateData = {
          name: form.name,
          username: form.username,
          email: form.email,
          role: form.role,
        };

        if (form.password) {
          updateData.password = form.password;
        }

        await apiRequest(`/users/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(updateData),
        });

        setMessage("User updated successfully.");
      } else {
        await apiRequest("/users", {
          method: "POST",
          body: JSON.stringify(form),
        });

        setMessage("User created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadUsers();
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>User Management</h1>
        <p>Create and update application users.</p>
      </div>

      <div className="card form-card">
        <h2>
          {editingId ? "Edit User" : "Create User"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Username</label>

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              Password
              {editingId && " (leave blank to keep current password)"}
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!editingId}
            />
          </div>

          {error && (
            <p className="error-message">{error}</p>
          )}

          {message && (
            <p className="success-message">{message}</p>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update User"
                  : "Create User"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  <button
                    onClick={() => startEdit(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}