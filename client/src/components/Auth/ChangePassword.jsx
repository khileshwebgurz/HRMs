
import { useState } from "react";
import axios from "axios";
const ChangePassword = () => {
  const [oldpassword, setOldpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmnewpassword, setConfirmnewpassword] = useState("");

  const handleBtnUpdate = async (e) => {
    e.preventDefault();
    await axios.post(
       `${import.meta.env.VITE_API_BASE_URL}/change-password`, {
        current_password: oldpassword,
        password: newpassword,
        password_confirmation: confirmnewpassword,
      },
      { withCredentials: true }
    );
   
  };
  return (
    <section className="content mt-4">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Change Password</h3>
              </div>
              <div className="card-body">
                <form
                  action=""
                  method="post"
                  id="wgz_user_form"
                  encType="multipart/form-data"
                >
                  {/* <input type="hidden" name="user_id" value="{{$user->id}}" /> */}
                  <div className="col-lg-12">
                    <div className="form-group row">
                      <label
                        htmlFor="password"
                        className="col-md-4 col-form-label"
                      >
                        Current Password
                      </label>
                      <div className="col-lg-8 form-icon">
                        <input
                          id="password"
                          type="password"
                          className="form-control input-border"
                          name="current_password"
                          value={oldpassword}
                          onChange={(e) => setOldpassword(e.target.value)}
                        />
                        <img src="/hrm/public/dist/img/2021/icons/password-icon.png" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="password"
                        className="col-md-4 col-form-label"
                      >
                        Password
                      </label>
                      <div className="col-lg-8 form-icon">
                        <input
                          className="form-control input-border"
                          type="password"
                          name="password"
                          id="password"
                          value={newpassword}
                          onChange={(e) => setNewpassword(e.target.value)}
                        />
                        <img src="/hrm/public/dist/img/2021/icons/password-icon.png" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="password"
                        className="col-md-4 col-form-label"
                      >
                        Confirm Password
                      </label>
                      <div className="col-lg-8 form-icon">
                        <input
                          className="form-control input-border"
                          type="password"
                          value={confirmnewpassword}
                          onChange={(e) =>
                            setConfirmnewpassword(e.target.value)
                          }
                          name="password_confirmation"
                          id="password_confirmation"
                        />
                        <img src="/hrm/public/dist/img/2021/icons/password-icon.png" />
                      </div>
                    </div>

                    <button
                      className="btn btn-success float-right wgz-submit site-main-btn"
                      type="submit"
                      name="submit"
                      onClick={(e)=>handleBtnUpdate(e)}
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
