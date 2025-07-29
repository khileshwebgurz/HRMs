import { useState, useEffect } from "react";
import axios from "axios";

const OtherInformation = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (employeedata?.candidate) {
      const candidateId = employeedata.candidate.candidate_id;
      const onCandidateId = candidateId;
      const copied =
        employeedata.candidate_questions?.map((q) => ({
          ...q,
          status: q.status?.toString() ?? "",
          reason: q.reason || "",
        })) || [];
      setQuestions(copied);
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
    const copied =
      employeedata?.candidate_questions?.map((q) => ({
        ...q,
        status: q.status?.toString() ?? "",
        reason: q.reason || "",
      })) || [];
    setQuestions(copied);
    const candidateId = employeedata?.candidate?.candidate_id;
    const onCandidateId = candidateId;
    setFormData({
      ...employeedata.candidate,
      on_candidate_id: onCandidateId,
      updated_by: "hr-emp",
    });
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    console.log("my form data is >>", {
      ...formData,
      candidate_questions: questions,
    });
    if (!formData.on_candidate_id) {
      alert("Candidate ID is missing. Please contact support.");
      return;
    }
    try {
      const filteredFormData = {
        section: "other_information",
        candidate_questions: questions,
        on_candidate_id: formData.on_candidate_id,
        updated_by: formData.updated_by || "hr-emp",
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        filteredFormData,
        { withCredentials: true }
      );

      if (res.data.status === 200) {
        console.log("Other Information updated successfully:", res.data);
        setIsEditing(false);
      } else {
        console.warn("Failed to update Other Information:", res.data);
        alert(res.data.message || "Failed to update other information.");
      }
    } catch (error) {
      console.error("Error submitting Other Information:", error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };
  return (
    <>
      <div className="card wgz-otherinfoQuiz">
        <div className="card-header">
          <h3 className="card-title form-header">Other Information</h3>

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

        <div className="card-body table-responsive">
          <table className="table table-bordered other-infomation">
            <thead>
              <tr>
                <th width="40%">DETAILS</th>
                <th width="10%">&nbsp;</th>
                <th>IF YES, PLEASE ELABORATE:</th>
              </tr>
            </thead>
            <tbody>
              {questions?.map((question, index) => (
                <tr className="wgz_field_table" key={question.id}>
                  <td>
                    <strong>{question.question}</strong>
                  </td>
                  <td>
                    {isEditing ? (
                      <>
                        <div className="form-check form-check-inline">
                          <label className="form-check-label">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`status_${question.id}`}
                              value="1"
                              checked={question.status === "1"}
                              onChange={() =>
                                handleChange(index, "status", "1")
                              }
                            />{" "}
                            Yes
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <label className="form-check-label">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`status_${question.id}`}
                              value="0"
                              checked={question.status === "0"}
                              onChange={() =>
                                handleChange(index, "status", "0")
                              }
                            />{" "}
                            No
                          </label>
                        </div>
                      </>
                    ) : (
                      <div className="wgz_value">
                        {question.status === "1"
                          ? "Yes"
                          : question.status === "0"
                          ? "No"
                          : "N/A"}
                      </div>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <textarea
                        className="form-control"
                        rows="2"
                        value={question.reason}
                        onChange={(e) =>
                          handleChange(index, "reason", e.target.value)
                        }
                      ></textarea>
                    ) : (
                      <div className="wgz_value">{question.reason || "-"}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OtherInformation;
