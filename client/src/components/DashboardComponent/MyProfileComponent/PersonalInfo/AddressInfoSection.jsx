import React, { useState, useEffect } from "react";

const AddressInfoSection = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (employeedata?.candidate) {
      setFormData({
        ...employeedata.candidate,
      });
    }
  }, [employeedata]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      ...employeedata.candidate,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("my form data is >>", formData);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        formData,
        { withCredentials: true }
      );

      // if (!response.ok) throw new Error("Failed to submit");

      const data = await response.data;
      console.log("Success:", data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <>
      <div className="card wgz-addresses">
        <div className="card-header">
          <h3 className="card-title form-header">Addresses</h3>

          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
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
                onClick={handleSubmit}
                className="btn btn-success btn-xs wgz-submit"
                data-id="wgz-addresses"
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
                      value={formData?.current_address || ""}
                      onChange={handleInputChange}
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
                      value={formData?.permanent_address || ""}
                      onChange={handleInputChange}
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
                      value={formData?.current_phone || ""}
                      onChange={handleInputChange}
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
                      value={formData?.permanent_phone || ""}
                      onChange={handleInputChange}
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
