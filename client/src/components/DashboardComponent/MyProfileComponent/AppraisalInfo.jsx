import React from "react";

const AppraisalInfo = ({employeedata}) => {
  console.log('here is my appraisal info ', employeedata)
  return (
    <>
      <section className="content info-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
                <div className="card-body1" id="personalForm">
                  {/* changed className from tab-content to tab-content-1 */}
                  <div className="tab-content-1" id="custom-tabs-four-tabContent">
                      <div className="card wgz-basicinfo card-panel  mt-2">
                        <div className="card-header">
                          <h3 className="card-title form-header">Basic info</h3>
                        </div>

                        <div className="card-body">
                          <div className="row">
                            <div className="col-12">
                               Coming Soon
                            </div>
                            </div>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppraisalInfo;
