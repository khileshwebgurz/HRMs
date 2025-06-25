import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const RoleTable = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
const [availablePermissions, setAvailablePermissions] = useState([]);


  useEffect(() => {
    fetchPermissions()
  },[]);
  useEffect(() => {
    fetchRoles();

    const handleClick = (event) => {
      const target = event.target.closest('a');
      if (!target) return;

      if (target.classList.contains('edit-role')) {
        const id = target.getAttribute('data-id');
        fetchRoleDetails(id);
      } else if (target.classList.contains('delete-role')) {
        const id = target.getAttribute('data-id');
        if (window.confirm('Are you sure to delete role ID: ' + id + '?')) {
          deleteRole(id);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/roles', { withCredentials: true });
      setRoles(res.data.data);
    } catch (error) {
      console.error('Error fetching roles', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/roles/${id}`, { withCredentials: true });
      const role = res.data.data;
      role.permissions = JSON.parse(role.permissions || '[]');
      setSelectedRole(role);
      setShowEditModal(true);
    } catch (err) {
      alert('Failed to load role details');
    }
  };

  const fetchPermissions = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/permissions', { withCredentials: true });
    setAvailablePermissions(res.data.data); // [{id: 1, name: "View Tickets"}, ...]
  } catch (err) {
    console.error("Failed to fetch permissions", err);
  }
};


  const deleteRole = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/roles/${id}`, { withCredentials: true });
      alert('Role deleted!');
      fetchRoles();
    } catch (err) {
      alert('Failed to delete role.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/roles/${selectedRole.id}`, selectedRole, { withCredentials: true });
      alert('Role updated!');
      setShowEditModal(false);
      fetchRoles();
    } catch (err) {
      alert('Update failed!');
    }
  };

  const handleChange = (field, value) => {
    setSelectedRole(prev => ({ ...prev, [field]: value }));
  };

  const columns = [
    { name: 'Role Name', selector: row => row.role_name, sortable: true },
    { name: 'Import', cell: row => <div dangerouslySetInnerHTML={{ __html: row.import }} /> },
    { name: 'Export', cell: row => <div dangerouslySetInnerHTML={{ __html: row.export }} /> },
    { name: 'Actions', cell: row => <div dangerouslySetInnerHTML={{ __html: row.actions }} /> },
  ];


  return (
    <div>
      <h2>Roles</h2>
      <DataTable columns={columns} data={roles} progressPending={loading} pagination striped />

      {/* Edit Modal */}
      {showEditModal && selectedRole && (
        <div className="modal show" style={{ display: 'block', background: '#000000a3' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header">
                  <h5>Edit Role</h5>
                  <button onClick={() => setShowEditModal(false)} type="button" className="close">×</button>
                </div>
                <div className="modal-body">
                  <label>Role Name</label>
                  <input type="text" value={selectedRole.role_name} onChange={(e) => handleChange('role_name', e.target.value)} className="form-control" />

                  <label>View</label>
                  <input type="number" value={selectedRole.view} onChange={(e) => handleChange('view', e.target.value)} className="form-control" />

                  <label>Edit</label>
                  <input type="number" value={selectedRole.edit} onChange={(e) => handleChange('edit', e.target.value)} className="form-control" />

                  <label>Add</label>
                  <input type="number" value={selectedRole.add} onChange={(e) => handleChange('add', e.target.value)} className="form-control" />

                  <label>Delete</label>
                  <input type="number" value={selectedRole.delete} onChange={(e) => handleChange('delete', e.target.value)} className="form-control" />

                  <label>Import</label>
                  <select value={selectedRole.import} onChange={(e) => handleChange('import', e.target.value)} className="form-control">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>

                  <label>Export</label>
                  <select value={selectedRole.export} onChange={(e) => handleChange('export', e.target.value)} className="form-control">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                    <label>Permissions</label>
                      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                        {availablePermissions.map((perm) => (
                          <div key={perm.id}>
                            <label>
                              <input
                                type="checkbox"
                                value={perm.id}
                                checked={selectedRole.permissions.includes(perm.id)}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  const updated = e.target.checked
                                    ? [...selectedRole.permissions, value]
                                    : selectedRole.permissions.filter(p => p !== value);
                                  handleChange('permissions', updated);
                                }}
                              />
                              &nbsp;{perm.permission_name}
                            </label>
                          </div>
                        ))}
                      </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">Update</button>
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
