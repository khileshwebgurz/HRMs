import React, { useState } from 'react';
import { toast } from 'react-toastify';

const SetPermissionModal = ({ data, onClose, onSave }) => {
  const [viewPermission, setViewPermission] = useState(1);
  const [editPermission, setEditPermission] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editPermission > viewPermission) {
      toast.error('Edit Permission cannot be greater than View Permission');
      return;
    }
    
    onSave({
      role_id: data.roleId,
      form_id: data.fields[0]?.rp_form_id,
      field_id: data.fields.map(f => f.id),
      view: viewPermission,
      edit: editPermission
    });
  };

  return (
    <div className="modal show" style={{ display: 'block' }} role="dialog">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h4 className="modal-title">Set Permission for {data.role?.role_name}</h4>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-3 d-flex align-items-center">
                  View Permission
                </div>
                <div className="col-md-8">
                  <div className="roles-list-permission">
                    {[1, 2, 3, 4, 5].map(value => (
                      <div key={`view-${value}`} style={{ display: 'inline-block' }}>
                        <input
                          type="radio"
                          name="view"
                          id={`view-${value}`}
                          value={value}
                          checked={viewPermission === value}
                          onChange={() => setViewPermission(value)}
                          style={{ opacity: 0, position: 'absolute' }}
                        />
                        <label htmlFor={`view-${value}`}>
                          <img 
                            src={`/icons/${getIconForValue(value)}.png`} 
                            alt="" 
                            style={{ cursor: 'pointer' }}
                            title={getTitleForValue(value)}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="row mt-5">
                <div className="col-md-3">
                  Edit Permission
                </div>
                <div className="col-md-8">
                  <div className="roles-list-permission">
                    {[1, 2, 3, 4, 5].map(value => (
                      <div key={`edit-${value}`} style={{ display: 'inline-block' }}>
                        <input
                          type="radio"
                          name="edit"
                          id={`edit-${value}`}
                          value={value}
                          checked={editPermission === value}
                          onChange={() => setEditPermission(value)}
                          style={{ opacity: 0, position: 'absolute' }}
                        />
                        <label htmlFor={`edit-${value}`}>
                          <img 
                            src={`/icons/${getIconForValue(value)}.png`} 
                            alt="" 
                            style={{ cursor: 'pointer' }}
                            title={getTitleForValue(value)}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-3"><b>Selected Fields</b></p>
              <div className="row">
                <div className="form-control" style={{ height: '140px', overflowY: 'auto' }}>
                  {data.fields.map(field => (
                    <div key={field.id} className="chip">
                      {field.field_name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="submit" className="btn btn-success float-right">
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function getIconForValue(value) {
  switch(value) {
    case 1: return 'no-data';
    case 2: return 'my-data';
    case 3: return 'reporties-data';
    case 4: return 'reporties-my-data';
    case 5: return 'all-data';
    default: return 'no-data';
  }
}

function getTitleForValue(value) {
  switch(value) {
    case 1: return 'no-data';
    case 2: return 'my-data';
    case 3: return 'reporties-data';
    case 4: return 'reporties+my-data';
    case 5: return 'all-data';
    default: return 'no-data';
  }
}

export default SetPermissionModal;