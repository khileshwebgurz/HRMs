import React, { useState, useEffect } from "react";
import "../assets/css/companyprofile.css";
import axios from "axios";

const CompanyProfile = () => {
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mydata = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/company-profile", {
          withCredentials: true,
        });
        setField(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load company profile", error);
        setLoading(false);
      }
    };
    mydata();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!field) return <p>No data available</p>;

  const { company, hr_policy, leave_policy, travel_policy } = field;


  return (
    <section className="content mt-4 company-page">
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-primary company-profile-card">
            <div className="card-header company-main-header">
              <figure className="card-logo mb-0">
                {/* Add logo if needed */}
              </figure>
              <h3 className="card-title main-title">Company Profile</h3>
            </div>

            <div className="card-body1 mt-2 company-content-sec" id="personalForm">
              <div className="col-lg-12">
                {/* Overview */}
                <div className="card wgz-personal card-panel mb-3">
                  <div className="small-card">
                    <div className="card-header">
                      <h3 className="card-title">Overview</h3>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-6 form-group">
                          <label>Company Name</label>
                          <div className="wgz_value">{company.company_name}</div>
                        </div>
                        <div className="col-sm-6 form-group">
                          <label>Brand Name</label>
                          <div className="wgz_value">{company.brand_name}</div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6 form-group">
                          <label>Website</label>
                          <div className="wgz_value">{company.website}</div>
                        </div>
                        <div className="col-sm-6 form-group">
                          <label>Domain Name</label>
                          <div className="wgz_value">{company.domain_name}</div>
                        </div>
                        <div class="col-sm-6 form-group">
                          <label>
                            For Grievance
                          </label>
                          <div className="wgz_value ">
                            hr@webguruz.in
                          </div>
                        </div>

                        <div class="col-sm-6 form-group">
                          <label>
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

                {/* Addresses */}
                <div className="card wgz-addresses card-panel mb-3">
                  <div className="small-card">
                    <div className="card-header">
                      <h3 className="card-title">Address</h3>
                    </div>
                    <div className="card-body row">
                      <div className="col-sm-6 form-group">
                        <label>Registered Office</label>
                        <div className="wgz_value">{company.registered_office_address}</div>
                      </div>
                      <div className="col-sm-6 form-group">
                        <label>Corporate Office</label>
                        <div className="wgz_value">{company.corporate_office}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="card wgz-addresses card-panel mb-3">
                  <div className="small-card">
                    <div className="card-header">
                      <h3 className="card-title">Important Phone no.'s</h3>
                    </div>
                    <div className="card-body">
                      <div className="form-group">
                        <div className="wgz_value" style={{ whiteSpace: 'pre-line' }}>{company.phone_nos}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emails */}
                <div className="card wgz-addresses card-panel mb-3">
                  <div className="small-card">
                    <div className="card-header">
                      <h3 className="card-title">Important Emails</h3>
                    </div>
                    <div className="card-body">
                      <div className="form-group">
                        <div className="wgz_value" style={{ whiteSpace: 'pre-line' }}>{company.emails}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Policies */}
                <div className="card wgz-policy card-panel mb-3">
                  <div className="small-card">
                    <div className="card-header">
                      <h3 className="card-title">Company Policies</h3>
                    </div>
                    <div className="card-body">
                      <div className="panel-group" id="accordion">
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            <h4 className="panel-title">HR Policy</h4>
                          </div>
                          <div className="panel-body" dangerouslySetInnerHTML={{ __html: hr_policy }} />
                        </div>
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            <h4 className="panel-title">Leave Policy</h4>
                          </div>
                          <div className="panel-body" dangerouslySetInnerHTML={{ __html: leave_policy }} />
                        </div>
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            <h4 className="panel-title">Travel & Food Allowance</h4>
                          </div>
                          <div className="panel-body" dangerouslySetInnerHTML={{ __html: travel_policy }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Profiles */}
                <div className="card wgz-social card-panel mb-3">
                  <div className="small-card">
                    <div className="card-header">
                      <h3 className="card-title">Social Profiles</h3>
                    </div>
                    <div className="card-body">
                      <div className="form-group">
                        <a href={company.linked_in} target="_blank" rel="noreferrer" className="fab fa-linkedin fa-2x linkedIn-icon" style={{ marginRight: "10px" }} />
                        <a href={company.facebook} target="_blank" rel="noreferrer" className="fab fa-facebook fa-2x facebook-icon" style={{ marginRight: "10px" }} />
                        <a href={company.twitter} target="_blank" rel="noreferrer" className="fab fa-twitter fa-2x twitter-icon" />
                      </div>
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
  );
};

export default CompanyProfile;