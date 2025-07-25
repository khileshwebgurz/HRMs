import { useState } from "react";

const OtherInformation = ({ employeedata }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };


  return (
    <>
      <div className="card wgz-otherinfoQuiz">
        <div className="card-header">
          <h3 className="card-title form-header">Other Information</h3>
          {!isEditing && (
            <div className="card-tools wgz_value">
              <a
                onClick={handleEditClick}
                className="btn btn-tool wgz-edit-form"
                data-id="wgz-otherinfoQuiz"
              >
                {" "}
                <i className="fas fa-edit"></i>
              </a>
            </div>
          )}

          {isEditing && (
            <div className="card-tools wgz_field">
              <button
                type="button"
                className="btn btn-info btn-xs wgz-close-form mr-1"
                data-id="wgz-otherinfoQuiz"
                onClick={handleCancelClick}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <a
                onClick={() => setIsEditing(false)}
                className="btn btn-success btn-xs wgz-submit mr-1"
                data-id="wgz-otherinfoQuiz"
              >
                {" "}
                <i className="fas fa-check"></i> Update
              </a>
            </div>
          )}
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
                    {isEditing ? (
                      <>
                        <div className="form-check form-check-inline">
                          <label className="form-check-label">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`other_informations[${question.id}][status]`}
                              value="1"
                              checked={
                                question.status === "1" || question.status === 1
                              }
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
                              checked={
                                question.status === "0" || question.status === 0
                              }
                              readOnly
                            />{" "}
                            No
                          </label>
                        </div>
                      </>
                    ) : (
                      <div className="wgz_value">
                        {employeedata?.candidate_questions?.status === "1"
                          ? "Yes"
                          : employeedata?.candidate_questions?.status === "0"
                          ? "No"
                          : "N/A"}
                      </div>
                    )}
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
