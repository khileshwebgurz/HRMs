import { useState, useEffect } from "react";
import axios from "axios";

const AdminSalarySlip = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  const [formData, setFormData] = useState({
    gross_salary: 0,
    deduction: 0,
    fund: 100,
    bonus: 0,
    cash: 0,
    working: 0,
    fields: {
      salary_0: {
        subfields: [
          { field1: 0, field2: 0, field3: 0 }, // Basic
          { field1: 0, field2: 0, field3: 0 }, // HRA
          { field1: 0, field2: 0, field3: 0 }, // Conveyance
          { field1: 0, field2: 0, field3: 0 }, // Incentives
        ],
      },
    },
  });

  const fetchallSalary = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/adminsalary-slip`,
      { withCredentials: true }
    );

    setSalaryData(response.data.data);
  };



  useEffect(() => {
    fetchallSalary();
  }, []);

  const handleViewSlip = (slip) => {
    setSelectedSlip(slip);
    setShowModal(true);
  };

  // update form data
  const updateForm = (path, value) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (path.startsWith("fields.")) {
        // path like "fields.salary_0.subfields[0].field1"
        const parts = path.split(".");
        const indexMatch = parts[2].match(/\d+/); // extract subfield index
        const index = indexMatch ? parseInt(indexMatch[0], 10) : 0;
        const fieldKey = parts[3]; // e.g., "field1"
        newData.fields.salary_0.subfields[index][fieldKey] = Number(value);
      } else {
        newData[path] = Number(value);
      }
      return newData;
    });
  };

  // send payload to backend
  const handleGenerateSlip = async () => {
    try {
      const payload = {
        relation: selectedSlip.id, // backend requires relation id
        id: selectedSlip.id, // slip request id
        ...formData,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/adminsalary-slip-detail/insert`,
        payload,
        { withCredentials: true }
      );

      alert("Salary slip generated successfully!");
      fetchallSalary();
      setShowModal(false);
    } catch (error) {
      console.error("Error generating salary slip:", error);
      alert("Failed to generate salary slip.");
    }
  };

  return (
    <>
      <section className="content-header all-user-page">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="mb-3">All Salary Slip Requests</h1>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="card all-user-card">
            <div className="card-body">
              <div className="table-responsive">
                <table
                  className="table table-bordered table-striped wg_allusers"
                  style={{ borderCollapse: "collapse", width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Month</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryData.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>{item.month}</td>
                        <td>{item.status}</td>
                        <td>
                          {item.action === "Approved" ? (
                            <span className="badge bg-success">Approved</span>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleViewSlip(item)}
                            >
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedSlip && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Salary Slip</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <h6 className="text-center bg-dark text-white p-2">
                  {selectedSlip.month}, 2024
                </h6>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <p>
                      <strong>Name:</strong> {selectedSlip.name}
                    </p>
                    <p>
                      <strong>Employee Code:</strong> WGT-754
                    </p>
                    <p>
                      <strong>Designation:</strong> Quality Analyst
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Month:</strong> {selectedSlip.month}
                    </p>
                    <p>
                      <strong>Total Days:</strong> 30
                    </p>
                    <p>
                      <strong>Days Present:</strong> 21
                    </p>
                  </div>
                </div>

                <h6 className="fw-bold">EMOLUMENT</h6>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Particulars</th>
                      <th>Amount Rs.</th>
                      <th>Deduction</th>
                      <th>Amount Rs.</th>
                    </tr>
                  </thead>
                  <tbody>
                     {["Basic", "HRA", "Conveyance", "Incentives"].map(
                      (label, i) => (
                        <tr key={i}>
                          <td>{label}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.fields.salary_0.subfields[i].field1}
                              onChange={(e) =>
                                updateForm(
                                  `fields.salary_0.subfields[${i}].field1`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.fields.salary_0.subfields[i].field2}
                              onChange={(e) =>
                                updateForm(
                                  `fields.salary_0.subfields[${i}].field2`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.fields.salary_0.subfields[i].field3}
                              onChange={(e) =>
                                updateForm(
                                  `fields.salary_0.subfields[${i}].field3`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <p>
                      <strong>Gross Salary:</strong>{" "}
                     <input
                        type="number"
                        className="form-control"
                        value={formData.gross_salary0}
                        onChange={(e) =>
                          updateForm("gross_salary0", e.target.value)
                        }
                      />
                    </p>
                    <p>
                      <strong>Deductions:</strong>{" "}
                     <input
                        type="number"
                        className="form-control"
                        value={formData.deduction0}
                        onChange={(e) =>
                          updateForm("deduction0", e.target.value)
                        }
                      />
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Fund:</strong>{" "}
                       <input
                        type="number"
                        className="form-control"
                        value={formData.fund0}
                        onChange={(e) => updateForm("fund0", e.target.value)}
                      />
                    </p>
                    <p>
                      <strong>Bonus:</strong>{" "}
                      <input
                        type="number"
                        className="form-control"
                        value={formData.bonus0}
                        onChange={(e) => updateForm("bonus0", e.target.value)}
                      />
                    </p>
                    <p>
                      <strong>Cash in Hand:</strong>{" "}
                       <input
                        type="number"
                        className="form-control"
                        value={formData.cash0}
                        onChange={(e) => updateForm("cash0", e.target.value)}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleGenerateSlip}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSalarySlip;
