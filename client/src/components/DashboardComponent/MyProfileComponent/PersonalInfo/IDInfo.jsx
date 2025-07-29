import { useState, useEffect } from "react";
import axios from "axios";

const IDInfo = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
   const [formData, setFormData] = useState({});

  useEffect(() => {
    if (employeedata?.candidate) {
      const candidateId = employeedata.candidate.candidate_id;
      const onCandidateId = candidateId;
      setIdType(employeedata.candidate.id_type || "");
      setIdNumber(employeedata.candidate.id_number || "");
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
    setIdType(employeedata?.candidate?.id_type || "");
    setIdNumber(employeedata?.candidate?.id_number || "");
    const candidateId = employeedata?.candidate?.candidate_id;
    const onCandidateId = candidateId;
    setFormData({
      ...employeedata.candidate,
      on_candidate_id: onCandidateId,
      updated_by: "hr-emp",
    });
  };


  const handleSubmit = async () => {
    console.log("my form data is >>", { ...formData, id_type: idType, id_number: idNumber });
    if (!formData.on_candidate_id) {
      alert("Candidate ID is missing. Please contact support.");
      return;
    }
    try {
      const filteredFormData = {
        section: "id",
        id_type: idType,
        id_number: idNumber,
        on_candidate_id: formData.on_candidate_id,
        updated_by: formData.updated_by || "hr-emp",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        filteredFormData,
        { withCredentials: true }
      );

      if (response.data.status === 200) {
        console.log("ID info updated successfully:", response.data);
        setIsEditing(false);
      } else {
        console.warn("Failed to submit ID info:", response.data);
        alert(response.data.message || "Failed to update ID info.");
      }
    } catch (error) {
      console.error("Error submitting ID info:", error);
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const getIdTypeLabel = (value) => {
    switch (value) {
      case "1":
        return "Adhaar";
      case "2":
        return "Passport";
      case "3":
        return "Driving License";
      case "4":
        return "Income Tax PAN Card";
      default:
        return "N/A";
    }
  };

  return (
    <>
      <div className="card wgz-idprof">
        <div className="card-header">
          <h3 className="card-title form-header">ID Proof</h3>

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
              <button
                className="btn btn-success btn-xs mr-1"
                onClick={handleSubmit}
              >
                <i className="fas fa-check"></i> Update
              </button>
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
                  <select
                    className="form-control"
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                  >
                    <option value="">Select..</option>
                    <option value="1">Adhaar</option>
                    <option value="2">Passport</option>
                    <option value="3">Driving License</option>
                    <option value="4">Income Tax PAN Card</option>
                  </select>
                ) : (
                  <div className="wgz_value">{getIdTypeLabel(idType)}</div>
                )}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="id_number" className="col-form-label">
                  ID No
                </label>
                {isEditing ? (
                  <input
                    className="form-control"
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                  />
                ) : (
                  <div className="wgz_value">{idNumber || "-"}</div>
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
