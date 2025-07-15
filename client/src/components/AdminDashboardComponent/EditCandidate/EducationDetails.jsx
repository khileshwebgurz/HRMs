import { useState } from "react";

const EducationDetails = ({ educationRows, setEducationRows }) => {

  // handle input change for education
  const handleChange = (index, field, value) => {
    const updated = [...educationRows];
    updated[index][field] = value;
    setEducationRows(updated);
  };
  // adding new rows
  const handleAddRow = () => {
    setEducationRows([
      ...educationRows,
      {
        institute: "",
        from: "",
        to: "",
        qualification: "",
      },
    ]);
  };
  // handle deleting the rows
  const handleDeleteRow = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this row?"
    );
    if (confirmDelete) {
      const updated = [...educationRows];
      updated.splice(index, 1);
      setEducationRows(updated);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          Education Details<span className="req">*</span>
          <button
            type="button"
            className="btn btn-primary btn-sm float-right"
            onClick={handleAddRow}
          >
            <i className="fas fa-plus"></i> Add Row
          </button>
        </div>
        <div className="card-body">
          <table className="table table-bordered" id="wgz_edu_details">
            <thead>
              <tr>
                <th width="5%">S No.</th>
                <th>School / University / Professional Institute</th>
                <th width="10%">From</th>
                <th width="10%">To</th>
                <th>Highest Qualification</th>
                <th width="5%">Action</th>
              </tr>
            </thead>
            <tbody>
              {educationRows.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={row.institute}
                      onChange={(e) =>
                        handleChange(index, "institute", e.target.value)
                      }
                    ></textarea>
                  </td>
                  <td>
                    <select
                      className="custom-select"
                      value={row.from}
                      onChange={(e) =>
                        handleChange(index, "from", e.target.value)
                      }
                    >
                      <option value="">From...</option>
                      {[...Array(30)].map((_, i) => {
                        const year = 2024 - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                  <td>
                    <select
                      className="custom-select"
                      value={row.to}
                      onChange={(e) =>
                        handleChange(index, "to", e.target.value)
                      }
                    >
                      <option value="">To...</option>
                      {[...Array(30)].map((_, i) => {
                        const year = 2024 - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                  <td>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={row.qualification}
                      onChange={(e) =>
                        handleChange(index, "qualification", e.target.value)
                      }
                    ></textarea>
                  </td>
                  <td>
                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteRow(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
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

export default EducationDetails;
