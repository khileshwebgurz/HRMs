import React from "react";

const OtherInfo = () => {
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
              <tr>
                <td>
                  {" "}
                  <input
                    type="hidden"
                    name="candidate_other_informations[question_id][{{$question->id}}]"
                    value="{{$question->id}}"
                  />
                </td>
                <td>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input"
                        type="radio"
                        name="candidate_other_informations[status][{{$question->id}}]"
                        value="1"
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      {" "}
                      <input
                        className="form-check-input"
                        type="radio"
                        name="candidate_other_informations[status][{{$question->id}}]"
                        value="0"
                      />{" "}
                      No
                    </label>
                  </div>
                </td>
                <td>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="candidate_other_informations[reason][{{$question->id}}]"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OtherInfo;
