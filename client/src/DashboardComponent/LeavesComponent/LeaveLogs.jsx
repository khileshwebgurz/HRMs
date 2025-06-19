import React from "react";

const LeaveLogs = ({ myLeaves, onDelete }) => {
  if (!myLeaves || myLeaves.length === 0) {
    return <p>No leave logs found.</p>;
  }

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
              <td>
                {log.status === "Pending" ? (
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(log.id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveLogs;
