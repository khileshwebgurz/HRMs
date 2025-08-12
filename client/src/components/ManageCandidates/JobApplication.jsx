import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobApplication = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('0');
  const [selectedIds, setSelectedIds] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchLeads = async (page = 1, search = '', status = '0') => {
    try {
      setLoading(true);
      const params = { page, per_page: perPage, q: search };
      if (status !== '0') {
        params.status = status;
      }
      const response = await axios.get(`${API_BASE}/career`, {
        params,
        withCredentials: true,
      });
      setLeads(response.data.data || []);
      setTotalRows(response.data.total || 0);
      setFormFields(response.data.form_fields || []);
      setSelectedIds([]); // Clear selected checkboxes on data load
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(currentPage, searchTerm, statusFilter);
  }, [searchTerm, statusFilter, perPage, currentPage]);

  const handleStatusFilter = (e) => setStatusFilter(e.target.value);
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when perPage changes
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) {
      alert('Please select at least one lead');
      return;
    }

    if (action === 'send_email') {
      const selectedLeads = leads.filter((lead) => selectedIds.includes(lead.id));
      const emailsToSend = selectedLeads.map((lead) => lead.email);
      console.log('Sending email to:', emailsToSend);
      // Add email logic here
    }
  };

    const handleExport = async () => {
    try {
      const response = await axios.get(`${API_BASE}/export-career`, {
        withCredentials: true,
        responseType: 'blob', // Important for file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'formsdata.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting file:', error);
    }
  };


  const handleViewLead = (leadId) => navigate(`/career/${leadId}`);

  const handleStatusUpdate = async (leadId, status) => {
    try {
      let endpoint = '';
      switch (status) {
        case 'reject':
          endpoint = `${API_BASE}/career/reject`;
          break;
        case 'shortlist':
          endpoint = `${API_BASE}/career/shortlist`;
          break;
        case 'not_interested':
          endpoint = `${API_BASE}/career/not-interested`;
          break;
        default:
          return;
      }
      await axios.post(endpoint, { lead_id: leadId }, { withCredentials: true });
      fetchLeads(currentPage);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const columns = [
    'S.No.',
    'Action',
    'Status',
    'Date',
    ...formFields.map((field) => field.label || field),
  ];

  return (
    <div className="content-wrapper p-4">
      <header className="content-header mb-3">
        <div className="container-fluid">
          <h1 className="h3 fw-bold">Job Applications</h1>
        </div>
      </header>

      <main>
        <section className="card shadow-sm">
          <div className="card-body">
            <form
              className="d-flex flex-column flex-md-row align-items-center gap-3 mb-3"
              onSubmit={(e) => {
                e.preventDefault();
                fetchLeads(1, searchTerm, statusFilter);
              }}
              aria-label="Search and filter job applications"
            >
              <div className="input-group input-group-sm flex-grow-1" role="search">
                <input
                  id="search-input"
                  type="search"
                  className="form-control"
                  placeholder="Search by any field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  id="status-filter"
                  className="form-select"
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  style={{ maxWidth: '180px' }}
                >
                  <option value="0">All Status</option>
                  <option value="1">Pending</option>
                  <option value="2">Shortlisted</option>
                  <option value="3">Rejected</option>
                  <option value="4">Not Interested</option>
                </select>
                <button type="submit" className="btn btn-danger">
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('0');
                    fetchLeads(1);
                  }}
                >
                  Clear
                </button>
              </div>
            </form>

            <nav className="d-flex align-items-center gap-2 mb-3" aria-label="Bulk actions and export options">
              <select
                id="bulk-action"
                className="form-select form-select-sm"
                onChange={(e) => handleBulkAction(e.target.value)}
                value=""
                style={{ minWidth: '150px' }}
              >
                <option value="">Bulk Action</option>
                <option value="send_email">Send Email</option>
              </select>

              <button
                className="btn btn-success btn-sm"
                onClick={handleExport}
                title="Export all job applications"
              >
                <i className="fas fa-file-export me-1" aria-hidden="true"></i> Export
              </button>

            </nav>

            <section aria-live="polite" aria-busy={loading} aria-label="Job applications list">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const currentPageIds = leads.map((row) => row.id);
                            if (isChecked) {
                              setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
                            } else {
                              setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
                            }
                          }}
                          checked={leads.length > 0 && leads.every((row) => selectedIds.includes(row.id))}
                          aria-label="Select all leads on current page"
                        />
                      </th>
                      {columns.map((col, index) => (
                        <th key={index}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <tr key={lead.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(lead.id)}
                            onChange={() => {
                              if (selectedIds.includes(lead.id)) {
                                setSelectedIds(selectedIds.filter((id) => id !== lead.id));
                              } else {
                                setSelectedIds([...selectedIds, lead.id]);
                              }
                            }}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group" aria-label="Lead actions">
                            <button
                              type="button"
                              className="btn btn-info"
                              title="View"
                              onClick={() => handleViewLead(lead.id)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              title="Reject"
                              onClick={() => handleStatusUpdate(lead.id, 'reject')}
                            >
                              <i className="fas fa-user-times"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-success"
                              title="Shortlist"
                              onClick={() => handleStatusUpdate(lead.id, 'shortlist')}
                            >
                              <i className="fas fa-user-check"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-dark"
                              title="Not Interested"
                              onClick={() => handleStatusUpdate(lead.id, 'not_interested')}
                            >
                              <i className="fas fa-ban"></i>
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${lead.status_class || 'badge-secondary'}`}>
                            {lead.status === '1' ? 'Pending' : lead.status === '2' ? 'Shortlisted' : lead.status === '3' ? 'Rejected' : 'Not Interested'}
                          </span>
                        </td>
                        <td>{lead.created_at}</td>
                        {formFields.map((field, idx) => (
                          <td key={idx}>{lead[field] || ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pagination */}
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => currentPage < Math.ceil(totalRows / perPage) && handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalRows / perPage)}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default JobApplication;
