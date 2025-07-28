import React, { useState, useEffect } from "react";
import axios from "axios";

const ReferenceNumber = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [references, setReferences] = useState([
    { name: "", contact: "" },
    { name: "", contact: "" },
  ]);

  useEffect(() => {
    const refData = employeedata?.candidate?.references || [
      { name: "", contact: "" },
      { name: "", contact: "" },
    ];
    setReferences(refData);
  }, [employeedata]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    const refData = employeedata?.candidate?.references || [
      { name: "", contact: "" },
      { name: "", contact: "" },
    ];
    setReferences(refData);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...references];
    updated[index][field] = value;
    setReferences(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...employeedata?.candidate,
        references,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        payload,
        { withCredentials: true }
      );

      if (res.data.status === 200) {
        console.log("References updated successfully");
        setIsEditing(false);
      } else {
        console.warn("Failed to update references");
      }
    } catch (error) {
      console.error("Error submitting references:", error);
    }
  };
  return (
    <>
      <div className="card wgz-refer">
        <div className="card-header">
          <h3 className="card-title form-header">
            REFERENCES [Name two individuals who can provide professional
            reference]
          </h3>
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
          {[0, 1].map((idx) => (
            <div className="row" key={idx}>
              <div className="col-sm-6 col-md-4">
                <div className="form-group">
                  <label className="col-form-label">
                    Reference no. {idx + 1} Name
                  </label>
                  {isEditing ? (
                    <input
                      className="form-control"
                      type="text"
                      value={references[idx]?.name}
                      onChange={(e) =>
                        handleInputChange(idx, "name", e.target.value)
                      }
                    />
                  ) : (
                    <div className="wgz_value">
                      {references[idx]?.name || "-"}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-sm-6 col-md-4">
                <div className="form-group">
                  <label className="col-form-label">Contact No</label>
                  {isEditing ? (
                    <input
                      className="form-control"
                      type="text"
                      pattern="[1-9]{1}[0-9]{9}"
                      value={references[idx]?.contact}
                      onChange={(e) =>
                        handleInputChange(idx, "contact", e.target.value)
                      }
                    />
                  ) : (
                    <div className="wgz_value">
                      {references[idx]?.contact || "-"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReferenceNumber;
