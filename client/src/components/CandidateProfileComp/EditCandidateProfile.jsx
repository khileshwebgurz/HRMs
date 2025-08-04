import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PersonalParticular from "./EditCandidateProf/PersonalParticular";
import EducationDetail from "./EditCandidateProf/EducationDetail";
import LanguageProficiency from "./EditCandidateProf/LanguageProficiency";
import TechnicalSkill from "./EditCandidateProf/TechnicalSkill";
import EmploymentHistory from "./EditCandidateProf/EmploymentHistory";
import FamilyDetail from "./EditCandidateProf/FamilyDetail";
import OtherInfo from "./EditCandidateProf/OtherInfo";
import UploadCV from "./EditCandidateProf/UploadCV";

const EditCandidateProfile = () => {
  const { profile_token } = useParams();
  const [formData, setFormData] = useState(null);
  const fetchData = async () => {
    //candidate/profile/{token}/edit
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/tracker/candidate/profile/${profile_token}/edit`,
      { withCredentials: true }
    );
   setFormData(res?.data || {});
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log("my candiates are dsfsfgdff>>>", formData);

    const handleCandidateProfileChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Edit Candidate</h1>
            </div>
            <div className="col-sm-6 text-right">
              <p id="countdownTimer"></p>
            </div>
          </div>
        </div>
      </section>

      <div className="card">
        <div className="card-body">
          <div className="row mr-1 wgz_candidate_form">
            <form
              action=""
              method="post"
              id="wgz_candidate_form"
              enctype="multipart/form-data"
            >
              <input type="hidden" name="candidate_token" />
              <div className="col-lg-12">
                <PersonalParticular formData={formData?.candidate} onChange={handleCandidateProfileChange} />

                <EducationDetail formData={formData?.candidate_education} setFormData={setFormData} />

                <LanguageProficiency />

                <TechnicalSkill />

                <EmploymentHistory />

                <FamilyDetail />

                <OtherInfo />
                <UploadCV />

                <div className="row">
                  <div className="col-lg-12">
                    <input
                      className="btn btn-success float-right wgz-submit"
                      type="submit"
                      name="submit"
                      value="Update Profile"
                    />
                    <input
                      className="btn btn-success float-right news"
                      name="submit"
                      value="Edit Profile"
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCandidateProfile;
