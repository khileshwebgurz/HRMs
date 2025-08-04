import React from "react";

const OtherInfo = ({ otherInfo, setOtherInfo }) => {

  const handleStatusChange = (index, value) => {
    const updated = [...otherInfo];
    updated[index].status = value;
    setOtherInfo(updated);
  };

  const handleReasonChange = (index, value) => {
    const updated = [...otherInfo];
    updated[index].reason = value;
    setOtherInfo(updated);
  };
  return (
    <>
      <div className="card">
        <div className="card-header">
          Other Information<span className="req">*</span>
        </div>
        <div className="card-body">
          <table className="table table-bordered ">
            <thead>
              <tr>
                <th width="40%">DETAILS</th>
                <th width="10%">&nbsp;</th>
                <th>IF YES, PLEASE ELABORATE:</th>
              </tr>
            </thead>
            <tbody>
             {otherInfo.map((question, index) => (
                <tr key={question.id}>
                  <td>{question.question}</td>
                  <td>
                    <div className="form-check form-check-inline">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`status-${question.id}`}
                          value="1"
                          checked={question.status === "1"}
                          onChange={() => handleStatusChange(index, "1")}
                        />
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`status-${question.id}`}
                          value="0"
                          checked={question.status === "0"}
                          onChange={() => handleStatusChange(index, "0")}
                        />
                        No
                      </label>
                    </div>
                  </td>
                  <td>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={question.reason}
                      onChange={(e) =>
                        handleReasonChange(index, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OtherInfo;
