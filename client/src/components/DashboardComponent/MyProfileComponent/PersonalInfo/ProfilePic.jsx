import React from "react";
import profilebg from "../../../../../public/dist/img/photo1.png";

const ProfilePic = ({employeedata}) => {
    console.log('my employee data is >>>',employeedata)
  return (
    <>
      <div className="card card-primary card-sec">
        <div className="profile-bg-image">
           <img src={ profilebg } alt="Profile Background" className="profile-bg w-100" />
         </div>
         <div className="profile-img-wrapper">
            <div className="profile-pic">
              <img
                src={`http://localhost:8000/dist/img/profile${employeedata?.user?.gender}.png`}
                alt="user-avatar"
                className="profile-user-img img-fluid img-circle"
              />
{/* 
              <img
                src={`http://localhost:8000/uploads/employees-photos/${employeedata?.user?.profile_pic}`}
                alt="employee"
                className="img-fluid"
              /> */}

              <div className="edit">
                <a href="#">
                  <i className="fa fa-pencil fa-lg"></i>
                </a>
              </div>
            </div>
            <div className="profile-name">
              <div className="mt-2">
                <h2 className="lead">
                  {employeedata?.candidate?.name}
                </h2>
                <p className="text-muted text-sm">
                  {employeedata?.candidate?.job_title}
                </p>
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default ProfilePic;
