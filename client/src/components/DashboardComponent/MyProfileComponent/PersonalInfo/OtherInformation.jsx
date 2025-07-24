import React from "react";

const OtherInformation = ({employeedata}) => {
  return (
    <>
      <div className="card wgz-otherinfoQuiz">
        <div className="card-header">
          <h3 className="card-title form-header">Other Information</h3>
          <div className="card-tools wgz_value">
            <a
              // href="javascript:void(0)"
              className="btn btn-tool wgz-edit-form"
              data-id="wgz-otherinfoQuiz"
            >
              {" "}
              <i className="fas fa-edit"></i>
            </a>
          </div>

          <div className="card-tools wgz_field">
            <button
              type="button"
              className="btn btn-info btn-xs wgz-close-form mr-1"
              data-id="wgz-otherinfoQuiz"
            >
              <i className="fas fa-times"></i> Cancel
            </button>
            <a
              // href="javascript:void(0)"
              className="btn btn-success btn-xs wgz-submit mr-1"
              data-id="wgz-otherinfoQuiz"
            >
              {" "}
              <i className="fas fa-check"></i> Update
            </a>
          </div>
        </div>

        <div className="card-body  table-responsive">
          <table className="table table-bordered other-infomation">
            <thead>
              <tr>
                <th width="40%">DETAILS</th>
                <th width="10%">&nbsp;</th>
                <th>IF YES, PLEASE ELABORATE:</th>
              </tr>
            </thead>
             <tbody>
      {employeedata?.candidate_questions?.map((question) => (
        <tr className="wgz_field_table" key={question.id}>
          <td>
            <strong>{question.question}</strong>
            <input
              type="hidden"
              name={`other_informations[${question.id}][question_id]`}
              value={question.id}
            />
          </td>
          <td>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`other_informations[${question.id}][status]`}
                  value="1"
                  checked={question.status === "1" || question.status === 1}
                  readOnly
                />{" "}
                Yes
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`other_informations[${question.id}][status]`}
                  value="0"
                  checked={question.status === "0" || question.status === 0}
                  readOnly
                />{" "}
                No
              </label>
            </div>
          </td>
          <td>
            <textarea
              className="form-control"
              rows="2"
              name={`other_informations[${question.id}][reason]`}
              defaultValue={question.reason || ""}
              readOnly
            ></textarea>
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

export default OtherInformation;
