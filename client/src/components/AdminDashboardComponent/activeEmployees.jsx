import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ActiveEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemPerPage] = useState(10);

  const fetchEmployees = async (page = 1, term = searchTerm, limit = itemsPerPage) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/all-employees?page=${page}&limit=${limit}&search=${encodeURIComponent(
          term
        )}`,
        {
          withCredentials: true,
        }
      );
      setEmployees(res.data.data);
      // setCurrentPage(res.data.current_page);
      setTotalPages(res.data.last_page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEmployees(1, searchTerm);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/delete-employee/${id}`,
        { withCredentials: true }
      );

      // remember to update the state after deleting to immediately show fresh data instead of refetching api.
      const updatedEmployees = employees.filter((emp) => emp.id !== id);
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error("Error while deleting Candidate", error);
    }
  };

  const handleToggle = (empId) => {
    const updatedList = employees.map((emp) =>
      emp.id === empId
        ? { ...emp, status: emp.status === "Active" ? "Inactive" : "Active" }
        : emp
    );
    setEmployees(updatedList);
  };

  const handleRecordsPerPage = (e) => {
    setItemPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>All Employees</h3>
        <div>
          Show{" "}
          <select value={itemsPerPage} onChange={handleRecordsPerPage}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>{" "}
          entries
        </div>

        <button
          className="btn btn-dark"
          onClick={() => navigate("/add-employee")}
        >
          + Add Employee
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="form-control my-3"
      />

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Manager</th>
            <th>Gender</th>
            <th>Progress</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Loading Employees...</td>
            </tr>
          ) : (
            employees?.map((emp, index) => (
              <tr key={emp.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                {/* Status toggle */}
                <td>
                  <label className="form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={emp.status === "Active"}
                      onChange={() => handleToggle(emp.id)}
                      readOnly
                    />
                  </label>
                </td>

                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone || "-"}</td>
                <td>{emp.manager}</td>
                <td>{emp.gender}</td>

                {/* Progress Bar */}
                <td style={{ minWidth: "120px" }}>
                  <div className="d-flex align-items-center">
                    <div
                      className="progress flex-grow-1"
                      style={{ height: "8px", marginRight: "6px" }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${emp.progress}%`,
                          backgroundColor:
                            emp.progress > 0 ? "#0d6efd" : "#dee2e6",
                        }}
                        aria-valuenow={emp.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                    <span className="text-danger small">{emp.progress}%</span>
                  </div>
                </td>

                {/* Action Icons */}
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    title="Edit"
                    onClick={() => navigate(`/edit-employee/${emp.id}`)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() =>
                      navigate(`/users/employee/${emp.id}/view/personal`)
                    }
                    title="View"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(emp.id)}
                    className="btn btn-sm btn-outline-danger me-1"
                    title="Delete"
                  >
                    🗑️
                  </button>
                  <button className="btn btn-sm btn-outline-dark" title="Exit">
                    🔐
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {/* {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn me-2 ${
                currentPage === i + 1 ? "btn-primary" : "btn-outline-secondary"
              }`}
              disabled={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))} */}

          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveEmployees;
