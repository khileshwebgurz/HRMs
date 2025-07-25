import React, { useState } from "react";
import axios from "axios";
const SalarySlip = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleMonthChange = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setSelectedMonths(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected Months:", selectedMonths);
    // Call your API here with selectedMonths
    try {
      const res = await axios.get(
        `http://localhost:8000/api/salary-slip`,

        {
          withCredentials: true,
        }
      );

      console.log("my res i s>>", res.data);
    } catch (err) {
      console.log("kjbsdjfbsjdf");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-primary">
            <div className="card-header salary-slip-header d-flex justify-content-between align-items-center">
              <h3 className="card-title">Salary Slip</h3>
              <button
                type="button"
                className="btn btn-primary site-main-btn-2 font-weight-500 btn-reverse hide-show"
                onClick={handleToggleForm}
              >
                {showForm ? "Hide" : "Request Salary Slip"}
              </button>
            </div>

            <div className="card-body">
              {showForm && (
                <div className="salary-month pt-3 pb-4 mb-4 d-flex flex-column border-bottom">
                  <h6>Select Month for Salary Slip</h6>
                  <form onSubmit={handleSubmit}>
                    <select
                      className="js-example-basic-multiple form-control"
                      required
                      name="months"
                      id="months"
                      multiple
                      style={{ width: "200px" }}
                      value={selectedMonths}
                      onChange={handleMonthChange}
                    >
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>

                    <button type="submit" className="btn site-main-btn mt-3">
                      Submit
                    </button>
                  </form>
                </div>
              )}

              <div className="table-responsive">
                <table
                  id="example1"
                  className="table table-striped wg_salaryslip border-collapse"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Months</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>{/* Render slip data here */}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlip;
