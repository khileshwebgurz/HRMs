import React, { useState } from "react";

const AddressInfoSection = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };
  return (
    <>
      <div className="card wgz-addresses">
        <div className="card-header">
          <h3 className="card-title form-header">Addresses</h3>

          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                // href="javascript:void(0)"
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-addresses"
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
                data-id="wgz-addresses"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>

              <a
                // href="javascript:void(0)"
                className="btn btn-success btn-xs wgz-submit"
                data-id="wgz-addresses"
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
            <div className="col-lg-6">
              <div className="form-group ">
                <label htmlFor="current_address" className=" col-form-label">
                  Current Address<span className="req">*</span>
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <textarea
                      className="form-control"
                      id="current_address"
                      name="current_address"
                      value={employeedata?.candidate?.current_address}
                    ></textarea>
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.current_address}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group ">
                <label htmlFor="permanent_address" className="col-form-label">
                  Permanent Address<span className="req">*</span>
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <textarea
                      className="form-control"
                      id="permanent_address"
                      name="permanent_address"
                      value={employeedata?.candidate?.permanent_address}
                    ></textarea>
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {employeedata?.candidate?.permanent_address}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="form-group row">
                <label htmlFor="current_phone" className="col-3 col-form-label">
                  Contact No.<span className="req">*</span>
                </label>
                {isEditing ? (
                  <div className="col-8 wgz_field">
                    <input
                      className="form-control"
                      type="number"
                      id="current_phone"
                      name="current_phone"
                      maxlength="10"
                      value={employeedata?.candidate?.current_phone}
                    />
                  </div>
                ) : (
                  <div className="wgz_value mt-2">
                    {employeedata?.candidate?.current_phone}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group row">
                <label
                  htmlFor="permanent_phone"
                  className="col-3 col-form-label"
                >
                  Contact No.<span className="req">*</span>
                </label>
                {isEditing ? (
                  <div className="col-8 wgz_field">
                    <input
                      className="form-control"
                      type="number"
                      value={employeedata?.candidate?.permanent_phone}
                      id="permanent_phone"
                      name="permanent_phone"
                    />
                  </div>
                ) : (
                  <div className="wgz_value  mt-2">
                    {employeedata?.candidate?.permanent_phone}
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

export default AddressInfoSection;
