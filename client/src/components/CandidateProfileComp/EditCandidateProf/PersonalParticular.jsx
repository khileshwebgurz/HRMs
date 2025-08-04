import React from "react";

const PersonalParticular = ({ formData, onChange }) => {
  return (
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
              id="full_name"
              value={formData?.full_name || ""}
               onChange={(e) => onChange("full_name", e.target.value)}
              maxLength="25"
            />
          </div>
        </div>

        <div className="row">
          {/* Left column */}
          <div className="col-lg-6">
            <div className="form-group row">
              <label htmlFor="mobile_number" className="col-4 col-form-label">
                Mobile Number<span className="req">*</span>
              </label>
              <div className="col-8">
                <input
                  className="form-control"
                  type="text"
                  id="mobile_number"
                  value={formData?.mobile_number || ""}
                  onChange={(e) => onChange("mobile_number", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="country" className="col-4 col-form-label">
                Country
              </label>
              <div className="col-8">
                <input
                  className="form-control"
                  type="text"
                  id="country"
                  value={formData?.country || ""}
                  onChange={(e) => onChange("country", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="city" className="col-4 col-form-label">
                City
              </label>
              <div className="col-8">
                <input
                  className="form-control"
                  type="text"
                  id="city"
                  value={formData?.city || ""}
                  onChange={(e) => onChange("city", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group row">
              <label className="col-4 col-form-label">
                Gender<span className="req">*</span>
              </label>
              <div className="col-8">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="1"
                    checked={formData?.gender === "1"}
                    onChange={() => onChange("gender", "1")}
                  />
                  <label className="form-check-label">Male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="2"
                    checked={formData?.gender === "2"}
                    onChange={() => onChange("gender", "2")}
                  />
                  <label className="form-check-label">Female</label>
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
                  id="passport_number"
                  value={formData?.passport_number || ""}
                   onChange={(e) =>
                      onChange("passport_number", e.target.value)
                    }
                />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="col-lg-6">
            <div className="form-group row">
              <label
                htmlFor="residence_address"
                className="col-4 col-form-label"
              >
                Address<span className="req">*</span>
              </label>
              <div className="col-8">
                <input
                  className="form-control"
                  type="text"
                  id="residence_address"
                  value={formData?.residence_address || ""}
                   onChange={(e) =>
                      onChange("residence_address", e.target.value)
                    }
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="state" className="col-4 col-form-label">
                State
              </label>
              <div className="col-8">
                <input
                  className="form-control"
                  type="text"
                  id="state"
                  value={formData?.state || ""}
                   onChange={(e) =>
                      onChange("state", e.target.value)
                    }
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
                  id="nationality"
                  value={formData?.nationality || ""}
                  onChange={(e) => onChange("nationality", e.target.value)}
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
                  id="place_of_birth"
                  value={formData?.place_of_birth || ""}
                  onChange={(e) => onChange("place_of_birth", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="email" className="col-4 col-form-label">
                Email Address<span className="req">*</span>
              </label>
              <div className="col-8">
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  value={formData?.email || ""}
                  onChange={(e) => onChange("email", e.target.value)}
                />
              </div>
            </div>
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
                  type="date"
                  id="dob"
                  value={formData?.dob || ""}
                   onChange={(e) => onChange("dob", e.target.value)}
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
                  type="number"
                  id="age"
                  value={formData?.age || ""}
                  onChange={(e) => onChange("age", e.target.value)}
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
              id="hobbies"
              rows="2"
              value={formData?.hobbies || ""}
              onChange={(e) => onChange("hobbies", e.target.value)}
            ></textarea>
          </div>

          <label htmlFor="marital_status" className="col-2 col-form-label">
            Marital Status<span className="req">*</span>
          </label>
          <div className="col-3">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="marital_status"
                value="1"
                checked={formData?.marital_status === "1"}
                onChange={() => onChange("marital_status", "1")}
              />
              <label className="form-check-label">Single</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="marital_status"
                value="2"
                checked={formData?.marital_status === "2"}
                onChange={() => onChange("marital_status", "2")}
              />
              <label className="form-check-label">Married</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalParticular;
