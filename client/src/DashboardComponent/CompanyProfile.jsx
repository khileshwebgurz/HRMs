import React from "react";
import "../assets/css/companyprofile.css";
const CompanyProfile = () => {
  return (
    <section className="content mt-4 company-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary company-profile-card">
              <div className="card-header mb-2 mb-md-3 company-main-header">
                <figure className="card-logo mb-0">
                  {/* <img src="{{asset('dist/img/2021/logo-background.png')}}"/> */}
                </figure>
                <h3 className="card-title main-title">Company Profile</h3>
              </div>
              <div
                className="card-body1 mt-2 company-content-sec"
                id="personalForm"
              >
                <div className="tab-content" id="custom-tabs-four-tabContent">
                  <div className="col-lg-12">
                    <form action="" method="post" id="wgz-overview">
                      <div className="card wgz-personal card-panel mb-0">
                        <div className="small-card">
                          <div className="card-header">
                            <h3 className="card-title">Overview</h3>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label for="name" className="col-form-label">
                                    Company Name
                                  </label>
                                  <div className="wgz_value "></div>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label
                                    for="job_title"
                                    className="col-form-label"
                                  >
                                    Brand Name
                                  </label>
                                  <div className="wgz_value "></div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label for="name" className="col-form-label">
                                    Website
                                  </label>
                                  <div className="wgz_value "></div>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label
                                    for="job_title"
                                    className="col-form-label"
                                  >
                                    Domain Name
                                  </label>
                                  <div className="wgz_value "></div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label for="name" className="col-form-label">
                                    For Grievance
                                  </label>
                                  <div className="wgz_value ">
                                    hr@webguruz.in
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label for="name" className="col-form-label">
                                    For IT
                                  </label>
                                  <div className="wgz_value ">
                                    itsupport@webguruz.in
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>

                    <form action="" method="post" id="wgz-addresses">
                      <div className="card wgz-addresses card-panel mb-0">
                        <div className="small-card">
                          <div className="card-header">
                            <h3 className="card-title">Address</h3>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="form-group ">
                                  <label
                                    for="current_address"
                                    className=" col-form-label"
                                  >
                                    Registered Office
                                  </label>
                                  <div className="wgz_value "></div>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="form-group ">
                                  <label
                                    for="current_address"
                                    className=" col-form-label"
                                  >
                                    Corporate Office
                                  </label>
                                  <div className="wgz_value "></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>

                    <form action="" method="post" id="wgz-addresses">
                      <div className="card wgz-addresses card-panel mb-0">
                        <div className="small-card">
                          <div className="card-header">
                            <h3 className="card-title">
                              Important Phone no.'s
                            </h3>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="form-group ">
                                <div className="wgz_value "></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                    <form action="" method="post" id="wgz-addresses">
                      <div className="card wgz-addresses card-panel mb-0">
                        <div className="small-card">
                          <div className="card-header">
                            <h3 className="card-title">Important Emails</h3>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="form-group ">
                                <div className="wgz_value "></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>

                    <form>
                      <div className="card wgz-policy card-panel mb-0">
                        <div className="small-card">
                          <div className="card-header">
                            <h3 className="card-title">Company Policies</h3>
                          </div>
                          <div className="card-body">
                            <div className="container">
                              <div className="clearfix"></div>
                              <div
                                className="panel-group"
                                id="accordion"
                                role="tablist"
                                aria-multiselectable="true"
                              >
                                <div className="panel panel-default">
                                  <div
                                    className="panel-heading"
                                    role="tab"
                                    id="headingOne"
                                  >
                                    <h4 className="panel-title">
                                      <a
                                        role="button"
                                        data-toggle="collapse"
                                        data-parent="#accordion"
                                        href="#collapseOne"
                                        aria-expanded="false"
                                        aria-controls="collapseOne"
                                      >
                                        HR Policy
                                      </a>
                                    </h4>
                                  </div>
                                  <div
                                    id="collapseOne"
                                    className="panel-collapse collapse in"
                                    role="tabpanel"
                                    aria-labelledby="headingOne"
                                  >
                                    <div className="panel-body"></div>
                                  </div>
                                </div>
                                <div className="panel panel-default">
                                  <div
                                    className="panel-heading"
                                    role="tab"
                                    id="headingTwo"
                                  >
                                    <h4 className="panel-title">
                                      <a
                                        className="collapsed"
                                        role="button"
                                        data-toggle="collapse"
                                        data-parent="#accordion"
                                        href="#collapseTwo"
                                        aria-expanded="false"
                                        aria-controls="collapseTwo"
                                      >
                                        Leave Policy
                                      </a>
                                    </h4>
                                  </div>
                                  <div
                                    id="collapseTwo"
                                    className="panel-collapse collapse in"
                                    role="tabpanel"
                                    aria-labelledby="headingTwo"
                                  >
                                    <div className="panel-body"></div>
                                  </div>
                                </div>
                                <div className="panel panel-default">
                                  <div
                                    className="panel-heading"
                                    role="tab"
                                    id="headingThree"
                                  >
                                    <h4 className="panel-title">
                                      <a
                                        className="collapsed"
                                        role="button"
                                        data-toggle="collapse"
                                        data-parent="#accordion"
                                        href="#collapseThree"
                                        aria-expanded="false"
                                        aria-controls="collapseThree"
                                      >
                                        Travel &amp; Food Allowance Policy
                                      </a>
                                    </h4>
                                  </div>
                                  <div
                                    id="collapseThree"
                                    className="panel-collapse collapse in"
                                    role="tabpanel"
                                    aria-labelledby="headingThree"
                                  >
                                    <div className="panel-body"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>

                    <form action="" method="post" id="wgz-social">
                      <div className="card wgz-social  card-panel">
                        <div className="small-card social-icon">
                          <div className="card-header">
                            <h3 className="card-title">Social Profiles</h3>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="form-group ">
                                  <div className="wgz_value ">
                                    <a
                                      href="{{$company->linked_in}}"
                                      target="_blank"
                                      style={{ padding: "5px" }}
                                      className="fab fa-linkedin fa-2x linkedIn-icon"
                                    ></a>
                                    <a
                                      href="{{$company->facebook}}"
                                      target="_blank"
                                      style={{ padding: "5px" }}
                                      className="fab fa-facebook fa-2x facebook-icon"
                                    ></a>
                                    <a
                                      href="{{$company->twitter}}"
                                      target="_blank"
                                      style={{ padding: "5px" }}
                                      className="fab fa-twitter-square fa-2x twitter-icon"
                                    ></a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyProfile;
