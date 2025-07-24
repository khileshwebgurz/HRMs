import { React, useState } from "react";

const ContactInfoSection = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div className="card wgz-contactinfo">
        <div className="card-header">
          <h3 className="card-title form-header">Contact info</h3>
          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                // href="javascript:void(0)"
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-contactinfo"
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
                data-id="wgz-contactinfo"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                // href="javascript:void(0)"
                className="btn btn-success btn-xs wgz-submit"
                data-id="wgz-contactinfo"
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
              <h5>In case of emergency contacts</h5>
              <div className="form-group ">
                <label htmlFor="emergency_name" className=" col-form-label">
                  Name
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.emergency_name}
                      id="emergency_name"
                      name="emergency_name"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.emergency_name}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <h5>&nbsp;</h5>
              <div className="form-group ">
                <label htmlFor="emergency_relation" className=" col-form-label">
                  Relation
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.emergency_relation}
                      id="emergency_relation"
                      name="emergency_relation"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.emergency_relation}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <h5>&nbsp;</h5>
              <div className="form-group ">
                <label htmlFor="emergency_contact" className=" col-form-label">
                  Contact No.
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="number"
                      value={employeedata?.candidate?.emergency_contact}
                      id="emergency_contact"
                      name="emergency_contact"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.emergency_contact}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label htmlFor="emergency_name_2" className=" col-form-label">
                  Name
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.emergency_name_2}
                      id="emergency_name_2"
                      name="emergency_name_2"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.emergency_name_2}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label
                  htmlFor="emergency_relation_2"
                  className=" col-form-label"
                >
                  Relation
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.emergency_relation_2}
                      id="emergency_relation_2"
                      name="emergency_relation_2"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.emergency_relation_2}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label
                  htmlFor="emergency_contact_2"
                  className=" col-form-label"
                >
                  Contact No.
                </label>
                {isEditing ? (
                  <div className="wgz_field ">
                    <input
                      className="form-control"
                      type="number"
                      value={employeedata?.candidate?.emergency_contact_2}
                      id="emergency_contact_2"
                      name="emergency_contact_2"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.emergency_contact_2}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactInfoSection;
