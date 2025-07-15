import React from 'react'

const PersonalParticular = ({candidateProfile , onChange}) => {
  return (
    <>
     <div className="card">
        <div className="card-header">Personal Particulars</div>
        <div className="card-body">
          <div className="form-group row">
            <label htmlFor="full_name" className="col-2 col-form-label">
              Full Name<span className="req">*</span>
            </label>
            <div className="col-10">
              <input
                className="form-control"
                type="text"
                value={candidateProfile.full_name}
                onChange={(e) => onChange("full_name", e.target.value)}
                name="full_name"
                id="full_name"
                maxLength="25"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group row">
                <label htmlFor="mobile_number" className="col-4 col-form-label">
                  Mobile Number<span className="req">*</span>
                </label>
                <div className="col-8">
                  <input
                    className="form-control"
                    type="number"
                    value={candidateProfile.mobile_number}
                    onChange={(e) => onChange("mobile_number", e.target.value)}
                    min="1"
                    name="mobile_number"
                    id="mobile_number"
                  />
                </div>
              </div>

           
             

             

              <div className="form-group row">
                <label className="col-4 col-form-label">
                  Gender<span className="req">*</span>
                </label>
                <div className="col-8">
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="gender1"
                        value="1"
                        checked={candidateProfile.gender === "1"}
                        onChange={() => onChange("gender", "1")}
                        
                      />
                      Male
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="gender2"
                        value="2"
                        checked={candidateProfile.gender === "2"}
                        onChange={() => onChange("gender", "2")}
                        
                      />
                      Female
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="passport_number" className="col-4 col-form-label">
                  Passport Number
                </label>
                <div className="col-8">
                  <input
                    className="form-control"
                    type="text"
                    value={candidateProfile.passport_number}
                    onChange={(e) => onChange("passport_number", e.target.value)}
                    name="passport_number"
                    id="passport_number"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group row">
                <label htmlFor="residence_address" className="col-4 col-form-label">
                  Address<span className="req">*</span>
                </label>
                <div className="col-8">
                  <input
                    className="form-control"
                    rows="3"
                    id="residence_address"
                    value={candidateProfile.residence_address}
                    onChange={(e) => onChange("residence_address", e.target.value)}
                    name="residence_address"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="nationality" className="col-4 col-form-label">
                  Nationality<span className="req">*</span>
                </label>
                <div className="col-8">
                  <input
                    className="form-control"
                    type="text"
                    value={candidateProfile.nationality}
                    onChange={(e) => onChange("nationality", e.target.value)}
                    id="nationality"
                    name="nationality"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="place_of_birth" className="col-4 col-form-label">
                  Place of Birth<span className="req">*</span>
                </label>
                <div className="col-8">
                  <input
                    className="form-control"
                    type="text"
                    value={candidateProfile.place_of_birth}
                     onChange={(e) => onChange("place_of_birth", e.target.value)}
                    id="place_of_birth"
                    name="place_of_birth"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="email" className="col-4 col-form-label">
                  Email Address<span className="req">*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={candidateProfile.email}
                   onChange={(e) => onChange("email", e.target.value)}
                  id="email"
                  name="email"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6">
                <div className="form-group row">
                  <label htmlFor="dob" className="col-4 col-form-label">
                    Date of Birth<span className="req">*</span>
                  </label>
                  <div className="col-8">
                    <input
                      className="form-control"
                      type="text"
                      value={candidateProfile.dob}
                      onChange={(e) => onChange("dob", e.target.value)}
                      id="dob"
                      name="dob"
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group row">
                  <label htmlFor="age" className="col-4 col-form-label">
                    Age<span className="req">*</span>
                  </label>
                  <div className="col-8">
                    <input
                      className="form-control"
                      type="text"
                      value={candidateProfile.age}
                      onChange={(e) => onChange("age", e.target.value)}
                      id="age"
                      name="age"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="hobbies" className="col-2 col-form-label">
                Hobbies
              </label>
              <div className="col-4">
                <textarea
                  className="form-control"
                  rows="2"
                  id="hobbies"
                  name="hobbies"
                  value={candidateProfile.hobbies}
                  onChange={(e) => onChange("hobbies", e.target.value)}
                ></textarea>
              </div>
              <label htmlFor="marital_status" className="col-2 col-form-label">
                Marital Status<span className="req">*</span>
              </label>
              <div className="col-3">
                <div className="form-check form-check-inline">
                  <label className="form-check-label">
                    {" "}
                    <input
                      className="form-check-input"
                      type="radio"
                      name="marital_status"
                      id="marital_status1"
                      value="1"
                      checked={candidateProfile.marital_status === "1"}
                      onChange={() => onChange("marital_status", "1")}
                    />
                    Single
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <label className="form-check-label">
                    {" "}
                    <input
                      className="form-check-input"
                      type="radio"
                      name="marital_status"
                      id="marital_status2"
                      value="2"
                      checked={candidateProfile.marital_status === "2"}
                      onChange={() => onChange("marital_status", "2")}
                    />{" "}
                    Married
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PersonalParticular