import { React, useState ,useEffect} from "react";
import axios from "axios";

const ContactInfoSection = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

 useEffect(() => {
    if (employeedata?.candidate) {
      const candidateId = employeedata.candidate.candidate_id; // e.g., 15734
      const onCandidateId = candidateId;
      setFormData({
        ...employeedata.candidate,
        on_candidate_id: onCandidateId,
        updated_by: "hr-emp",
      });
    }
  }, [employeedata]);


  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    const candidateId = employeedata?.candidate?.candidate_id;
    const onCandidateId = candidateId;
    setFormData({
      ...employeedata.candidate,
      on_candidate_id: onCandidateId,
      updated_by: "hr-emp",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("my form data is >>", formData);
    if (!formData.on_candidate_id) {
      alert("Candidate ID is missing. Please contact support.");
      return;
    }
    try {
      const filteredFormData = {
        section: "contact",
        emergency_name: formData.emergency_name || "",
        emergency_relation: formData.emergency_relation || "",
        emergency_contact: formData.emergency_contact || "",
        emergency_name_2: formData.emergency_name_2 || "",
        emergency_relation_2: formData.emergency_relation_2 || "",
        emergency_contact_2: formData.emergency_contact_2 || "",
        on_candidate_id: formData.on_candidate_id,
        updated_by: formData.updated_by || "hr-emp",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        filteredFormData,
        { withCredentials: true }
      );

      if (response.data.status === 200) {
        console.log("Contact info updated successfully:", response.data);
        setIsEditing(false);
      } else {
        console.warn("Update failed:", response.data);
        alert(response.data.message || "Failed to update contact info.");
      }
    } catch (error) {
      console.error("Error submitting contact info:", error);
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };


  return (
    <>
      <div className="card wgz-contactinfo">
        <div className="card-header">
          <h3 className="card-title form-header">Contact info</h3>

          {!isEditing ? (
            <div className="card-tools wgz_value">
              <button
                className="btn btn-tool wgz-edit-form"
                onClick={handleEditClick}
              >
                <i className="fas fa-edit"></i>
              </button>
            </div>
          ) : (
            <div className="card-tools wgz_field">
              <button
                type="button"
                className="btn btn-info btn-xs mr-1"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button className="btn btn-success btn-xs" onClick={handleSubmit}>
                <i className="fas fa-check"></i> Update
              </button>
            </div>
          )}
        </div>

        <div className="card-body">
          <div className="row">
            {/* First Emergency Contact */}
            <div className="col-sm-6 col-md-4">
              <h5>In case of emergency contacts</h5>
              <div className="form-group">
                <label htmlFor="emergency_name" className="col-form-label">
                  Name
                </label>
                {isEditing ? (
                  <input
                    className="form-control"
                    type="text"
                    name="emergency_name"
                    value={formData.emergency_name || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="wgz_value">
                    {formData.emergency_name || "—"}
                  </div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <h5>&nbsp;</h5>
              <div className="form-group">
                <label htmlFor="emergency_relation" className="col-form-label">
                  Relation
                </label>
                {isEditing ? (
                  <input
                    className="form-control"
                    type="text"
                    name="emergency_relation"
                    value={formData.emergency_relation || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="wgz_value">
                    {formData.emergency_relation || "—"}
                  </div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <h5>&nbsp;</h5>
              <div className="form-group">
                <label htmlFor="emergency_contact" className="col-form-label">
                  Contact No.
                </label>
                {isEditing ? (
                  <input
                    className="form-control"
                    type="text"
                    name="emergency_contact"
                    maxLength="10"
                    value={formData.emergency_contact || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="wgz_value">
                    {formData.emergency_contact || "—"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            {/* Second Emergency Contact */}
            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="emergency_name_2" className="col-form-label">
                  Name
                </label>
                {isEditing ? (
                  <input
                    className="form-control"
                    type="text"
                    name="emergency_name_2"
                    value={formData.emergency_name_2 || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="wgz_value">
                    {formData.emergency_name_2 || "—"}
                  </div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label
                  htmlFor="emergency_relation_2"
                  className="col-form-label"
                >
                  Relation
                </label>
                {isEditing ? (
                  <input
                    className="form-control"
                    type="text"
                    name="emergency_relation_2"
                    value={formData.emergency_relation_2 || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="wgz_value">
                    {formData.emergency_relation_2 || "—"}
                  </div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="emergency_contact_2" className="col-form-label">
                  Contact No.
                </label>
                {isEditing ? (
                  <input
                    className="form-control"
                    type="text"
                    name="emergency_contact_2"
                    maxLength="10"
                    value={formData.emergency_contact_2 || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="wgz_value">
                    {formData.emergency_contact_2 || "—"}
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
