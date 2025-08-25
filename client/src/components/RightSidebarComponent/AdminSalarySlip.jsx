import { useState, useEffect } from "react";
import axios from "axios";

const AdminSalarySlip = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  console.log(selectedSlip,'selectedSlip');
  const fetchallSalary = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/adminsalary-slip`,
      { withCredentials: true }
    );

    setSalaryData(response.data.data);
  };

    const handleGenerateSlip = async () => {
      try {
      const response = await axios.post(
          "http://localhost:8000/api/adminsalary-slip-detail/insert",
          { slipData: selectedSlip }, // Adjust payload as needed
          { withCredentials: true }
        );
        alert("Salary slip generated successfully!");

        // Optionally, refresh the salary data
        fetchallSalary();
        setShowModal(false);


      } catch (error) {
        console.error("Error generating salary slip:", error);
        alert("Failed to generate salary slip.");

      }

    };

  useEffect(() => {
    fetchallSalary();
  }, []);

  const handleViewSlip = (slip) => {
    setSelectedSlip(slip);
    setShowModal(true);
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
                    <tr>
                      <td>Basic</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>House Rent Allowance (HRA)</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Conveyance Allowance</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Other Incentives</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={0}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <p>
                      <strong>Gross Salary:</strong>{" "}
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={0}
                      />
                    </p>
                    <p>
                      <strong>Deductions:</strong>{" "}
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={0}
                      />
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Fund:</strong>{" "}
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={100}
                      />
                    </p>
                    <p>
                      <strong>Bonus:</strong>{" "}
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={0}
                      />
                    </p>
                    <p>
                      <strong>Cash in Hand:</strong>{" "}
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={-100}
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
                <button className="btn btn-success" onClick={handleGenerateSlip}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSalarySlip;
