import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
const SalarySlip = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  // const handleMonthChange = (e) => {
  //   const options = e.target.options;
  //   const values = [];
  //   for (let i = 0; i < options.length; i++) {
  //     if (options[i].selected) {
  //       values.push(options[i].value);
  //     }
  //   }
  //   setSelectedMonths(values);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected Months:", selectedMonths);
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/salary-slip`,

        {
          withCredentials: true,
        }
      );

      console.log("my res i s>>", res.data);
    } catch (error) {
      console.log("kjbsdjfbsjdf", error);
    }
  };

  const monthOptions = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

  return (
    <div className="container mt-4 spriit-club salary-slip-page">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Salary Slip</h3>
              <button
                type="button"
                className="btn btn-primary site-main-btn-2 font-weight-500 btn-reverse hide-show project-btn"
                onClick={handleToggleForm}
              >
                {showForm ? "Hide" : "Request Salary Slip"}
              </button>
            </div>

            <div className="card-body cstm-table-outer">
                            {/* Filters */}
              <div className="row justify-content-between mb-3">
                  <div className='col-sm-12 col-md-6'>
                  <div className='records-per-page'>
                    Show{" "}
                    <select class="custom-select custom-select-sm form-control form-control-sm">
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>{" "}
                    entries
                  </div>
                </div>

                <div className='col-sm-12 col-md-6'>
                  <div className="search-bar">
                    Search:{" "}
                    <input
                    class="form-control form-control-sm"
                      type="text"
                      placeholder="Search employees..."
                    />
                  </div>
                </div>
                </div>

              {showForm && (
                <div className="salary-month pt-3 pb-4 mb-4 d-flex flex-column border-bottom">
                  <h6>Select Month for Salary Slip</h6>
                  <form onSubmit={handleSubmit}>
                    <Select
                      options={monthOptions}
                      isMulti
                      value={monthOptions.filter((m) => selectedMonths.includes(m.value))}
                      onChange={(selected) => setSelectedMonths(selected.map((s) => s.value))}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                    <button type="submit" className="btn site-main-btn">
                        Submit
                      </button>
                  </form>
                  {/* <form onSubmit={handleSubmit}>
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
                  </form> */}
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
