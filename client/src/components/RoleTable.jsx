import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const RoleTable = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState([]);

  useEffect(() => {
    fetchPermissions();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/roles`, {
        withCredentials: true,
      });
      setRoles(res.data.data);
    } catch (error) {
      console.error("Error fetching roles", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/permissions`, {
        withCredentials: true,
      });
      setAvailablePermissions(res.data.data); // [{id: 1, name: "View Tickets"}, ...]
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/roles/${selectedRole.id}`,
        selectedRole,
        { withCredentials: true }
      );
      alert("Role updated!");
      setShowEditModal(false);
      fetchRoles();
    } catch (err) {
      alert("Update failed!");
    }
  };

  const handleChange = (field, value) => {
    setSelectedRole((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = async (id) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/roles/${id}`, {
        withCredentials: true,
      });
      const role = res.data.data;
      role.permissions = JSON.parse(role.permissions || "[]");
      setSelectedRole(role);
      setShowEditModal(true);
    } catch (err) {
      alert("Failed to load role details");
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm(`Are you sure you want to delete role ID: ${id}?`)) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/roles/${id}`, {
          withCredentials: true,
        });
        alert("Role deleted!");
        fetchRoles();
      } catch (err) {
        alert("Failed to delete role.");
      }
    }
  };

  const togglePermission = (permId) => {
    const updated = selectedRole.permissions.includes(permId)
      ? selectedRole.permissions.filter((p) => p !== permId)
      : [...selectedRole.permissions, permId];
    handleChange("permissions", updated);
  };

  const columns = [
    { name: "Role Name", selector: (row) => row.role_name, sortable: true },
    {
      name: "Import",
      cell: (row) => <span>{row.import === "1" ? "Yes" : "No"}</span>,
    },
    {
      name: "Export",
      cell: (row) => <span>{row.export === "1" ? "Yes" : "No"}</span>,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleEditClick(row.id)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteClick(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Roles</h2>
      <DataTable
        columns={columns}
        data={roles}
        progressPending={loading}
        pagination
        striped
      />

      {/* Edit Modal */}
      {showEditModal && selectedRole && (
        <div
          className="modal show"
          style={{ display: "block", background: "#000000a3" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header">
                  <h5>Edit Role</h5>
                  <button
                    onClick={() => setShowEditModal(false)}
                    type="button"
                    className="close"
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <label>Role Name</label>
                  <input
                    type="text"
                    value={selectedRole.role_name}
                    onChange={(e) => handleChange("role_name", e.target.value)}
                    className="form-control"
                  />

                  {["view", "edit", "add", "delete"].map((field) => (
                    <div key={field}>
                      <label>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="number"
                        value={selectedRole[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        className="form-control"
                      />
                    </div>
                  ))}

                  <label>Import</label>
                  <select
                    value={selectedRole.import}
                    onChange={(e) => handleChange("import", e.target.value)}
                    className="form-control"
                  >
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>

                  <label>Export</label>
                  <select
                    value={selectedRole.export}
                    onChange={(e) => handleChange("export", e.target.value)}
                    className="form-control"
                  >
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label>Permissions</label>
                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      padding: "10px",
                    }}
                  >
                    {availablePermissions.map((perm) => (
                      <div key={perm.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={perm.id}
                            checked={selectedRole.permissions.includes(perm.id)}
                            onChange={() => togglePermission(perm.id)}
                          />
                          &nbsp;{perm.permission_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">
                    Update
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleTable;
