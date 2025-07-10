import React, { useState, useEffect } from "react";
import axios from "axios";

function ActiveCandidatesList() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/candidate/all-candidates`,
        { withCredentials: true }
      );
      setCandidates(response.data);
      setFilteredCandidates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setLoading(false);
    }
  };

  const handleDownload = async (fileType, dataType) => {
    try {
      const url =
        dataType === "users"
          ? `${
              import.meta.env.VITE_API_BASE_URL
            }/users/export-users?type=${fileType}`
          : `${
              import.meta.env.VITE_API_BASE_URL
            }/users/export-candidates?type=${fileType}`;

      const response = await axios.get(url, {
        responseType: "blob",
        withCredentials: true,
      });

      // Trigger file download
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });
      const link = document.createElement("a");
      const urlBlob = window.URL.createObjectURL(blob);
      link.href = urlBlob;
      link.setAttribute("download", `${dataType}-${Date.now()}.${fileType}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  // Call fetchCandidates on component mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Pagination logic

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteBtn = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/candidate/deleteCandidate/${id}`,
        { withCredentials: true }
      );
      const updatedCandidates = candidates.filter(
        (candidate) => candidate.id !== id
      );
      setCandidates(updatedCandidates);
    } catch (error) {
      console.error("Error while deleting Candidate", error);
    }
  };

  return (
    <div>
      <section className="content-header all-candidate-tracker">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>All Active Candidates</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Export Buttons */}
      <div className="col-sm-8 text-right all-btn-group">
        <button
          className="btn btn-success btn-sm"
          onClick={() => handleDownload("csv", "candidates")}
        >
          <i className="fas fa-download"></i> Download Candidates CSV
        </button>

        <button
          className="btn btn-success btn-sm"
          onClick={() => handleDownload("xlsx", "candidates")}
        >
          <i className="fas fa-download"></i> Download Candidates XLSX
        </button>

        <button
          className="btn btn-success btn-sm"
          onClick={() => handleDownload("csv", "users")}
        >
          <i className="fas fa-download"></i> Download Users CSV
        </button>

        <button
          className="btn btn-success btn-sm"
          onClick={() => handleDownload("xlsx", "users")}
        >
          <i className="fas fa-download"></i> Download Users XLSX
        </button>
      </div>

      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Position</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6">Loading candidates...</td>
                    </tr>
                  ) : (
                    paginatedCandidates.map((candidate, index) => (
                      <tr key={candidate.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{candidate.full_name}</td>
                        <td>{candidate.email}</td>
                        <td>{candidate.mobile_number}</td>
                        <td>{candidate.position}</td>
                        <td>{candidate.current_location}</td>
                        <td>
                          <button>Edit</button>
                          <button onClick={() => handleDeleteBtn(candidate.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActiveCandidatesList;
