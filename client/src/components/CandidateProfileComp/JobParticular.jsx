
const JobParticular = ({ data }) => {
    // const departments = {
    //   [ id: "1", name: "IT" ],
    //   [ id: "2", name: "HR" ],
    
    //  }
  return (
    <>
 
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header form-header">Job Particulars</div>
                  <div className="card-body">
                    <div className="form-group row">
                      <label
                        htmlFor="position"
                        className="col-sm-3 col-form-label"
                      >
                        Position Applied For{" "}
                      </label>
                      <div className="col-sm-9 col-form-label">
                        {data?.candidate?.position}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="position"
                        className="col-sm-3 col-form-label"
                      >
                        Department
                      </label>
                      <div className="col-sm-9 col-form-label"></div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header form-header">
                    Personal Particulars
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group row">
                          <label
                            htmlFor="full_name"
                            className="col-md-4 col-5 col-form-label"
                          >
                            Full Name
                          </label>
                          <div className="col-md-9 col-7 col-form-label ">
                            {data?.candidate?.full_name}
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="mobile_number"
                            className="col-md-4 col-5 col-form-label"
                          >
                            Mobile Number{" "}
                          </label>
                          <div className="col-md-9 col-7 col-form-label">
                            {data?.candidate?.mobile_number}
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="email"
                            className="col-md-4 col-5 col-form-label"
                          >
                            Email Address
                          </label>
                          <div className="col-md-9 col-7 col-form-label">
                            {data?.candidate?.email}
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-md-4 col-5 col-form-label">
                            Gender
                          </label>
                          <div className="col-md-9 col-7 col-form-label">
                            {(data?.candidate?.gender === "2") ? "Female" : "Male"  }
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="passport_number"
                            className="col-md-4 col-5 col-form-label"
                          >
                            Passport Number
                          </label>
                          <div className="col-md-9 col-7 col-form-label">
                            {data?.candidate?.passport_number}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group row">
                          <label
                            htmlFor="residence_address"
                            className="col-md-4 col-5 col-form-label"
                          >
                            Residence Number & Address
                          </label>
                          <div className="col-md-9 col-7 col-form-label">
                            {data?.candidate?.residence_address}
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="marital_status"
                            className="col-md-4 col-5 col-form-label"
                          >
                            Marital Status
                          </label>
                          <div className="col-md-9 col-7 col-form-label">
                            {(data?.candidate?.marital_status === '1') ? "Single" : "Married"}
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="nationality"
                            className="col-md-4 col-5 col-form-label"
                          >
                            Nationality
                          </label>
                          <div className="col-md-9 col-7 col-form-label">
                            {data?.candidate?.nationality}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group row">
                            <label
                              htmlFor="dob"
                              className="col-md-4 col-5 col-form-label pl-0"
                            >
                              Date of Birth
                            </label>
                            <div className="col-md-9 col-7 col-form-label pl-0">
                              {data?.candidate?.dob}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group row">
                          <label
                            htmlFor="age"
                            className="col-md-4 col-5 col-form-label"
                          >
                            Age
                          </label>
                          <div className="col-md-9 col-7 col-form-label">
                            {data?.candidate?.age}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group row">
                          <label
                            htmlFor="place_of_birth"
                            className="col-md-4 col-5 col-form-label"
                          >
                            Place of Birth
                          </label>
                          <div className="col-md-9 col-7 col-form-label">
                            {data?.candidate?.place_of_birth}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="hobbies"
                        className="col-md-4 col-5 col-form-label"
                      >
                        Hobbies
                      </label>
                      <div className="col-md-9 col-7 col-form-label">
                        {data?.candidate?.hobbies}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header form-header">
                    Education Details
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        className="table table-bordered "
                        id="wgz_edu_details"
                      >
                        <thead>
                          <tr>
                            <th width="2%">S No.</th>
                            <th>
                              School / University / Professional Institute
                              (Latest First)
                            </th>
                            <th width="10%">From</th>
                            <th width="10%">To</th>
                            <th>
                              Highest Standard Passed / Certificate / Degree /
                              Professional Qualifications
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr id="rec-{{$ek}}">
                            <td>
                              <span className="sn"></span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header form-header">
                    Language Profeiciency
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        className="table table-bordered "
                        id="wgz_language"
                      >
                        <thead>
                          <tr>
                            <th width="2%">S No.</th>
                            <th width="10%">LANGUAGES</th>
                            <th width="10%">SPEAK</th>
                            <th width="10%">WRITE</th>
                            <th width="10%">UNDERSTAND</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr id="rec-language-{{$l}}">
                            <td>
                              <span className="sn"></span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header form-header">
                    Technical Skills
                  </div>
                  <div className="card-body">
                    <div className="form-group row">
                      <div className="col-12"></div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header form-header">
                    Employment History
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        className="table table-bordered "
                        id="wgz_employment"
                      >
                        <thead>
                          <tr>
                            <th>S No.</th>
                            <th>
                              Name of the Company / Address / Contact Details
                            </th>
                            <th>From</th>
                            <th>To</th>
                            <th>Position Held</th>
                            <th>Reason for Leaving</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr id="rec-employment-{{$em}}">
                            <td>
                              <span className="sn"></span>
                            </td>
                            <td>
                              <b>Name of the Company:</b>
                              <br /> <b>Address:</b>
                              <br />
                              <br /> <b>Contact Details:</b>
                              <br />
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header form-header">FAMILY DETAILS</div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered " id="wgz_family">
                        <thead>
                          <tr>
                            <th width="2%">S No.</th>
                            <th width="10%">NAME</th>
                            <th width="10%">RELATIONSHIP</th>
                            <th width="5%">AGE</th>
                            <th width="10%">OCCUPATION</th>
                            <th width="10%">NAME OF EMPLOYER</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr id="rec-family-{{$fa}}">
                            <td>
                              <span className="sn"></span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header form-header">
                    Other Information
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
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
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
          
    </>
  );
};

export default JobParticular;
