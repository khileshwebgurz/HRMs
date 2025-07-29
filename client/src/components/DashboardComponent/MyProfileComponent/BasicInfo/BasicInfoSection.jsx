import { useState, useEffect } from "react";

const BasicInfoSection = ({ employeeData }) => {
  return (
    <>
      <div className="card wgz-basicinfo card-panel mt-2">
        <div className="card-header">
          <h3 className="card-title form-header">Basic info</h3>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-lg-12"></div>

            <div className="col-md-4 col-sm-6">
              <div className="form-group">
                <label htmlFor="office_joining_date" className="col-form-label">
                  Date of Joining
                </label>
                <div className="wgz_field">
                  <input
                    className="form-control"
                    type="text"
                    value={employeeData?.candidate?.date_of_joining || ""}
                    disabled
                  />
                </div>
                <div className="wgz_value "></div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="form-group">
                <label htmlFor="date_of_relieving" className="col-form-label">
                  Date of Relieving
                </label>
                <div className="wgz_field">
                  <input
                    className="form-control"
                    type="text"
                    value={employeeData?.candidate?.date_of_reliveing || ""}
                    disabled
                  />
                </div>
                <div className="wgz_value "></div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="form-group">
                <label htmlFor="joining_salary" className="col-form-label">
                  Joining Salary
                </label>
                <div className="wgz_field">
                  <input
                    className="form-control"
                    type="text"
                    value={employeeData?.candidate?.joining_salary || ""}
                    disabled
                  />
                </div>
                <div className="wgz_value "></div>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="form-group">
                <label htmlFor="current_salary" className="col-form-label">
                  Current Salary
                </label>
                <div className="wgz_field">
                  <input
                    className="form-control"
                    type="text"
                    value={employeeData?.candidate?.current_salary || ""}
                    disabled
                  />
                </div>
                <div className="wgz_value "></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicInfoSection;
