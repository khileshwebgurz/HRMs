import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import BulkEmailModal from "../ManageCandidates/BulkEmailModal";

function ActiveCandidatesList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState({});
  const [statuses, setStatuses] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [showAptitudeModal, setShowAptitudeModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [testType, setTestType] = useState("1");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedEmails, setCheckedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkEmail, setShowBulkEmail] = useState(false);
  const [bulkEmailList, setBulkEmailList] = useState("");

  const fetchData = async (page = 1) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/candidate/all-candidates`,
        {
          params: {
            page,
            limit: itemsPerPage,
            department: selectedDepartment,
            status: selectedStatus,
            gender: selectedGender,
            search: searchTerm
          },
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setData(Array.isArray(response.data.data) ? response.data.data : []);
        setDepartments(response.data.departments || {});
        setStatuses(response.data.statuses || []);
        setTotalPages(response.data.last_page || 1);
        setSelectAll(false);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to view candidates");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [
    currentPage,
    selectedDepartment,
    selectedStatus,
    selectedGender,
    itemsPerPage,
    searchTerm,
  ]);

  useEffect(() => {
    setCheckedEmails([]);
    setSelectAll(false);
  }, [data]);

  const handleDownload = async (type) => {
    const candidatesToExport =
      checkedEmails.length > 0
        ? data.filter((candidate) =>
            checkedEmails.includes(candidate.email)
          )
        : data;

    if (candidatesToExport.length === 0) {
      alert("No candidates to export");
      return;
    }

    try {
      if (type === "csv") {
        const headers = [
          "ID",
          "Name",
          "Email",
          "Status",
          "Department",
          "Position",
          "Date Applied",
          "Gender",
        ];

        const rows = candidatesToExport.map((candidate) => [
          candidate.id,
          candidate.full_name,
          candidate.email,
          candidate.candidate_status?.status_name || candidate.status || "",
          candidate.department || "",
          candidate.position || "",
          new Date(candidate.created_at).toLocaleDateString("en-GB"),
          candidate.gender === "1" ? "Male" : "Female",
        ]);

        const csvContent = [
          headers.join(","),
          ...rows.map((row) =>
            row
              .map(
                (field) => `"${(field || "").toString().replace(/"/g, '""')}"`
              )
              .join(",")
          ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `candidates-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const headers = [
          "ID",
          "Name",
          "Email",
          "Status",
          "Department",
          "Position",
          "Date Applied",
          "Gender",
        ];

        const rows = candidatesToExport.map((candidate) => [
          candidate.id,
          candidate.full_name,
          candidate.email,
          candidate.candidate_status?.status_name || candidate.status || "",
          candidate.department || "",
          candidate.position || "",
          new Date(candidate.created_at).toLocaleDateString("en-GB"),
          candidate.gender === "1" ? "Male" : "Female",
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
        XLSX.writeFile(workbook, `candidates-${Date.now()}.xlsx`);
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to export candidates");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;
    try {
      const numericId = id.replace(/^HRM/, "");
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/candidate/deleteCandidate/${numericId}`,
        { withCredentials: true }
      );
      fetchData(currentPage);
    } catch (error) {
      console.error("Error while deleting Candidate", error);
    }
  };

  const handleEdit = (id) => {
    const numericId = id.replace(/^HRM/, "");
    navigate(`/users/edit-candidate/${numericId}`);
  };

  const handleStartOnboarding = async (candidateId) => {
    if (confirm("Are you sure You want to start Onboarding?")) {
      const numericId = candidateId.replace("HRM", "");
      try {
        await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/start-onboarding/${numericId}`,
          { withCredentials: true }
        );
        alert("Candidate successfully onboarded!");
      } catch (error) {
        console.error("Error starting onboarding:", error);
        alert("Something went wrong during onboarding.");
      }
    }
  };

  const handleCheckboxChange = (email) => {
    setCheckedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };


  const handleBulkAction = (action) => {
      if (checkedEmails.length === 0) {
        alert("Please select at least one candidate");
        return;
      }

      if (action === "send_email") {
        setBulkEmailList(checkedEmails.join(", "));
        setShowBulkEmail(true);
      }
    };


  const handleCheckAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allEmails = data.map((c) => c.email);
      setCheckedEmails(allEmails);
    } else {
      setCheckedEmails([]);
    }
  };

  const handleRecordsPerPage = (e) => {
    setItemPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSendAptitudeTest = async () => {
    if (!selectedCandidateId) return;
    
    setIsSendingTest(true);
    try {
      const numericId = selectedCandidateId.replace(/^HRM/, "");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/generate-test/${numericId}`,
        { type: testType },
        { withCredentials: true }
      );

      if (response.data.status === 'success') {
        alert('Test sent to candidate successfully!');
        setShowAptitudeModal(false);
        fetchData(currentPage);
      } else if (response.data.status === 'already_exists') {
        alert('A test is already assigned to this candidate.');
      }
    } catch (error) {
      console.error('Error sending test:', error);
      alert('Failed to send test. Please try again.');
    } finally {
      setIsSendingTest(false);
    }
  };

  return (

    <>
     <BulkEmailModal
        show={showBulkEmail}
        onClose={() => setShowBulkEmail(false)}
        emails={bulkEmailList}
        refreshList={() => fetchData(currentPage)}  // use your candidate fetch function
      />


       <div className="container-fluid">
      <section className="content-header all-candidate-page">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-4">
              <h1>All Candidates</h1>

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
            </div>
            <div className="col-sm-8 text-right all-btn-group">
              {checkedEmails.length > 0 && (
                <span className="mr-2 text-muted">
                  {checkedEmails.length} selected
                </span>
              )}
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleDownload("csv")}
              >
                <i className="fas fa-download"></i>
                {checkedEmails.length > 0
                  ? "Export Selected (CSV)"
                  : "Export All (CSV)"}
              </button>
              <button
                className="btn btn-success btn-sm ml-2"
                onClick={() => handleDownload("xlsx")}
              >
                <i className="fas fa-download"></i>
                {checkedEmails.length > 0
                  ? "Export Selected (XLSX)"
                  : "Export All (XLSX)"}
              </button>
               {/* <select
                name=""
                className="btn btn-success btn-sm site-main-btn-2"
                id="wgz_action"
              >
                <option value="">Bulk Action</option>
                <option value="send_email">Send Email</option>
              </select> */}

               <select
                id="bulk-action"
                className="btn btn-success btn-sm site-main-btn-2"
                onChange={(e) => handleBulkAction(e.target.value)}
                value=""
                style={{ minWidth: "150px" }}
              >
                <option value="">Bulk Action</option>
                <option value="send_email">Send Email</option>
              </select>

            </div>
            <div className="col-md-3 mt-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search by name or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="card all-candidate-card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <select
                className="form-control form-control-sm"
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Departments</option>
                {Object.entries(departments).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-control form-control-sm"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1)
                }}
              >
                <option value="">All Status</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.status_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-control form-control-sm"
                value={selectedGender}
                onChange={(e) => {
                  setSelectedGender(e.target.value),
                  setCurrentPage(1)
                }}
              >
                <option value="">All Gender</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped wg_allusers">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="ckbCheckAll"
                      checked={selectAll}
                      onChange={handleCheckAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Candidate ID</th>
                  <th>Status</th>
                  <th>Date Applied</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Total Experience</th>
                  <th>Relevant Experience</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Education</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Current Employer</th>
                  <th>Current Salary</th>
                  <th>Expected Salary</th>
                  <th>Sourcing</th>
                  <th>Date of Interview</th>
                  <th>Interviewed</th>
                  <th>Interview Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="21" className="text-center">
                      Loading candidates...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="21" className="text-center">
                      No candidates found matching your criteria
                    </td>
                  </tr>
                ) : (
                  data.map((candidate) => (
                    <tr key={candidate.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="checkBoxClass"
                          checked={checkedEmails.includes(candidate.email)}
                          onChange={() => handleCheckboxChange(candidate.email)}
                        />
                      </td>
                      <td>{candidate.full_name}</td>
                      <td>{candidate.id}</td>
                      <td>
                        {candidate.candidate_status?.status_name ||
                          candidate.status ||
                          ""}
                      </td>
                      <td>
                        {new Date(candidate.created_at).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td>{candidate.position || ""}</td>
                      <td>{candidate.department || ""}</td>
                      <td>{candidate.total_experience || ""}</td>
                      <td>{candidate.total_relevant_experience || ""}</td>
                      <td>{candidate.age || ""}</td>
                      <td>{candidate.gender === "1" ? "Male" : "Female"}</td>
                      <td>{candidate.education || ""}</td>
                      <td>{candidate.mobile_number || ""}</td>
                      <td>{candidate.email || ""}</td>
                      <td>{candidate.current_employer || ""}</td>
                      <td>{candidate.current_salary || ""}</td>
                      <td>{candidate.expected_salary || ""}</td>
                      <td>{candidate.sourcing || ""}</td>
                      <td>{candidate.date_of_interview || ""}</td>
                      <td>{candidate.interviewed_by || ""}</td>
                      <td>{candidate.interview_score || ""}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <a
                            className="btn btn-info site-icon eye-icon"
                            title="View"
                            href={`/profile/${candidate.profile_id}/view`}
                            target="_blank"
                          >
                            <i className="fas fa-eye"></i>
                          </a>

                          <button
                            className="btn btn-success site-icon comment-icon"
                            style={{ color: "#707070" }}
                            title={`Name: ${candidate.full_name}\nRemarks: ${candidate.status}`}
                          >
                            <i className="fa fa-comment"></i>
                          </button>

                          {candidate.can_edit && (
                            <button
                              className="btn btn-success site-icon pencil-icon"
                              title="Edit"
                              style={{ color: "#707070" }}
                              onClick={() => handleEdit(candidate.id)}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>
                          )}

                          {candidate.is_recruiter ? (
                            <button
                              className="btn site-icon delete-icon"
                              style={{
                                backgroundColor: "#808080",
                                borderColor: "#808080",
                                color: "#fff",
                              }}
                              title="Delete"
                              onClick={() =>
                                alert(
                                  "You are not authorized with this permission please contact to HR for further."
                                )
                              }
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          ) : (
                            candidate.can_delete && (
                              <button
                                className="btn btn-danger delete-icon site-icon"
                                title="Delete"
                                style={{ color: "#707070" }}
                                onClick={() => handleDelete(candidate.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            )
                          )}

                          <button
                            className={`btn btn-success site-icon menu-icon ${
                              !candidate.can_onboard ? "disabled" : ""
                            }`}
                            title={
                              candidate.can_onboard
                                ? "Start Onboarding"
                                : "Not ready for onboarding"
                            }
                            onClick={() =>
                              candidate.can_onboard &&
                              handleStartOnboarding(candidate.id)
                            }
                            style={{
                              backgroundColor: "#28a745",
                              color: "white",
                              borderColor: "#28a745",
                              opacity: candidate.can_onboard ? 1 : 0.35,
                              padding: "0.25rem 0.5rem",
                              margin: "0 2px",
                            }}
                          >
                            <i className="fas fa-clipboard-check"></i>
                          </button>

                          <button
                            className="btn btn-warning wgz_send_aptutude site-icon paper-plane-icon"
                            title="Send Aptitude Test"
                            onClick={() => {
                              setSelectedCandidateId(candidate.id);
                              setShowAptitudeModal(true);
                            }}
                          >
                            <i className="fas fa-paper-plane"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div>
              <button
                className="btn btn-outline-secondary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
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

      {showAptitudeModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Aptitude Test</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => {
                    setShowAptitudeModal(false);
                    setSelectedCandidateId(null);
                  }}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Aptitude test type</label>
                  <div className="form-check">
                    <input
                      type="radio"
                      id="type_office"
                      name="type"
                      value="1"
                      checked={testType === "2"}
                      onChange={() => setTestType("2")}
                      className="form-check-input"
                    />
                    <label htmlFor="type_office" className="form-check-label">
                      Office (No OTP)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      id="type_home"
                      name="type"
                      value="2"
                      checked={testType === "1"}
                      onChange={() => setTestType("1")}
                      className="form-check-input"
                    />
                    <label htmlFor="type_home" className="form-check-label">
                      Home (without OTP verification)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      id="type_skip"
                      name="type"
                      value="3"
                      checked={testType === "3"}
                      onChange={() => setTestType("3")}
                      className="form-check-input"
                    />
                    <label htmlFor="type_skip" className="form-check-label">
                      Skip Test
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAptitudeModal(false)}
                  disabled={isSendingTest}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSendAptitudeTest}
                  disabled={isSendingTest}
                >
                  {isSendingTest ? 'Sending...' : 'Send Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
   
  );
}

export default ActiveCandidatesList;