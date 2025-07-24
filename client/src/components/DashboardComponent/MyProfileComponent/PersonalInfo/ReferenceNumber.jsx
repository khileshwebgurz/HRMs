import React, { useState } from "react";

const ReferenceNumber = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div className="card wgz-refer">
        <div className="card-header">
          <h3 className="card-title form-header">
            REFERENCES [Name two individuals who can provide professional
            reference]
          </h3>
          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                // href="javascript:void(0)"
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-refer"
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
                data-id="wgz-refer"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                // href="javascript:void(0)"
                className="btn btn-success btn-xs wgz-submit"
                data-id="wgz-refer"
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
                <label
                  htmlFor="references[0][name]"
                  className=" col-form-label"
                >
                  Reference no. 1 Name
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value="{{$refer[0]->name}}"
                      id="references[0][name]"
                      name="references[0][name]"
                    />
                  </div>
                ) : (
                  <div className="wgz_value "></div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label
                  htmlFor="references[0][contact]"
                  className=" col-form-label"
                >
                  Contact No
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="number"
                      value="{{$refer[0]->contact}}"
                      id="references[0][contact]"
                      name="references[0][contact]"
                      pattern="[1-9]{1}[0-9]{9}"
                    />
                  </div>
                ) : (
                  <div className="wgz_value "></div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label
                  htmlFor="references[1][name]"
                  className=" col-form-label"
                >
                  Reference no. 2 Name
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      value="{{$refer[1]->name}}"
                      id="references[1][name]"
                      name="references[1][name]"
                    />
                  </div>
                ) : (
                  <div className="wgz_value "></div>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="form-group ">
                <label
                  htmlFor="references[1][contact]"
                  className=" col-form-label"
                >
                  Contact No
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="number"
                      value="{{$refer[1]->contact}}"
                      id="references[1][contact]"
                      name="references[1][contact]"
                    />
                  </div>
                ) : (
                  <div className="wgz_value "></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferenceNumber;
