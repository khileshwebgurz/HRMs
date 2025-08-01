import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const NewTicket = () => {
  const [employees, setEmployees] = useState([]);
  const fetchEmployees = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/all-employees?all=true`,
      {
        withCredentials: true,
      }
    );
    setEmployees(res.data.data);
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  console.log("got all employees >>>>", employees);
  return (
    <>
      {/* <LeftSideBar/> */}

      <div className="row">
        <div className="col-md-3">
          <div className="support-ticket-sidebar">
            <ul className="tabs" id="tabs">
              <li className="tab-link current" data-tab="tab-1">
                <Link to="/employee/ticket-system/alltickets">
                  <div className="tab-inner">
                    <span className="tab-name my-tickets">All Tickets</span>
                  </div>
                </Link>
              </li>
              <li className="tab-link" data-tab="tab-2">
                <Link to="/employee/support-ticket/newticket">
                  <div className="tab-inner">
                    <span className="tab-name new-ticket">New Ticket</span>
                  </div>
                </Link>
              </li>
              <li className="tab-link" data-tab="tab-2">
                <Link to="/employee/ticket-system/reports">
                  <div className="tab-inner">
                    <span className="tab-name new-ticket">Reports</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card card-primary add-tickets">
            <div className="main-header card-header">
              <h3 className="card-title">New Ticket</h3>
            </div>
            <div className="card-body" id="message">
              <div className="table-responsive mt-1">
                <form encType="multipart/form-data" id="problem">
                  <input
                    type="hidden"
                    name="user_role"
                    value="<?php echo Auth::user()->user_role; ?>"
                  />
                  <div className="mb-3">
                    <label className="form-label">Incident Type</label>
                    <select
                      className="browser-default custom-select"
                      name="issue"
                      id="incident"
                    >
                      <option value="select">Select</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Software">Software</option>
                      <option value="Server">Hosting Server</option>
                      <option value="Internet">Internet & Network</option>
                    </select>
                    <span className="text-danger" id="incident_msg">
                      Please select incident type.
                    </span>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Issue Level</label>
                    <select
                      className="browser-default custom-select"
                      name="level"
                      id="issue"
                    >
                      <option value="select">Select</option>
                      <option
                        value="P1"
                        id="p1"
                        data-name="Your issue solve in 30 to 60 minutes."
                      >
                        P1- Service Unuseable in Production
                      </option>
                      <option
                        value="P2"
                        id="p2"
                        data-name="Your issue solve upto 2 Hours."
                      >
                        P2- Service Partially not working
                      </option>
                      <option
                        value="P3"
                        id="p3"
                        data-name="Your issue solve upto 8 Hours."
                      >
                        P3- Service Partially Impaired
                      </option>
                      <option
                        value="P4"
                        id="p4"
                        data-name="Your issue solve upto 48 Hours."
                      >
                        P4- Service Useable
                      </option>
                    </select>
                    <span className="text-danger" id="issue_msg">
                      Please select issue level.
                    </span>
                    <span className="text-success" id="p1_msg"></span>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Employee</label>
                    <select
                      className="browser-default custom-select"
                      name="employee"
                      id="employee"
                    >
                      <option value="select">Select</option>

                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-danger" id="emp_msg">
                      Please select employee.
                    </span>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Description
                    </label>
                    <textarea
                      name="description"
                      className="form-control"
                      cols="3"
                      id="description"
                      rows="3"
                      placeholder="Describe Your Problem Here"
                    ></textarea>
                    <span className="text-danger" id="message_description">
                      Please fill description
                    </span>
                  </div>

                  <input
                    type="submit"
                    className="btn primary-site-main-btn text-uppercase border-radius-0"
                    name="submit"
                    id="submit"
                    value="Submit"
                  />
                  <button
                    className="btn primary-site-main-btn text-uppercase border-radius-0"
                    id="loader"
                    type="button"
                    disabled
                  >
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewTicket;
