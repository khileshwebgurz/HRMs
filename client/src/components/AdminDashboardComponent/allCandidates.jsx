import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/candidates`,
        { withCredentials: true }
      );
      console.log(response);
      setCandidates(response.data.data); // datatables returns { data: [...] }
      
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrnClick=(urls)=>{
    Navigate(`${urls}`);
  }

  const handleEditClick=(urls)=>{
    Navigate(`/candidate${urls}`);
  }

  const columns = [
    { name: '#', selector: (row, i) => i + 1, width: '60px' },
    { name: 'Name', selector: row => row.full_name },
    { name: 'Candidate ID', selector: row => row.id },
    { name: 'LinkedIn', selector: row => row.linked_in },
    { name: 'Date Applied', selector: row => row.created_at },
    { name: 'Email', selector: row => row.email },
    { name: 'Phone', selector: row => row.mobile_number },
    { name: 'Notice Period', selector: row => row.notice_period },
    { name: 'Current Location', selector: row => row.current_location },
    {
      name: 'Actions',
      cell: row => (
        <div className="btn-group">
            <button onClick={()=>handleBrnClick(row.action.view_url)} className="btn btn-info" target="_blank">👁️</button>
          {/* <a href={row.action.view_url} >👁️</a> */}
          {row.action.edit_allowed && (
            // <a href={row.action.edit_url} className="btn btn-success">✏️</a>
            <button onClick={()=>handleEditClick(row.action.edit_url)} className="btn btn-success" target="_blank">✏️</button>
          )}
          {row.action.delete_allowed && (
            <a
              href={row.action.delete_url}
              className="btn btn-danger"
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm('Are you sure?')) {
                  window.location.href = row.action.delete_url;
                }
              }}
            >🗑️</a>
          )}
          <a href={row.action.send_email_url} className="btn btn-warning">📧</a>
        </div>
      )
    }
  ];

  return (
    <div className="container">
      <h1>All Candidates</h1>
      <DataTable
        columns={columns}
        data={candidates}
        progressPending={loading}
        pagination
        highlightOnHover
      />
    </div>
  );
};

export default CandidateList;
