import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/CreateRoleForm.css';

const CreateRoleForm = () => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [formFields, setFormFields] = useState({
    view: 1,
    edit: 1,
    add: 1,
    delete: 1,
    import: 0,
    export: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/permissions', { withCredentials: true });
      setAvailablePermissions(res.data.data);
    } catch (err) {
      console.error("Failed to load permissions", err);
    }
  };

  const handleCheckboxChange = (permId) => {
    setPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const handleFieldChange = (field, value) => {
    setFormFields({ ...formFields, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (permissions.length === 0) {
      setError("Please select at least one permission.");
      return;
    }

    try {
      const payload = {
        role_name: roleName,
        permissions,
        ...formFields,
      };

      const response = await axios.post('http://localhost:8000/api/roles/add', payload, { withCredentials: true });
     
      setRoleName('');
      setPermissions([]);
      setFormFields({ view: 1, edit: 1, add: 1, delete: 1, import: 0, export: 0 });
      setError('');
      // onSuccess();
    } catch (err) {
   
      setError(err.response?.data?.message || 'Error creating role');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Role</h3>

      <div>
        <label>Role Name:</label>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>View:</label>
        <input type="number" value={formFields.view} onChange={(e) => handleFieldChange('view', parseInt(e.target.value))} />
      </div>

      <div>
        <label>Edit:</label>
        <input type="number" value={formFields.edit} onChange={(e) => handleFieldChange('edit', parseInt(e.target.value))} />
      </div>

      <div>
        <label>Add:</label>
        <input type="number" value={formFields.add} onChange={(e) => handleFieldChange('add', parseInt(e.target.value))} />
      </div>

      <div>
        <label>Delete:</label>
        <input type="number" value={formFields.delete} onChange={(e) => handleFieldChange('delete', parseInt(e.target.value))} />
      </div>

      <div>
        <label>Import:</label>
        <select value={formFields.import} onChange={(e) => handleFieldChange('import', parseInt(e.target.value))}>
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </select>
      </div>

      <div>
        <label>Export:</label>
        <select value={formFields.export} onChange={(e) => handleFieldChange('export', parseInt(e.target.value))}>
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </select>
      </div>

      <div>
        <label>Permissions:</label>
        <div className="permissions-list">
          {availablePermissions.map((perm) => (
            <div key={perm.id}>
              <label>
                <input
                  type="checkbox"
                  value={perm.id}
                  checked={permissions.includes(perm.id)}
                  onChange={() => handleCheckboxChange(perm.id)}
                />
                &nbsp;{perm.permission_name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button type="submit">Add Role</button>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default CreateRoleForm;
