import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PermissionIcons from './PermissionIcons';
import { toast } from 'react-toastify';
import { useUser } from "../../context/UserContext";

const FieldPermissions = () => {
      const user = useUser();
      const roleId = user.id;

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFields, setSelectedFields] = useState([]);
  const [currentForm, setCurrentForm] = useState('User');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`http://localhost:8000/api/roles/${roleId}/form-fields`, {  withCredentials: true});
        setFields(response.data.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load field permissions');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [roleId]);

  const handlePermissionChange = async (type, value, fieldId, formId) => {
    try {

         await axios.post(`http://localhost:8000/api/roles/update-field-permission`, {
            field_id: fieldId,
            role_id: roleId,
            form_id: formId,
            type,
            permission_id: value
        }, { withCredentials: true});
      
      toast.success('Field permission updated');
      
      // Update local state
      setFields(prevFields => 
        prevFields.map(field => {
          if (field.id === fieldId) {
            const updatedField = { ...field };
            if (type === 'view') {
              updatedField.permissions = updatedField.permissions || {};
              updatedField.permissions.view = value;
            } else if (type === 'edit') {
              updatedField.permissions = updatedField.permissions || {};
              updatedField.permissions.edit = value;
            }
            return updatedField;
          }
          return field;
        })
      );
    } catch (error) {
      toast.error('Failed to update field permission');
    }
  };

  const handleCheckboxChange = (fieldId, parentId, isChecked) => {
    let updatedSelectedFields = [...selectedFields];
    
    if (isChecked) {
      if (!updatedSelectedFields.includes(fieldId)) {
        updatedSelectedFields.push(fieldId);
      }
      
      // If this is a child, also select the parent if not already selected
      if (parentId !== 0 && !updatedSelectedFields.includes(parentId)) {
        updatedSelectedFields.push(parentId);
      }
    } else {
      // Remove field
      updatedSelectedFields = updatedSelectedFields.filter(id => id !== fieldId);
      
      // If this is a parent, remove all its children
      if (parentId === 0) {
        const childFields = fields.filter(f => f.parent_id === fieldId).map(f => f.id);
        updatedSelectedFields = updatedSelectedFields.filter(id => !childFields.includes(id));
      }
    }
    
    setSelectedFields(updatedSelectedFields);
  };

  const handleFormChange = (formName) => {
    setCurrentForm(formName);
    setSelectedFields([]);
  };

  const openBulkPermissionModal = () => {
    const parentId = selectedFields[0]; // Assuming we're selecting one parent at a time
    const selectedFieldsData = fields.filter(field => 
      selectedFields.includes(field.id) || field.parent_id === parentId
    );
    
    setModalData({
      parentId,
      fields: selectedFieldsData,
      roleId: roleId
    });
    setShowModal(true);
  };

  const filteredFields = fields.filter(field => {
    const form = fields.find(f => f.id === field.rp_form_id || field.parent_id === 0);
    return form?.form?.form_name === currentForm;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="card all-role-card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>
                    <button 
                      style={{ display: selectedFields.length > 0 ? 'block' : 'none' }} 
                      className="btn btn-primary btn-sm" 
                      onClick={openBulkPermissionModal}
                    >
                      Set Permission
                    </button>
                  </th>
                  <th style={{ textAlign: 'center' }}>Field Name</th>
                  <th style={{ textAlign: 'center' }}>View Permission</th>
                  <th style={{ textAlign: 'center' }}>Edit Permission</th>
                </tr>
              </thead>
              <tbody>
                {filteredFields.map(field => (
                  <tr key={field.id}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(field.id)}
                        onChange={(e) => handleCheckboxChange(
                          field.id, 
                          field.parent_id, 
                          e.target.checked
                        )}
                        data-id={field.parent_id === 0 ? field.id : field.parent_id}
                      />
                    </td>
                    <td>
                      {field.parent_id === 0 ? (
                        <b>Basic Information</b>
                      ) : (
                        field.field_name
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {field.parent_id !== 0 && (
                        <PermissionIcons
                          type="view"
                          currentValue={field.permissions?.view || 1}
                          onChange={handlePermissionChange}
                          fieldId={field.id}
                          formId={field.rp_form_id}
                          roleId={roleId}
                        />
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {field.parent_id !== 0 && (
                        <PermissionIcons
                          type="edit"
                          currentValue={field.permissions?.edit || 1}
                          onChange={handlePermissionChange}
                          fieldId={field.id}
                          formId={field.rp_form_id}
                          roleId={roleId}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="form-group">
            <label>Forms: </label>
            <select 
              className="form-control"
              value={currentForm}
              onChange={(e) => handleFormChange(e.target.value)}
            >
              {[...new Set(fields.map(f => f.form?.form_name).filter(Boolean))].map(formName => (
                <option key={formName} value={formName}>{formName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {showModal && modalData && (
        <SetPermissionModal
          data={modalData}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            // Handle bulk permission save
            console.log('Bulk save:', data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default FieldPermissions;