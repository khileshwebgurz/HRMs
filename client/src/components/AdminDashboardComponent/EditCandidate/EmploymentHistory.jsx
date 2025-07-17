import { useState } from "react";

const EmploymentHistory = ({employments, setEmployments}) => {

     // ////////////////////// Handling the Employment History ///////////////////////////
     
    
      const handleEmploymentChange = (index, field, value) => {
        const updated = [...employments];
        updated[index][field] = value;
        setEmployments(updated);
      };
    
      const handleEmploymentAddRow = () => {
        setEmployments([
          ...employments,
          {
            company_name: "",
            address: "",
            contact_details: "",
            from: "",
            to: "",
            position: "",
            reason_of_leaving: ""
          }
        ]);
      };
    
       const handleEmploymentDeleteRow = (index) => {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this employment row?"
        );
        if (confirmDelete) {
          const updated = [...employments];
          updated.splice(index, 1);
          setEmployments(updated);
        }
      };
    
        const reasons = [
        "Growth Prospects",
        "Medical Issue",
        "Family Issue",
        "Salary Issue",
        "Employee Benefits",
        "Other"
      ];
  return (
    <>
         <div className="card">
      <div className="card-header">
        Employment History <span className="req">*</span>
        <button
          type="button"
          className="btn btn-primary btn-sm float-right"
          onClick={handleEmploymentAddRow}
        >
          <i className="fas fa-plus"></i> Add Row
        </button>
      </div>
      <div className="card-body">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S No.</th>
              <th>Company / Address / Contact</th>
              <th>From</th>
              <th>To</th>
              <th>Position Held</th>
              <th>Reason for Leaving</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employments.map((emp, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <div>Name of the Company</div>
                  <textarea
                    className="form-control"
                    value={emp.company_name}
                    onChange={(e) =>
                      handleEmploymentChange(index, "company_name", e.target.value)
                    }
                  />
                  <div>Address</div>
                  <textarea
                    className="form-control"
                    value={emp.address}
                    onChange={(e) =>
                      handleEmploymentChange(index, "address", e.target.value)
                    }
                  />
                  <div>Contact Details</div>
                  <textarea
                    className="form-control"
                    value={emp.contact_details}
                    onChange={(e) =>
                      handleEmploymentChange(index, "contact_details", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value={emp.date_from}
                    onChange={(e) =>
                      handleEmploymentChange(index, "from", e.target.value)
                    }
                    placeholder="From (e.g. Jan 2022)"
                    autoComplete="off"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value={emp.date_to}
                    onChange={(e) => handleEmploymentChange(index, "to", e.target.value)}
                    placeholder="To (e.g. Jul 2023)"
                    autoComplete="off"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control"
                    rows="6"
                    value={emp.position}
                    onChange={(e) =>
                      handleEmploymentChange(index, "position", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    className="custom-select"
                    value={emp.reason_of_leaving}
                    onChange={(e) =>
                      handleEmploymentChange(index, "reason_of_leaving", e.target.value)
                    }
                  >
                    <option value="">Select Reason</option>
                    {reasons.map((reason, i) => (
                      <option key={i} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {index > 0 && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEmploymentDeleteRow(index)}
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
  )
}

export default EmploymentHistory