import React, { useState } from "react";

const OtherSection = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };
  return (
    <>
      <div className="card wgz-otherinfo">
        <div className="card-header">
          <h3 className="card-title form-header">Other info</h3>

          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                // href="javascript:void(0)"
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-otherinfo"
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
                data-id="wgz-otherinfo"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                // href="javascript:void(0)"
                className="btn btn-success btn-xs wgz-submit"
                data-id="wgz-otherinfo"
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
              <div className="form-group ">
                <label htmlFor="marital_status" className=" col-form-label">
                  Marital Status
                </label>

                {isEditing ? (
                  <div className="wgz_field">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="marital_status"
                          id="marital_status1"
                          value="1"
                          checked={
                            employeedata?.candidate?.marital_status === "1"
                          }
                          readOnly
                        />
                        Single
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="marital_status"
                          id="marital_status2"
                          value="2"
                          checked={
                            employeedata?.candidate?.marital_status === "2"
                          }
                          readOnly
                        />
                        Married
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="wgz_value">
                    {employeedata?.candidate?.marital_status === "1"
                      ? "Single"
                      : employeedata?.candidate?.marital_status === "2"
                      ? "Married"
                      : "N/A"}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label
                  htmlFor="spouse_name_profession"
                  className=" col-form-label"
                >
                  Spouses name and profession
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.spouse_name_profession}
                      id="spouse_name_profession"
                      name="spouse_name_profession"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.spouse_name_profession}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label htmlFor="no_of_children" className=" col-form-label">
                  No. of children
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.no_of_children}
                      id="no_of_children"
                      name="no_of_children"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.no_of_children}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label htmlFor="father_name" className=" col-form-label">
                  Father’s name
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.father_name}
                      id="father_name"
                      name="father_name"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.father_name}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label htmlFor="father_profession" className=" col-form-label">
                  Profession
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.father_profession}
                      id="father_profession"
                      name="father_profession"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.father_profession}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label htmlFor="father_age" className=" col-form-label">
                  Age
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.father_age}
                      id="father_age"
                      name="father_age"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.father_age}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label htmlFor="mother_name" className=" col-form-label">
                  Mother’s name
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.mother_name}
                      id="mother_name"
                      name="mother_name"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.mother_name}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label htmlFor="mother_profession" className=" col-form-label">
                  Profession
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.mother_profession}
                      id="mother_profession"
                      name="mother_profession"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.mother_profession}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label htmlFor="mother_age" className=" col-form-label">
                  Age
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value={employeedata?.candidate?.mother_age}
                      id="mother_age"
                      name="mother_age"
                    />
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.mother_age}
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

export default OtherSection;
