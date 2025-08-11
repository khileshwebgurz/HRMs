import { useState, useEffect } from "react";
import axios from "axios";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { useParams } from "react-router-dom";

const ViewInterviewInfo = () => {
  const { id } = useParams();
  const [interviewer, setInterviewer] = useState([]);
  const [interviewTime, setInterviewTime] = useState(moment());
  const [candidate, setCandidate] = useState([]);
  const [showModal, setShowModal] = useState(false);

  //   to make post request
  const [selectedRound, setSelectedRound] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [cvFile, setCvFile] = useState(null);

  const [message, setMessage] = useState(
    `Dear Candidate, You interview has been scheduled
at Kindly be available 15 mins prior to call.
Thanks! Team Webguruz`
  );

  const rounds = {
    2: "Round 2 (Theoretical)",
    3: "Round 3 (Practical)",
    4: "Round 4 (HR Final)",
  };
  const fetchInterview = async () => {
    const res = await axios.get(
      `http://localhost:8000/api/view-interview/${id}`,
      {
        withCredentials: true,
      }
    );
    setInterviewer(res.data.ob_candidates);
    setCandidate(res.data.candidate);
  };
  useEffect(() => {
    fetchInterview();
  }, []);

  const handlebtnClick = () => {
    setShowModal(!showModal);
  };


  const handleScheduleInterview = async (e) => {
      e.preventDefault();

  const formData = new FormData();
  formData.append("round", selectedRound); 
  formData.append("employee_id", selectedEmployee); 
  formData.append("interview_id", id); 
  formData.append("interview_time", moment(interviewTime).format("YYYY-MM-DD HH:mm"));
  formData.append("message_candidate", message);

  // If CV file is selected
  if (cvFile) {
    formData.append("cv", cvFile);
  }

  try {
    const res = await axios.post(
      "http://localhost:8000/api/schedule-interview",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    console.log(res.data);
    alert(res.data.message);
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Something went wrong");
  }
  };

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="pl-2">View Interview Info</h1>
            </div>
            <div className="col-sm-6 text-right"></div>
          </div>
        </div>
      </section>

      <div className="card add-user-sec mx-4">
        <div className="card-body">
          <div className="row">
            <div className="timeline timeline-inverse col-7">
              <div className="time-label">
                <span className="bg-primary site-main-btn">
                  Round I (Aptitude)
                </span>
              </div>

              <div>
                {/* <i className="fas fa-user site-main-btn"></i> */}
                <div className="timeline-item">
                  <h3 className="timeline-header border-0">
                    <a href="#"></a>
                  </h3>
                </div>
              </div>

              <div>
                <i className="far fa-comment-alt bg-primary"></i>
                <div className="timeline-item">
                  <h3 className="timeline-header">
                    <a href="#">Remarks</a>
                  </h3>
                  <div className="timeline-body">
                    Congratulations, you are shortlisted for next round.
                  </div>
                </div>
              </div>

              <div>
                {/* <i className="fas fa-user site-main-btn"></i> */}
                <div className="timeline-item">
                  <h3 className="timeline-header border-0">
                    <a href="#"></a>
                  </h3>
                </div>
              </div>

              <div>
                <i className="far fa-comment-alt site-main-btn"></i>
                <div className="timeline-item">
                  <h3 className="timeline-header">
                    <a href="#">Schedule Next Round</a>
                  </h3>
                  <div className="timeline-body">
                    <button
                      type="button"
                      className="btn btn-primary site-main-btn"
                      onClick={handlebtnClick}
                    >
                      Schedule Now
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <i className="far fa-clock bg-gray"></i>
              </div>
            </div>

            <div className="col-5">
              <div className="card">
                <div className="card-header">
                  <b>Candidate Information</b>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="form-group form-inline">
                      <label htmlFor="name" className="col-form-label">
                        Name:{" "}
                      </label>
                      <div className="wgz_value">{candidate?.full_name}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group form-inline">
                      <label htmlFor="name" className="col-form-label">
                        Email:{" "}
                      </label>
                      <div className="wgz_value">{candidate?.email}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group form-inline">
                      <label htmlFor="name" className="col-form-label">
                        Phone Number:{" "}
                      </label>
                      <div className="wgz_value">
                        {candidate?.mobile_number}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showModal && (
              // <div className="modal fade" id="modal-lg">
              <div id="modal-lg">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Schedule Interview</h4>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                    
                        <input
                          type="hidden"
                          name="interview_id"
                          value="{{$interview->id}}"
                        />
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group ">
                              <label>
                                Round<span className="req">*</span>
                              </label>{" "}
                              <select
                                className="form-control select2bs4"
                                style={{ width: "100%" }}
                                name="round"
                                value={selectedRound}
                                onChange={(e) =>
                                  setSelectedRound(e.target.value)
                                }
                              >
                                <option value="">--Select Round--</option>

                                {Object.entries(rounds).map(([id, name]) => (
                                  <option key={id} value={id}>
                                    {name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="form-group ">
                            <label>
                              Interviewer<span className="req">*</span>
                            </label>{" "}
                            <select
                              className="form-control select2bs4"
                              style={{ width: "100%" }}
                              name="employee_id"
                              onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                              <option value="">--Select Interviewer--</option>

                              {interviewer.map((person) => (
                                <option key={person.id} value={person.office_employee_id}>
                                  {person.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label>
                              Message<span className="req">*</span>
                            </label>
                            <div className="">
                              <textarea
                                className="form-control"
                                name="message_candidate"
                                rows="10"
                                id="message_candidate"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="form-group ">
                            <button
                              className="btn btn-success wgz-submit site-main-btn"
                              onClick={handleScheduleInterview}
                            >
                              Schedule Now
                            </button>
                            {/* <input
                              type="submit"
                              className="btn btn-success wgz-submit site-main-btn"
                              name="submit"
                              value="Schedule Now"
                            /> */}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <div className="form-group">
                              <div style={{ width: "100%" }}>
                                <label>
                                  Date/Time<span className="req">*</span>
                                </label>
                                <Datetime
                                  value={interviewTime}
                                  onChange={(date) => setInterviewTime(date)}
                                  dateFormat="YYYY-MM-DD"
                                  timeFormat="HH:mm"
                                  inputProps={{
                                    name: "interview_time",
                                    className: "form-control",
                                  }}
                                  isValidDate={(current) =>
                                    current.isSameOrAfter(moment(), "day")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                    
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewInterviewInfo;
