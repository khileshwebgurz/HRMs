import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../../../context/UserContext";
import { Link } from "react-router-dom";

const NewTicket = () => {
  const user = useUser();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    user_role: user.role_id,
    issue: "",
    level: "",
    employee: "",
    description: "",
  });
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/addTicket`,
        form,
        { withCredentials: true }
      );
      if (response.data.status === 200) {
        alert("Ticket submitted successfully!");
        // Clear form
        setForm({
          user_role: user.role_id,
          issue: "",
          level: "",
          employee: "",
          description: "",
        });
      }else{
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting ticket", error);
      alert("Something went wrong while submitting ticket");
    }
  };

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
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">Create New Ticket</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Incident Type */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Incident Type</label>
                  <select
                    className="form-select"
                    name="issue"
                    value={form.issue}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Server">Hosting Server</option>
                    <option value="Internet">Internet & Network</option>
                  </select>
                </div>

                {/* Issue Level */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Issue Level</label>
                  <select
                    className="form-select"
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="P1">
                      P1 - Service Unusable in Production
                    </option>
                    <option value="P2">
                      P2 - Service Partially Not Working
                    </option>
                    <option value="P3">P3 - Service Partially Impaired</option>
                    <option value="P4">P4 - Service Usable</option>
                  </select>
                </div>

                {/* Employee */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Assign To</label>
                  <select
                    className="form-select"
                    name="employee"
                    value={form.employee}
                    onChange={handleChange}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    placeholder="Describe your problem here..."
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 text-uppercase"
                >
                  Submit Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewTicket;
