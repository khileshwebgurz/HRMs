import React from "react";

const ProfilePic = ({employeedata}) => {
    console.log('my employee data is >>>',employeedata)
  return (
    <>
      <div className="card card-primary card-sec">
        <div className="card-body pt-0">
          <div className="row">
            <div className="col-12 text-center profile-pic">
              <img
                src={`http://localhost:8000/dist/img/profile${employeedata?.user?.gender}.png`}
                alt="user-avatar"
                className="profile-user-img img-fluid img-circle"
              />

              <img
                src={`http://localhost:8000/uploads/employees-photos/${employeedata?.user?.profile_pic}`}
                alt="employee"
                className="img-fluid"
              />

              <div className="edit">
                <a href="#">
                  <i className="fa fa-pencil fa-lg"></i>
                </a>
              </div>
            </div>
            <div className="col-12">
              <div className="text-center mt-2">
                <h2 className="lead">
                  <b>{employeedata?.candidate?.name}</b>
                </h2>
                <p className="text-muted text-sm">
                  <b>{employeedata?.candidate?.job_title}</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePic;
