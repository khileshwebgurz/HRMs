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
  const [formDatas, setFormDatas] = useState(null);

  const [educationRows, setEducationRows] = useState([
    {
      institute: "",
      from: "",
      to: "",
      qualification: "",
    },
  ]);

  const [otherInfo, setOtherInfo] = useState([]);

  const fetchData = async () => {
    //candidate/profile/{token}/edit
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/tracker/candidate/profile/${profile_token}/edit`,
      { withCredentials: true }
    );
    setFormDatas(res?.data || {});
    setEducationRows(res?.data.candidate_education);
    setOtherInfo(res?.data.candidate_questions);
    setEmployments(res?.data.candidate_employment_history)
    setTechnicalSkills(res?.data.candidate_skills)
    setFamilyMembers(res?.data.candidate_families)
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log("my candiates are dsfsfgdff>>>", formDatas);
  const handleCandidateProfileChange = (field, value) => {
    setFormDatas((prev) => ({
      ...prev,
      candidate: {
        ...prev.candidate,
        [field]: value,
      },
    }));
  };

  const [familyMembers, setFamilyMembers] = useState([
    {
      name: "",
      relationship: "",
      age: "",
      occupation: "",
      employer: "",
    },
  ]);

  const [technicalSkills, setTechnicalSkills] = useState("");
  const [employments, setEmployments] = useState([
    {
      company_name: "",
      address: "",
      contact_details: "",
      from: "",
      to: "",
      position: "",
      reason_of_leaving: "",
    },
  ]);

  const [languages, setLanguages] = useState([
    {
      language: "",
      speak: "1",
      write: "1",
      understand: "1",
    },
  ]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("candidate_token", profile_token);

      for (const key in formDatas?.candidate) {
         formData.append(key, formDatas?.candidate[key]);
      }

     


      // Technical Skills
      // formData.append("technicalSkills", technicalSkills);
      formData.append(
        "technicalSkills",
        JSON.stringify(
          Array.isArray(technicalSkills)
            ? technicalSkills.map((s) => s.skill_name) // from array of objects
            : technicalSkills.split(",").map((s) => s.trim()) // from string input
        )
      );

      // Education Rows
      educationRows.forEach((edu, idx) => {
        for (const key in edu) {
          formData.append(`educationRows[${idx}][${key}]`, edu[key]);
        }
      });

      // Languages
      languages.forEach((lang, idx) => {
        for (const key in lang) {
          formData.append(`languages[${idx}][${key}]`, lang[key]);
        }
      });

      // Employment History
      employments.forEach((emp, idx) => {
        for (const key in emp) {
          formData.append(`employments[${idx}][${key}]`, emp[key]);
        }
      });

      // Family Members
      familyMembers.forEach((member, idx) => {
        for (const key in member) {
          formData.append(`familyMembers[${idx}][${key}]`, member[key]);
        }
      });

      // Other Info (questions)
      otherInfo.forEach((info, idx) => {
        formData.append(`otherInfo[${idx}][id]`, info.id);
        formData.append(`otherInfo[${idx}][status]`, info.status);
        formData.append(`otherInfo[${idx}][reason]`, info.reason);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/candidate-update-profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update my data successful:", response.data);
      alert("Candidate updated successfully!");
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert("Failed to update candidate.");
    }
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
              encType="multipart/form-data"
            >
              <input type="hidden" name="candidate_token" />
              <div className="col-lg-12">
                <PersonalParticular
                  formData={formDatas?.candidate}
                  onChange={handleCandidateProfileChange}
                />

                <EducationDetail
                  educationRows={educationRows}
                  setEducationRows={setEducationRows}
                />

                <LanguageProficiency
                  languages={languages}
                  setLanguages={setLanguages}
                />

                <TechnicalSkill
                  technicalSkills={technicalSkills}
                  setTechnicalSkills={setTechnicalSkills}
                />

                <EmploymentHistory
                  employments={employments}
                  setEmployments={setEmployments}
                />

                <FamilyDetail
                  familyMembers={familyMembers}
                  setFamilyMembers={setFamilyMembers}
                />

                <OtherInfo otherInfo={otherInfo} setOtherInfo={setOtherInfo} />
                {/* <UploadCV /> */}

                <div className="row">
                  <div className="col-lg-12">
                    <button
                      className="btn btn-success float-right wgz-submit"
                      type="submit"
                      onClick={handleFormSubmit}
                    >
                      Submit
                    </button>
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
