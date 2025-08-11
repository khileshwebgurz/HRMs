import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const WarmLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('0');
  const [selectedIds, setSelectedIds] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
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
    fetchLeads(1, searchTerm, statusFilter);
  }, [searchTerm, statusFilter, perPage]);

  const handleStatusFilter = (e) => setStatusFilter(e.target.value);
  const handlePageChange = (page) => fetchLeads(page, searchTerm, statusFilter);
  const handlePerRowsChange = (newPerPage, page) => setPerPage(newPerPage);

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
      fetchLeads();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const columns = [
    {
      name: (
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
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => {
            if (selectedIds.includes(row.id)) {
              setSelectedIds(selectedIds.filter((id) => id !== row.id));
            } else {
              setSelectedIds([...selectedIds, row.id]);
            }
          }}
          aria-label={`Select lead with ID ${row.id}`}
        />
      ),
      width: '50px',
      style: { justifyContent: 'center', textAlign: 'center' },
    },
    {
      name: 'S.No.',
      selector: (row, index) => index + 1,
      width: '80px',
       style: { justifyContent: 'center', textAlign: 'center' },
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="btn-group btn-group-sm" role="group" aria-label="Lead actions">
          <button
            type="button"
            className="btn btn-info"
            title="View"
            onClick={() => handleViewLead(row.id)}
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            type="button"
            className="btn btn-danger"
            title="Reject"
            onClick={() => handleStatusUpdate(row.id, 'reject')}
          >
            <i className="fas fa-user-times"></i>
          </button>
          <button
            type="button"
            className="btn btn-success"
            title="Shortlist"
            onClick={() => handleStatusUpdate(row.id, 'shortlist')}
          >
            <i className="fas fa-user-check"></i>
          </button>
          <button
            type="button"
            className="btn btn-dark"
            title="Not Interested"
            onClick={() => handleStatusUpdate(row.id, 'not_interested')}
          >
            <i className="fas fa-ban"></i>
          </button>
        </div>
      ),
      width: '210px',
      style: { justifyContent: 'center', textAlign: 'center' },
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => {
        const statusMap = {
          '1': 'Pending',
          '2': 'Shortlisted',
          '3': 'Rejected',
          '4': 'Not Interested',
        };
        return (
          <span className={`badge ${row.status_class || 'badge-secondary'}`}>
            {statusMap[row.status?.toString()] || 'Unknown'}
          </span>
        );
      },
      width: '130px',
        style: { justifyContent: 'center', textAlign: 'center' },
    },
    {
      name: 'Date',
      selector: (row) => row.created_at,
      sortable: true,
      width: '140px',
       style: { justifyContent: 'center', textAlign: 'center' },
    },
    ...formFields.map((field) => ({
      name: field.label || field,
      selector: (row) => row[field] || '',
      cell: (row) => {
        const value = row[field] || '';
        if (typeof value === 'string' && value.match(/^(http|https):\/\//)) {
          const id = value.substring(value.lastIndexOf('/') + 1);
          return (
            <>
              {id}
              <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2">
                <i className="fas fa-download text-success"></i>
              </a>
            </>
          );
        }
        return value.length > 50 ? <ReadMoreText text={value} /> : value;
      },
      wrap: true,
    })),
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
                    fetchLeads();
                  }}
                >
                  Clear
                </button>
              </div>
            </form>

            <nav
              className="d-flex align-items-center gap-2 mb-3"
              aria-label="Bulk actions and export options"
            >
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

              <a
                className="btn btn-success btn-sm"
                href="/export-career"
                title="Export all job applications"
                role="button"
              >
                <i className="fas fa-file-export me-1" aria-hidden="true"></i> Export
              </a>
            </nav>

            <section aria-live="polite" aria-busy={loading} aria-label="Job applications list">
              <div className="table-responsive">
                <DataTable
                  columns={columns}
                  data={leads}
                  progressPending={loading}
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                  onChangePage={handlePageChange}
                  onChangeRowsPerPage={handlePerRowsChange}
                  highlightOnHover
                  noHeader
                  dense
                  customStyles={{
                    rows: { style: { minHeight: '65px' } },
                    cells: {
                      style: {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '160px',
                      },
                    },
                  }}
                  persistTableHead
                />
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};

// ReadMoreText Component for handling long text values
const ReadMoreText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const shortText = text.substring(0, 50);

  return (
    <span>
      {!expanded ? (
        <>
          {shortText}
          <button
            className="btn btn-link btn-sm p-0 ms-1"
            type="button"
            onClick={() => setExpanded(true)}
            aria-expanded="false"
            aria-label="Read more"
          >
            ...Read More
          </button>
        </>
      ) : (
        <>
          {text}
          <button
            className="btn btn-link btn-sm p-0 ms-1"
            type="button"
            onClick={() => setExpanded(false)}
            aria-expanded="true"
            aria-label="Read less"
          >
            ...Read Less
          </button>
        </>
      )}
    </span>
  );
};

export default WarmLeads;

