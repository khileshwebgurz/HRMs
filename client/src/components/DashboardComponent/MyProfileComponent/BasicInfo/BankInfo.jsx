import { useState, useEffect } from "react";
import axios from "axios";
const BankInfo = ({ employeeData }) => {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (employeeData) {
      setFormData({
        bank_account_holder_name:
          employeeData?.candidate?.bank_account_holder_name || "",
        bank_name: employeeData?.candidate?.bank_name || "",
        bank_account_number: employeeData?.candidate?.bank_account_number || "",
        bank_branch_name: employeeData?.candidate?.bank_branch_name || "",
        bank_city: employeeData?.candidate?.bank_city || "",
        bank_ifsc: employeeData?.candidate?.bank_ifsc || "",
        on_candidate_id: employeeData?.candidate_id || "",
        on_employee_id: employeeData?.employee_id || "",
        updated_by: employeeData.updated_by || "hr-emp",
      });
    }
  }, [employeeData]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      bank_account_holder_name:
        employeeData?.candidate?.bank_account_holder_name || "",
      bank_name: employeeData?.candidate?.bank_name || "",
      bank_account_number: employeeData?.candidate?.bank_account_number || "",
      bank_branch_name: employeeData?.candidate?.bank_branch_name || "",
      bank_city: employeeData?.candidate?.bank_city || "",
      bank_ifsc: employeeData?.candidate?.bank_ifsc || "",
      on_candidate_id: employeeData?.candidate_id || "",
      on_employee_id: employeeData?.employee_id || "",
      updated_by: employeeData.updated_by || "hr-emp",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.on_candidate_id) {
      alert("Candidate ID is missing. Please contact support.");
      return;
    }

    try {
      const filteredFormData = {
        section: "bank_details",
        bank_account_holder_name: formData.bank_account_holder_name || "",
        bank_name: formData.bank_name || "",
        bank_account_number: formData.bank_account_number || "",
        bank_branch_name: formData.bank_branch_name || "",
        bank_city: formData.bank_city || "",
        bank_ifsc: formData.bank_ifsc || "",
        on_candidate_id: formData.on_candidate_id,
        on_employee_id: formData.on_employee_id,
        updated_by: formData.updated_by || "hr-emp",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        filteredFormData,
        { withCredentials: true }
      );

      console.log("Success:", response.data);
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
      <div className="card wgz-bankinfo card-panel">
        <div className="card-header">
          <h3 className="card-title form-header">Salary Account Details</h3>

          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                onClick={handleEditClick}
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-bankinfo"
              >
                <i className="fas fa-edit"></i>
              </a>
            </div>
          )}

          {isEditing && (
            <div className="card-tools wgz_field">
              <button
                type="button"
                className="btn btn-info btn-xs wgz-close-form mr-1"
                onClick={handleCancelClick}
                data-id="wgz-bankinfo"
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                onClick={handleSubmit}
                className="btn btn-success btn-xs wgz-submit"
                data-id="wgz-bankinfo"
              >
                <i className="fas fa-check"></i> Update
              </a>
            </div>
          )}
        </div>

        <div className="card-body">
          <div className="row">
            {/* Account Holder's Name */}
            <div className="col-md-4 col-sm-6">
              <div className="form-group">
                <label
                  htmlFor="bank_account_holder_name"
                  className="col-form-label"
                >
                  Account Holder's Name
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      name="bank_account_holder_name"
                      value={formData.bank_account_holder_name}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="wgz_value">
                    {formData.bank_account_holder_name || "N/A"}
                  </div>
                )}
              </div>
            </div>

            {/* Bank Name */}
            <div className="col-md-4 col-sm-6">
              <div className="form-group">
                <label htmlFor="bank_name" className="col-form-label">
                  Bank Name
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="wgz_value">{formData.bank_name || "N/A"}</div>
                )}
              </div>
            </div>

            {/* Account No. */}
            <div className="col-md-4 col-sm-6">
              <div className="form-group">
                <label htmlFor="bank_account_number" className="col-form-label">
                  Account No.
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      name="bank_account_number"
                      value={formData.bank_account_number}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="wgz_value">
                    {formData.bank_account_number || "N/A"}
                  </div>
                )}
              </div>
            </div>

            {/* Branch Name */}
            <div className="col-md-4 col-sm-6">
              <div className="form-group">
                <label htmlFor="bank_branch_name" className="col-form-label">
                  Branch Name
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      name="bank_branch_name"
                      value={formData.bank_branch_name}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="wgz_value">
                    {formData.bank_branch_name || "N/A"}
                  </div>
                )}
              </div>
            </div>

            {/* City */}
            <div className="col-md-4 col-sm-6">
              <div className="form-group">
                <label htmlFor="bank_city" className="col-form-label">
                  City
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      name="bank_city"
                      value={formData.bank_city}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="wgz_value">{formData.bank_city || "N/A"}</div>
                )}
              </div>
            </div>

            {/* IFSC Code */}
            <div className="col-md-4 col-sm-6">
              <div className="form-group">
                <label htmlFor="bank_ifsc" className="col-form-label">
                  IFSC Code
                </label>
                {isEditing ? (
                  <div className="wgz_field">
                    <input
                      className="form-control"
                      type="text"
                      name="bank_ifsc"
                      value={formData.bank_ifsc}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="wgz_value">{formData.bank_ifsc || "N/A"}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankInfo;
