import { useState } from "react";

const IDInfo = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };
  return (
    <>
      <div className="card wgz-idprof">
        <div className="card-header">
          <h3 className="card-title form-header">ID Proof</h3>

          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                // href="javascript:void(0)"
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-idprof"
                onClick={handleEditClick}
              >
                {" "}
                <i className="fas fa-edit"></i>
              </a>
            </div>
          )}

          {isEditing && (
            <div className="card-tools wgz_field">
              <button
                type="button"
                className="btn btn-info btn-xs wgz-close-form mr-1"
                data-id="wgz-idprof"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                // href="javascript:void(0)"
                className="btn btn-success btn-xs wgz-submit mr-1"
                data-id="wgz-idprof"
                onClick={() => setIsEditing(false)}
              >
                {" "}
                <i className="fas fa-check"></i> Update
              </a>
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="id_type" className="col-form-label">
                  Type of ID
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <select
                      className="form-control"
                      value={employeedata?.candidate?.id_type}
                      name="id_type"
                    >
                      <option value="">Select..</option>

                      <option value="1">Adhaar</option>

                      <option value="2">Passport</option>

                      <option value="3">Driving License</option>

                      <option value="4">Income Tax PAN Card</option>
                    </select>
                  </div>
                ) : (
                  <div className="wgz_value">
                    {employeedata?.candidate?.id_type}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="id_number" className="col-form-label">
                  ID No
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.id_number}
                      id="id_number"
                      name="id_number"
                    />
                  </div>
                ) : (
                  <div className="wgz_value">{employeedata?.candidate?.id_number}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IDInfo;
