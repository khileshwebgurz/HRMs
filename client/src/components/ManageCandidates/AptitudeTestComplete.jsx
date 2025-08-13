import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
const AptitudeTestComplete = () => {
  const { testid } = useParams();
  const [usertestData, setUsertestData] = useState([]);
  const fetchuserTest = async () => {
    const res = await axios.get(
      `http://localhost:8000/api/candidate-test/${testid}`,
      { withCredentials: true }
    );
    setUsertestData(res.data);
  };
  useEffect(() => {
    fetchuserTest();
  }, []);
  console.log("ksjsagdjs", usertestData);

  const totalQuestions = usertestData?.data?.questions?.length || 0;
  const totalPoints = usertestData?.data?.questions?.filter(
    (q) => q.candidate_answer === q.correct_answer
  ).length;
  const percentage =
    totalQuestions > 0 ? ((totalPoints / totalQuestions) * 100).toFixed(2) : 0;
  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="ml-2">View Test</h1>
            </div>
            <div className="col-sm-6 text-right"></div>
          </div>
        </div>
      </section>

      <div className="card add-user-sec mx-4">
        <div className="card-body">
          <div className="row">
            {/* Left Section */}
            <div className="col-md-8">
              <div className="row">
                <div className="col-12 col-sm-6">
                  <div className="info-box bg-light py-4">
                    <div className="info-box-content">
                      <span className="info-box-text text-center">
                        Total Points
                      </span>
                      <span className="info-box-number text-center text-muted mb-0">
                        {totalPoints}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="info-box bg-light py-4">
                    <div className="info-box-content">
                      <span className="info-box-text text-center">
                        Total Percentage
                      </span>
                      <span className="info-box-number text-center text-muted mb-0">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="callout callout-noborder">
                <h5>Questions</h5>
                <ul className="wgz_questions">
                  {usertestData?.data?.questions?.map((qItem, index) => (
                    <li key={qItem.id || index} className="mb-3">
                      <strong>Q{index + 1}:</strong> {qItem?.question?.question}
                      {/* Options */}
                      <ul className="mt-2">
                        {qItem?.question?.options?.map((opt) => {
                          const isCorrect = opt.id === qItem.correct_answer;
                          const isSelected = opt.id === qItem.candidate_answer;

                          return (
                            <li
                              key={opt.id}
                              style={{
                                fontWeight: isCorrect ? "bold" : "normal",
                                color: isCorrect
                                  ? "green"
                                  : isSelected
                                  ? "red"
                                  : "inherit",
                              }}
                            >
                              {opt.option_name}
                              {isCorrect && " ✅"}
                              {isSelected && !isCorrect && " ❌"}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-md-4">
              <div className="card card-primary card-outline">
                <div className="card-body box-profile">
                  <h3 className="profile-username text-center">
                    {usertestData?.data?.candidate?.full_name ?? "Candidate Name"}
                  </h3>
                  <p className="text-muted text-center">
                    {usertestData?.data?.candidate?.position ?? ""}
                  </p>
                  <Link
                    to={`/users/edit-candidate/${usertestData?.data?.candidate_id}`}
                    className="btn btn-primary btn-block site-main-btn"
                  >
                    <b>View Profile</b>
                  </Link>
                </div>
              </div>

              {/* Candidate Status Form */}
              {/* <form method="post" id="wgz_user_status">
                <input
                  type="hidden"
                  name="candidate_test_id"
                  value={usertestData?.data?.id}
                />
                <input
                  type="hidden"
                  name="candidate_id"
                  value={usertestData?.data?.candidate_id}
                />
                <input
                  type="hidden"
                  name="candidate_status"
                  id="candidate_status"
                  value=""
                />
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <h3 className="card-title">Candidate Status</h3>
                  </div>
                  <div className="card-footer">
                    <div className="float-right">
                      <button
                        type="submit"
                        className="btn btn-success wgz_btns"
                        value="1"
                      >
                        <i className="fas fa-check"></i> Accept
                      </button>
                      <button
                        type="submit"
                        className="btn btn-danger wgz_btns"
                        value="2"
                      >
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </div>
                  </div>
                </div>
              </form> */}

              {/* Send Message Form */}
              <form method="post" id="wgz_user_form">
                <input
                  type="hidden"
                  name="candidate_id"
                  value={usertestData?.data?.candidate_id}
                />
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <h3 className="card-title">Send Message to 
                      { usertestData?.data?.candidate?.full_name ?? "Candidate Name"}
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <textarea
                        id="compose-textarea"
                        className="form-control"
                        name="message"
                        rows="6"
                      ></textarea>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="float-right">
                      <button type="submit" className="btn btn-primary">
                        <i className="far fa-envelope"></i> Send
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AptitudeTestComplete;
