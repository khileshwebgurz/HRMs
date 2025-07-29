import { useState, useEffect } from "react";
import axios from "axios";

const ContactInfo = ({ employeeData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

 
  useEffect(() => {
    if (employeeData) {
      setFormData({
        email: employeeData?.candidate?.email || "",
        skype_id: employeeData?.candidate?.skype_id || "",
        basecamp_id: employeeData?.candidate?.basecamp_id || "",
        on_candidate_id: employeeData?.candidate_id || "",
        on_employee_id: employeeData?.employee_id || "",
        updated_by: employeeData?.candidate?.updated_by || "hr-emp",
      });
    }
  }, [employeeData]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      email: employeeData?.candidate?.email || "",
      skype_id: employeeData?.candidate?.skype_id || "",
      basecamp_id: employeeData?.candidate?.basecamp_id || "",
      on_candidate_id: employeeData?.candidate_id || "",
      on_employee_id: employeeData?.on_employee_id || "",
      updated_by: employeeData?.candidate?.updated_by || "hr-emp",
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

    console.log('my formdata is >>>', formData)
 console.log('my inner details of formdata is  ?>>>>', formData.skype_id )
    try {
      const filteredFormData = {
        section: "contact", //this needs to be changed to accept skype_id and basecamp_id
        email: formData.email || "",
        skype_id: formData.skype_id || "",
        basecamp_id: formData.basecamp_id || "",
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
 
        <div className="card wgz-contactinfo card-panel">
          <div className="card-header">
            <h3 className="card-title form-header">Contact info</h3>

            {!isEditing && (
              <div className="card-tools wgz_value">
                <a
                  onClick={handleEditClick}
                  className="btn btn-tool wgz-edit-form"
                  data-id="wgz-contactinfo"
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
                  onClick={handleSubmit}
                  className="btn btn-success btn-xs wgz-submit"
                  data-id="wgz-contactinfo"
                >
                  {" "}
                  <i className="fas fa-check"></i>
                  Update
                </a>
              </div>
            )}
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-4 col-sm-6">
                <div className="form-group ">
                  <label htmlFor="email" className=" col-form-label">
                    Official Email
                  </label>
                  {isEditing ? (
                    <div className="wgz_field">
                      <input
                        className="form-control"
                        type="text"
                        value={formData.email}
                        disabled
                      />
                    </div>
                  ) : (
                    <div className="wgz_value">{formData.email || "N/A"}</div>
                  )}
                </div>
              </div>
              <div className="col-md-4 col-sm-6">
                <div className="form-group ">
                  <label htmlFor="skype_id" className=" col-form-label">
                    Skype Id
                  </label>
                  {isEditing ? (
                    <div className="wgz_field">
                      <input
                        className="form-control"
                        type="text"
                        value={formData.skype_id || ""}
                        onChange={handleInputChange}
                        id="skype_id"
                        name="skype_id"
                      />
                    </div>
                  ) : (
                    <div className="wgz_value">
                      {formData.skype_id || "N/A"}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-4 col-sm-6">
                <div className="form-group ">
                  <label htmlFor="basecamp_id" className=" col-form-label">
                    Basecamp Id
                  </label>
                  {isEditing ? (
                    <div className="wgz_field">
                      <input
                        className="form-control"
                        type="text"
                        value={formData.basecamp_id || ""}
                        onChange={handleInputChange}
                        id="basecamp_id"
                        name="basecamp_id"
                      />
                    </div>
                  ) : (
                    <div className="wgz_value">
                      {formData.basecamp_id || "N/A"}
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

export default ContactInfo;
