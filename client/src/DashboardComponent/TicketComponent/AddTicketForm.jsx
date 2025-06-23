import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
const AddTicketForm = ({ userRole, currentUserId }) => {
  const [formData, setFormData] = useState({
    user_role: userRole,
    issue: "",
    level: "",
    employee: "",
    description: "",
  });

  console.log(userRole ,'and', currentUserId)
  const [employees, setEmployees] = useState([]);

  // Fetch all employees if user is admin/manager
  useEffect(() => {
    if (userRole === "3" || currentUserId === 1) {
      axios
        .get("http://localhost:8000/api/employees", { withCredentials: true })
        .then((res) => setEmployees(res.data))
        .catch((err) => console.error("Error loading employees", err));
    }
  }, [userRole, currentUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTicket = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/addTicket",
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.status === 200) {
        alert("✅ Ticket submitted successfully!");
        // Clear form
        setFormData({
          user_role: userRole,
          issue: "",
          level: "",
          employee: "",
          description: "",
        });
      } else {
        alert("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting ticket", error);
      alert("❌ Something went wrong while submitting the ticket.");
    }
  };
  return (
    <>
     <div className="col-lg-9">
      <div className="support-ticket-content">
        <div className="card card-primary add-tickets">
          <div className="main-header card-header">
            <h3 className="card-title">New Ticket</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddTicket}>
              {/* Incident Type */}
              <div className="mb-3">
                <label className="form-label">Incident Type</label>
                <select
                  className="form-select"
                  name="issue"
                  value={formData.issue}
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
                <label className="form-label">Issue Level</label>
                <select
                  className="form-select"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="P1">P1 - Service Unusable in Production</option>
                  <option value="P2">P2 - Service Partially Not Working</option>
                  <option value="P3">P3 - Service Partially Impaired</option>
                  <option value="P4">P4 - Service Usable</option>
                </select>
              </div>

              {/* Employee (if admin or manager) */}
              {(userRole === "3" || currentUserId === 1) && (
                <div className="mb-3">
                  <label className="form-label">Employee</label>
                  <select
                    className="form-select"
                    name="employee"
                    value={formData.employee}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe your problem here"
                  required
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn primary-site-main-btn text-uppercase border-radius-0"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AddTicketForm;
