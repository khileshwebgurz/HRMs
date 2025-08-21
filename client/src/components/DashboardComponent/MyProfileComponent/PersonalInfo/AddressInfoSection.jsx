import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressInfoSection = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employeedata?.candidate) {
      const candidateId = employeedata.candidate.candidate_id;
      const onCandidateId = candidateId;
      setFormData({
        ...employeedata.candidate,
        on_candidate_id: onCandidateId,
        updated_by: "hr-emp",
      });
    }
  }, [employeedata]);

  // ✅ Frontend validation matching Laravel rules
  const validatePersonalInfo = (data) => {
    const errors = {};

    // current_address: required, string, max 1000
    if (!data.current_address?.trim()) {
      errors.current_address = "Current address is required.";
    } else if (data.current_address.length > 1000) {
      errors.current_address = "Current address cannot exceed 1000 characters.";
    }

    // permanent_address: required, string, max 1000
    if (!data.permanent_address?.trim()) {
      errors.permanent_address = "Permanent address is required.";
    } else if (data.permanent_address.length > 1000) {
      errors.permanent_address = "Permanent address cannot exceed 1000 characters.";
    }

    // current_phone: required, digits:10
    if (!data.current_phone) {
      errors.current_phone = "Current phone number is required.";
    } else if (!/^\d{10}$/.test(data.current_phone)) {
      errors.current_phone = "Current phone number must be exactly 10 digits.";
    }

    // permanent_phone: required, digits:10
    if (!data.permanent_phone) {
      errors.permanent_phone = "Permanent phone number is required.";
    } else if (!/^\d{10}$/.test(data.permanent_phone)) {
      errors.permanent_phone = "Permanent phone number must be exactly 10 digits.";
    }

    return errors;
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    const candidateId = employeedata?.candidate?.candidate_id;
    const onCandidateId = candidateId;
    setFormData({
      ...employeedata.candidate,
      on_candidate_id: onCandidateId,
      updated_by: "hr-emp",
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // ✅ Run validation before sending request
    const validationErrors = validatePersonalInfo(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    if (!formData.on_candidate_id) {
      alert("Candidate ID is missing. Please contact support.");
      return;
    }

    try {
      const filteredFormData = {
        section: "address",
        current_address: formData.current_address || "",
        permanent_address: formData.permanent_address || "",
        current_phone: formData.current_phone || "",
        permanent_phone: formData.permanent_phone || "",
        on_candidate_id: formData.on_candidate_id,
        updated_by: formData.updated_by || "hr-emp",
      };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        filteredFormData,
        { withCredentials: true }
      );

      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
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
                    {errors.current_address && (
                      <small className="text-danger">{errors.current_address}</small>
                    )}
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {formData?.current_address || ""}
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
                    {errors.permanent_address && (
                      <small className="text-danger">{errors.permanent_address}</small>
                    )}
                  </div>
                ) : (
                  <div className="wgz_value ">
                    {formData?.permanent_address || ""}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor="current_phone" className="col-form-label">
                  Contact No.<span className="req">*</span>
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="number"
                      id="current_phone"
                      name="current_phone"
                      maxLength="10"
                      value={formData?.current_phone || ""}
                      onChange={handleInputChange}
                    />
                    {errors.current_phone && (
                      <small className="text-danger">{errors.current_phone}</small>
                    )}
                  </div>
                ) : (
                  <div className="wgz_value mt-2">
                    {formData?.current_phone || ""}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <label
                  htmlFor="permanent_phone"
                  className=" col-form-label"
                >
                  Contact No.<span className="req">*</span>
                </label>
                {isEditing ? (
                  <div className=" wgz_field">
                    <input
                      className="form-control"
                      type="number"
                      value={formData?.permanent_phone || ""}
                      onChange={handleInputChange}
                      id="permanent_phone"
                      name="permanent_phone"
                    />
                    {errors.permanent_phone && (
                      <small className="text-danger">{errors.permanent_phone}</small>
                    )}
                  </div>
                ) : (
                  <div className="wgz_value  mt-2">
                    {formData?.permanent_phone || ""}
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
