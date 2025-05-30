import React from "react";

const AppraisalInfo = () => {
  return (
    <>
      <section className="content mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary shadow-none">
                <div className="card-header">
                  <h3 className="card-title ">Performance/Appraisal</h3>
                </div>
                <div className="card-body1" id="personalForm">
                  {/* changed className from tab-content to tab-content-1 */}
                  <div className="tab-content-1" id="custom-tabs-four-tabContent">
                    <div className="col-lg-12">
                      <div className="card wgz-basicinfo card-panel  mt-2">
                        <div className="card-header">
                          <h3 className="card-title form-header">Basic info</h3>
                        </div>

                        <div className="card-body">
                          <div className="row">Coming Soon</div>
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
