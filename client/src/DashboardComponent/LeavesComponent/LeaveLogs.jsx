

import React from "react";

const LeaveLogs = ({ myLeaves }) => {
  if (!myLeaves || myLeaves.length === 0) {
    return "No leave logs found";
  }

 

 
  const handleDelete = (logId) => {
    console.log("Deleting leave ID:", logId);
    // Call API or confirm dialog
  };

  return (
    <div className="table-responsive mt-3">
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Applied</th>
            <th>Status</th>
            <th>Applied On</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
            {myLeaves.map((log, index) => (
              <tr key={index}>
                <td>{log.leave_type}</td>
                <td>{log.start_date}</td>
                <td>{log.end_date}</td>
                <td>{log.total_applied_leaves}</td>
                <td>{log.status}</td>
                <td>{log.created_at}</td>
                <td dangerouslySetInnerHTML={{ __html: log.action }} />
              </tr>
            ))}
          </tbody>

      </table>
    </div>
  );
};

export default LeaveLogs;
