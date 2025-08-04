import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// users Controller
function ActiveCandidatesList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState({});
  const [statuses, setStatuses] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [showAptitudeModal, setShowAptitudeModal] = useState(false);
  const [aptitudeLink, setAptitudeLink] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');


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
            gender: selectedGender
          },
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
     console.log(response.data,'dataaafa');
      if (response.data) {
        setData(Array.isArray(response.data.data) ? response.data.data : []);
        setDepartments(response.data.departments || {});
        setStatuses(response.data.statuses || []);
    //    setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
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
  }, [currentPage, selectedDepartment, selectedStatus, selectedGender]);

  const handleDownload = async (type) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/candidate/all-candidates`,
        {
          params: { 
            export: type,
            department: selectedDepartment,
            status: selectedStatus,
            gender: selectedGender
          },
          responseType: 'blob',
          withCredentials: true
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `candidates-${Date.now()}.${type}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

 

   const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;
  try {
  const numericId = id.replace(/^HRM/, "");

    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/candidate/deleteCandidate/${numericId}`,
      { withCredentials: true }
    );

    const updatedCandidates = candidates.filter(
      (candidate) => candidate.id !== id
    );
    setCandidates(updatedCandidates);
     fetchData(currentPage); 
  } catch (error) {
    console.error("Error while deleting Candidate", error);
  }
};


  const handleEdit = (id) => {
     const numericId = id.replace(/^HRM/, "");
    navigate(`/users/edit-candidate/${numericId}`);
  //  navigate(/users/edit-candidate/${id});
  };

  // const handleStartOnboarding = (id) => {
  //   if (confirm('Are you sure You want to start Onboarding?')) {
  //     navigate(`/onboarding/start/${id}`);
  //   }
  // };

    const handleStartOnboarding = async (candidateId) => {

      if (confirm('Are you sure You want to start Onboarding?')) {
        const numericId = candidateId.replace("HRM", "");
            console.log(candidateId,'candidateId');
        console.log(numericId,'numericId');
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/start-onboarding/${numericId}`,
              { withCredentials: true }
            );

            console.log(response, 'response');
            alert("Candidate successfully onboarded!");
            // fetchCandidates(currentPage);

          } catch (error) {
            console.error("Error starting onboarding:", error);
            alert("Something went wrong during onboarding.");
          }
      }
    };

  // const filteredData = data.filter(candidate => {
  //   const departmentMatch = !selectedDepartment || 
  //     (departments[candidate.department] === departments[selectedDepartment]);
  //   const statusMatch = !selectedStatus || 
  //     candidate.status === statuses.find(s => s.id == selectedStatus)?.status_name;
  //   const genderMatch = !selectedGender || 
  //     candidate.gender?.toString() === selectedGender;
    
  //   return departmentMatch && statusMatch && genderMatch;
  // });

  const filteredData = data.filter(candidate => {
  const departmentMatch = !selectedDepartment || 
    (departments[candidate.department] === departments[selectedDepartment]);
  const statusMatch = !selectedStatus || 
    candidate.status === statuses.find(s => s.id == selectedStatus)?.status_name;
  const genderMatch = !selectedGender || 
    candidate.gender?.toString() === selectedGender;
  const searchMatch = !searchTerm || 
    candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.id.toLowerCase().includes(searchTerm.toLowerCase());

  return departmentMatch && statusMatch && genderMatch && searchMatch;
});

  return (
    <div className="container-fluid">
      <section className="content-header all-candidate-page">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-4">
              <h1>All Candidates</h1>
            </div>
          

            <div className="col-sm-8 text-right all-btn-group">
              <button 
                className="btn btn-success btn-sm"
                onClick={() => handleDownload('csv')}
              >
                <i className="fas fa-download"></i> Download CSV
              </button>
              <button 
                className="btn btn-success btn-sm site-main-btn-2"
                onClick={() => handleDownload('xlsx')}
              >
                <i className="fas fa-download"></i> Download XLSX
              </button>
            </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search by name or ID"
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
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {Object.entries(departments).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-control form-control-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.status_name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-control form-control-sm"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
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
                  <th><input type="checkbox" id="ckbCheckAll" /></th>
                  <th>Name</th>
                  <th>Candidate ID</th>
                  <th>Status</th>
                  <th>Date Applied</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8">Loading candidates...</td>
                  </tr>
                ) : (
                  filteredData.map((candidate) => (
                    <tr key={candidate.id}>
                      <td>
                        <input 
                          type="checkbox" 
                          className="checkBoxClass" 
                          value={candidate.email} 
                        />
                      </td>
                      <td>{candidate.full_name}</td>
                      <td>{candidate.id}</td>
                      <td>{candidate.candidate_status?.status_name || ''}</td>
                      <td>{new Date(candidate.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td>{candidate.position}</td>
                      <td>{candidate.department ? departments[candidate.department] : ''}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <a 
                            className="btn btn-info site-icon eye-icon" 
                            title="View" 
                            href={`/candidate-profile/${candidate.profile_id}`} 
                            target="_blank"
                          >
                            <i className="fas fa-eye"></i>
                          </a>
                          
                          <button 
                            className="btn btn-success site-icon comment-icon" 
                            style={{color: '#707070'}} 
                            title={`Name: ${candidate.full_name}\nRemarks: ${candidate.remarks}`}
                          >
                            <i className="fa fa-comment"></i>
                          </button>

                          {candidate.can_edit && (
                            <button
                              className="btn btn-success site-icon pencil-icon"
                              title="Edit"
                              style={{color: '#707070'}} 
                              onClick={() => handleEdit(candidate.id)}
                            >
                              <i className="fas fa-pencil-alt"></i>
                           </button>

                          
                          )}

                          {candidate.is_recruiter ? (
                            <button 
                              className="btn site-icon delete-icon" 
                              style={{backgroundColor: '#808080', borderColor: '#808080', color: '#fff'}}
                              title="Delete"
                              onClick={() => alert('You are not authorized with this permission please contact to HR for further.')}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          ) : candidate.can_delete && (
                            <button
                              className="btn btn-danger delete-icon site-icon"
                              title="Delete"
                               style={{color: '#707070'}} 
                              onClick={() => handleDelete(candidate.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}

                          <button
                            className={`btn btn-success site-icon menu-icon ${!candidate.can_onboard ? 'disabled' : ''}`}
                            title={candidate.can_onboard ? "Start Onboarding" : "Not ready for onboarding"}
                            onClick={() => candidate.can_onboard && handleStartOnboarding(candidate.id)}
                          >
                            <i className="fas fa-clipboard-check"></i>
                          </button>

                          <button
                            className="btn btn-warning wgz_send_aptutude site-icon paper-plane-icon"
                            title="Send Aptitude Test"
                            onClick={() => {
                              setAptitudeLink(`${import.meta.env.VITE_API_BASE_URL}/generate-test/${candidate.id}`);
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
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAptitudeModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Aptitude Test</h5>
                <button type="button" className="close" onClick={() => setShowAptitudeModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = aptitudeLink;
                }}>
                  <div className="form-group">
                    <label>Aptitude test from</label>
                    <div className="form-check">
                      <input
                        type="radio"
                        id="type_office"
                        name="type"
                        value="1"
                        defaultChecked
                        className="form-check-input"
                      />
                      <label htmlFor="type_office" className="form-check-label">Office</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id="type_home"
                        name="type"
                        value="2"
                        className="form-check-input"
                      />
                      <label htmlFor="type_home" className="form-check-label">Home</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id="type_skip"
                        name="type"
                        value="3"
                        className="form-check-input"
                      />
                      <label htmlFor="type_skip" className="form-check-label">Skip Test</label>
                    </div>
                  </div>
                  <div className="text-right">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveCandidatesList;