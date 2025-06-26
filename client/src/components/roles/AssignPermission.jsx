import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from "../../context/UserContext";

const AssignPermission = () => {

      const user = useUser();
          const roleId = user.id;

  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/roles/${roleId}/module-permissions`, {  withCredentials: true});
        setPermissions(response.data.permissions);
        setSelectedPermissions(response.data.role_permissions.map(Number));
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load permissions');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [roleId]);

  const handleCheckboxChange = (permissionId, parentId, isChecked) => {
    let updatedPermissions = [...selectedPermissions];
    
    if (isChecked) {
      // Add permission if not already in array
      if (!updatedPermissions.includes(permissionId)) {
        updatedPermissions.push(permissionId);
      }
      
      // If this is a child, also select the parent if not already selected
      if (parentId !== 0 && !updatedPermissions.includes(parentId)) {
        updatedPermissions.push(parentId);
      }
    } else {
      // Remove permission
      updatedPermissions = updatedPermissions.filter(id => id !== permissionId);
      
      // If this is a parent, remove all its children
      if (parentId === 0) {
        const childPermissions = permissions.filter(p => p.parent_id === permissionId).map(p => p.id);
        updatedPermissions = updatedPermissions.filter(id => !childPermissions.includes(id));
      }
    }
    
    setSelectedPermissions(updatedPermissions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await axios.post(`http://localhost:8000/api/roles/update-module-permissions`, {
             role_id: roleId,
            permissions: selectedPermissions
        }, { withCredentials: true});

      toast.success('Module permissions updated successfully');
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="card all-role-card">
        <div className="card-body">
          <div className="table-responsive">
            <form onSubmit={handleSubmit}>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}></th>
                    <th>Module Name</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map(permission => (
                    <tr key={permission.id}>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className={permission.parent_id === 0 ? `parent${permission.id}` : `checkBoxClass${permission.parent_id}`}
                          name={`status[${permission.id}]`}
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={(e) => handleCheckboxChange(
                            permission.id, 
                            permission.parent_id, 
                            e.target.checked
                          )}
                          data-id={permission.parent_id === 0 ? permission.id : permission.parent_id}
                        />
                      </td>
                      <td>
                        {permission.parent_id === 0 ? (
                          <b>{permission.permission_name}</b>
                        ) : (
                          permission.permission_name
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                type="submit" 
                className="mb-3 mt-3 btn btn-success float-right site-main-btn"
              >
                Save Permissions
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignPermission;