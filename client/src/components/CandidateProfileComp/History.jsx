import React from "react";

const History = () => {
  return (
    <>
      <div
        // className="tab-pane fade"
        id="custom-tabs-four-profile"
        role="tabpanel"
        aria-labelledby="custom-tabs-four-profile-tab"
      >
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header form-header">Assessment Section</div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered " id="wgz_assessments">
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th>Weight age</th>
                      <th>Score (out of 10)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Aptitude Test Score</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Technical Test (Theoretical)</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Technical Test (Practical)</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>HR Round</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
