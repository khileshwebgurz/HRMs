import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PermissionIcons from './PermissionIcons';
import { toast } from 'react-toastify';

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/roles`, {  withCredentials: true})

        console.log(response, 'res');
        setRoles(response.data.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load roles');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handlePermissionChange = async (roleId, type, value) => {
    try {
      let data = { role_id: roleId, type };
      
      if (type === 'import' || type === 'export') {
        data.value = value === 1 ? false : true; // Toggle
      } else {
        data.permission_id = value;
      }
      
      await axios.post(`http://localhost:8000/api/roles/update-permission`, {data}, { withCredentials: true});
      
      // Update local state
      setRoles(prevRoles => 
        prevRoles.map(role => {
          if (role.id === roleId) {
            return { ...role, [type]: value };
          }
          return role;
        })
      );
      
      toast.success('Role permission updated');
    } catch (error) {
      toast.error('Failed to update role permission');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="card all-role-card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>View</th>
                  <th>Edit</th>
                  <th>Add</th>
                  <th>Delete</th>
                  <th>Module</th>
                  <th>Import</th>
                  <th>Export</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role.id}>
                    <td>{role.role_name}</td>
                    <td>
                      <PermissionIcons
                        type="view"
                        currentValue={role.view || 1}
                        onChange={(type, value) => handlePermissionChange(role.id, type, value)}
                        roleId={role.id}
                      />
                    </td>
                    <td>
                      <PermissionIcons
                        type="edit"
                        currentValue={role.edit || 1}
                        onChange={(type, value) => handlePermissionChange(role.id, type, value)}
                        roleId={role.id}
                      />
                    </td>
                    <td>
                      <PermissionIcons
                        type="add"
                        currentValue={role.add || 1}
                        onChange={(type, value) => handlePermissionChange(role.id, type, value)}
                        roleId={role.id}
                      />
                    </td>
                    <td>
                      <PermissionIcons
                        type="delete"
                        currentValue={role.delete || 1}
                        onChange={(type, value) => handlePermissionChange(role.id, type, value)}
                        roleId={role.id}
                      />
                    </td>
                    <td>
                      <Link 
                        to={`/roles/${role.id}/module-permissions`}
                        title="assign permission"
                      >
                        <img src="/icons/module.png" alt="" />
                      </Link>
                    </td>
                    <td>
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePermissionChange(role.id, 'import', role.import === '1' ? 0 : 1);
                        }}
                        title={role.import === '1' ? 'yes' : 'no'}
                      >
                        <img 
                          src={role.import === '1' ? '/icons/tick-icon.png' : '/icons/cross-icon.png'} 
                          alt="" 
                        />
                      </a>
                    </td>
                    <td>
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePermissionChange(role.id, 'export', role.export === '1' ? 0 : 1);
                        }}
                        title={role.export === '1' ? 'yes' : 'no'}
                      >
                        <img 
                          src={role.export === '1' ? '/icons/tick-icon.png' : '/icons/cross-icon.png'} 
                          alt="" 
                        />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleList;