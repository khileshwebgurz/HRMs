import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, [candidates]);

  useEffect(() => {
    applySearchAndSort();
  }, [searchTerm, candidates, sortField, sortOrder]);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/candidates`,
        { withCredentials: true }
      );
      setCandidates(response.data.data);
      setFilteredCandidates(response.data.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const applySearchAndSort = () => {
    let filtered = [...candidates];

    // Filter
    if (searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.full_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortField) {
      filtered.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredCandidates(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleBrnClick = (url) =>{ 
    console.log('url is >>',url)
    navigate(`${url}`);}


  const handleEditClick = (url) => navigate(`/candidate${url}`);

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteBtn = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/candidates/${id}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.error("cannot delete bcz of this issue ->", error);
    }
  };

  console.log('my paginated candidate is >>', paginatedCandidates)

  return (
    <div className="container mt-4">
      <h1>All Candidates</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control my-3"
      />

      {loading ? (
        <p>Loading candidates...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th
                    onClick={() => handleSort("full_name")}
                    style={{ cursor: "pointer" }}
                  >
                    Name{" "}
                    {sortField === "full_name" &&
                      (sortOrder === "asc" ? "⬆️" : "⬇️")}
                  </th>
                  <th>Candidate ID</th>
                  <th>LinkedIn</th>
                  <th
                    onClick={() => handleSort("created_at")}
                    style={{ cursor: "pointer" }}
                  >
                    Date Applied{" "}
                    {sortField === "created_at" &&
                      (sortOrder === "asc" ? "⬆️" : "⬇️")}
                  </th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Notice Period</th>
                  <th>Current Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCandidates.map((row, index) => (
                  <tr key={row.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{row.full_name}</td>
                    <td>{row.id}</td>
                    <td>
                      <a
                        href={row.linked_in}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </td>
                    <td>{row.created_at}</td>
                    <td>{row.email}</td>
                    <td>{row.mobile_number}</td>
                    <td>{row.notice_period}</td>
                    <td>{row.current_location}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() => handleBrnClick(row.action?.view_url)}
                          className="btn btn-info"
                        >
                          👁️
                        </button>
                        {row.action.edit_allowed && (
                          <button
                            onClick={() => handleEditClick(row.action.edit_url)}
                            className="btn btn-success"
                          >
                            ✏️
                          </button>
                        )}
                        {row.action.delete_allowed && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (window.confirm("Are you sure?")) {
                                handleDeleteBtn(row.id.replace("HRM", ""));
                              }
                            }}
                            className="btn btn-danger"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div>
              <button
                className="btn btn-outline-secondary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CandidateList;