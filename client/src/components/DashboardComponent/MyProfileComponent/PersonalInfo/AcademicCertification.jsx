import { useState, useEffect } from "react";
import axios from "axios";

const AcademicCertification = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [academicRows, setAcademicRows] = useState([]);

  useEffect(() => {
    const initialRows = employeedata?.candidate?.certifications || [];
    setAcademicRows(initialRows.length > 0 ? initialRows : []);
  }, [employeedata]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    const resetRows = employeedata?.candidate?.certifications || [];
    setAcademicRows(resetRows.length > 0 ? resetRows : []);
  };

  const handleAddRow = () => {
    setAcademicRows((prev) => [
      ...prev,
      {
        name: "",
        board: "",
        month: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    setAcademicRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...academicRows];
    updatedRows[index][field] = value;
    setAcademicRows(updatedRows);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...employeedata.candidate,
        certifications: academicRows,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/joining-form-submit`,
        payload,
        { withCredentials: true }
      );

      if (res.data.status === 200) {
        console.log("Certifications updated successfully");
        setIsEditing(false);
      } else {
        console.warn("Failed to update certifications");
      }
    } catch (err) {
      console.error("Error submitting certifications:", err);
    }
  };
  return (
    <>
      <div className="card wgz-certi">
        <div className="card-header">
          <h3 className="card-title form-header">
            CERTIFICATION[S] (Academic or Extra-Curricular)
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
              <button
                className="btn btn-success btn-xs mr-1"
                onClick={handleSubmit}
              >
                <i className="fas fa-check"></i> Update
              </button>
              <button className="btn btn-primary btn-xs" onClick={handleAddRow}>
                <i className="fas fa-plus"></i> Add Row
              </button>
            </div>
          )}
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered" id="wgz_family">
            <thead>
              <tr>
                <th width="2%">S No.</th>
                <th width="10%">Name</th>
                <th width="10%">Board/Society</th>
                <th width="10%">Month/Year</th>
                <th width="5%">Action</th>
              </tr>
            </thead>
            <tbody>
              {academicRows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No certification records added.
                  </td>
                </tr>
              ) : (
                academicRows.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {isEditing ? (
                      <>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.name}
                            onChange={(e) =>
                              handleInputChange(index, "name", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.board}
                            onChange={(e) =>
                              handleInputChange(index, "board", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={row.month}
                            onChange={(e) =>
                              handleInputChange(index, "month", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-xs delete-record-certification"
                            onClick={() => handleDeleteRow(index)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{row.name || "-"}</td>
                        <td>{row.board || "-"}</td>
                        <td>{row.month || "-"}</td>
                        <td>-</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AcademicCertification;
