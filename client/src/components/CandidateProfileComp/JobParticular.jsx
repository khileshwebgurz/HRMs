const JobParticular = ({ data }) => {
  const candidate = data?.candidate || {};

  console.log("the job particular data is >>> ", data);

  const languageMap = {
    1: "Hindi",
    2: "English",
    3: "Punjabi",
  };

  const departments = {
    1: "Digital Marketing",
    2: "Business Development",
    3: "Mobile Development",
    4: "Web Designing",
    5: "HR",
    6: "Admin",
    7: "Quality",
    8: "Web Development",
    9: "Online Marketing",
  };

  const otherInfo = [
    {
      question:
        "Have you ever been discharged from employment because your work or conduct was not satisfactory?",
      key: "discharged",
    },
    {
      question:
        "Will you have any objection if a reference check may be made to your present and previous Employers?",
      key: "reference_check",
    },
    {
      question:
        "Do you have any physical defects, long term medical condition or history of any mental condition?",
      key: "medical_condition",
    },
    {
      question:
        "Have you ever been arrested or convicted for any criminal offence?",
      key: "criminal_offence",
    },
  ];

  return (
    <>
      <div className="col-lg-12">
        {/* Job Particulars */}
        <div className="card">
          <div className="card-header form-header">Job Particulars</div>
          <div className="card-body">
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">
                Position Applied For
              </label>
              <div className="col-sm-9 col-form-label">
                {candidate.position || "-"}
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Department</label>
              <div className="col-sm-9 col-form-label">
                {departments[candidate.department] || "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Particulars */}
        <div className="card">
          <div className="card-header form-header">Personal Particulars</div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group row">
                  <label className="col-md-4 col-5 col-form-label">
                    Full Name
                  </label>
                  <div className="col-md-9 col-7 col-form-label">
                    {candidate.full_name}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-5 col-form-label">
                    Mobile Number
                  </label>
                  <div className="col-md-9 col-7 col-form-label">
                    {candidate.mobile_number}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-5 col-form-label">
                    Email Address
                  </label>
                  <div className="col-md-9 col-7 col-form-label">
                    {candidate.email}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-5 col-form-label">
                    Gender
                  </label>
                  <div className="col-md-9 col-7 col-form-label">
                    {candidate.gender === "2" ? "Female" : "Male"}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-5 col-form-label">
                    Passport Number
                  </label>
                  <div className="col-md-9 col-7 col-form-label">
                    {candidate.passport_number}
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group row">
                  <label className="col-md-4 col-5 col-form-label">
                    Residence Number & Address
                  </label>
                  <div className="col-md-9 col-7 col-form-label">
                    {candidate.residence_address || "-"}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-5 col-form-label">
                    Marital Status
                  </label>
                  <div className="col-md-9 col-7 col-form-label">
                    {candidate.marital_status === "1" ? "Single" : "Married"}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-5 col-form-label">
                    Nationality
                  </label>
                  <div className="col-md-9 col-7 col-form-label">
                    {candidate.nationality}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-5 col-form-label">
                    Date of Birth
                  </label>
                  <div className="col-md-9 col-7 col-form-label">
                    {candidate.dob}
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-lg-6">
                <div className="form-group row">
                  <label className="col-md-4 col-5 col-form-label">Age</label>
                  <div className="col-md-9 col-7 col-form-label">
                    {candidate.age}
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group row">
                  <label className="col-md-4 col-5 col-form-label">
                    Place of Birth
                  </label>
                  <div className="col-md-9 col-7 col-form-label">
                    {candidate.place_of_birth}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-md-4 col-5 col-form-label">Hobbies</label>
              <div className="col-md-9 col-7 col-form-label">
                {candidate.hobbies}
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="card">
          <div className="card-header form-header">Education Details</div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>Institute</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Qualification</th>
                  </tr>
                </thead>
                <tbody>
                  {candidate.educations?.map((edu, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{edu.institute}</td>
                      <td>{edu.from}</td>
                      <td>{edu.to}</td>
                      <td>{edu.qualification}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="5">No records</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="card">
          <div className="card-header form-header">Language Proficiency</div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>Language</th>
                    <th>Speak</th>
                    <th>Write</th>
                    <th>Understand</th>
                  </tr>
                </thead>
                <tbody>
                  {candidate.languages?.length > 0 ? (
                    candidate.languages.map((lang, i) => {
                      const name = languageMap[lang.language_id] || "Unknown";
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{name}</td>
                          <td>{lang.speak === "1" ? "Yes" : "No"}</td>
                          <td>{lang.write === "1" ? "Yes" : "No"}</td>
                          <td>{lang.understand === "1" ? "Yes" : "No"}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5">No records</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Employment */}
        <div className="card">
          <div className="card-header form-header">Employment History</div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>Company</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Position</th>
                    <th>Reason for Leaving</th>
                  </tr>
                </thead>
                <tbody>
                  {candidate.employments?.map((job, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{job.company}</td>
                      <td>{job.from}</td>
                      <td>{job.to}</td>
                      <td>{job.position}</td>
                      <td>{job.reason}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="6">No records</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Family */}
        <div className="card">
          <div className="card-header form-header">Family Details</div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>Name</th>
                    <th>Relationship</th>
                    <th>Age</th>
                    <th>Occupation</th>
                    <th>Employer</th>
                  </tr>
                </thead>
                <tbody>
                  {candidate.families?.map((fam, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{fam.name}</td>
                      <td>{fam.relationship}</td>
                      <td>{fam.age}</td>
                      <td>{fam.occupation}</td>
                      <td>{fam.employer}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="6">No records</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Other Information */}
        <div className="card mt-3">
          <div className="card-header form-header">Other Information</div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>DETAILS</th>
                    <th></th>
                    <th>IF YES, PLEASE ELABORATE:</th>
                  </tr>
                </thead>
                <tbody>
                  {otherInfo.map((item, i) => (
                    <tr key={i}>
                      <td>{item.question}</td>
                      <td>{candidate[item.key] || ""}</td>
                    </tr>
                  ))}
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
