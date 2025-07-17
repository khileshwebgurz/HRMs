import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import JobParticular from "./EditCandidate/JobParticular";
import PersonalParticular from "./EditCandidate/PersonalParticular";
import EducationDetails from "./EditCandidate/EducationDetails";
import LanguageProficiency from "./EditCandidate/LanguageProficiency";
import TechnicalSkils from "./EditCandidate/TechnicalSkils";
import EmploymentHistory from "./EditCandidate/EmploymentHistory";
import FamilyDetails from "./EditCandidate/FamilyDetails";
import OtherInfo from "./EditCandidate/OtherInfo";
import OfficialUse from "./EditCandidate/OfficialUse";
import AssessmentSection from "./EditCandidate/AssessmentSection";
import Hod from "./EditCandidate/Hod";

const CandidateEditForm = () => {
  const { candidate_id } = useParams();

  const [candidateProfile, setCandidateProfile] = useState({
    // job Particular
    position: "",
    department: "",

    // Personal Particular
    full_name: "",
    mobile_number: "",
    gender: "", // "1" for male, "2" for female
    passport_number: "",
    residence_address: "",
    nationality: "",
    place_of_birth: "",
    email: "",
    dob: "",
    age: "",
    hobbies: "",
    marital_status: "", // "1" or "2"
  });

  const [assessmentData, setAssessmentData] = useState({
    1: {
      interviewer_name: "",
      education: "",
      experince: "",
      attitude: "",
      stability: "",
      technical_skills: "",
      appearance_personality: "",
      skills: "",
    },
    2: {
      interviewer_name: "",
      education: "",
      experince: "",
      attitude: "",
      stability: "",
      technical_skills: "",
      appearance_personality: "",
      skills: "",
    },
    3: {
      interviewer_name: "",
      education: "",
      experince: "",
      attitude: "",
      stability: "",
      technical_skills: "",
      appearance_personality: "",
      skills: "",
    },
  });

  const [technicalSkills, setTechnicalSkills] = useState("");
  const [educationRows, setEducationRows] = useState([
    {
      institute: "",
      from: "",
      to: "",
      qualification: "",
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

  const [familyMembers, setFamilyMembers] = useState([
    {
      name: "",
      relationship: "",
      age: "",
      occupation: "",
      employer: "",
    },
  ]);

  const [otherInfo, setOtherInfo] = useState([]);

  const [assessmentSectionData, setAssessmentSectionData] = useState([
    {
      title: "Aptitude Test Score",
      assessment_by: "",
      weight_age: "",
      score: "",
    },
    {
      title: "Technical Test (Theoretical)",
      assessment_by: "",
      weight_age: "",
      score: "",
    },
    {
      title: "Technical Test (Practical)",
      assessment_by: "",
      weight_age: "",
      score: "",
    },
    { title: "HR Round", assessment_by: "", weight_age: "", score: "" },
  ]);

  const [recommendation, setRecommendation] = useState({
    status: "",
    remarks: "",
    sourcing: "",
    date_of_interview: "",
    interviewed_by: "",
    interview_score: "",
    current_salary: "",
    expected_salary: "",
    offered_salary: "",
    upload_cv: null,
  });

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/candidates/${candidate_id}`,
          { withCredentials: true }
        );

        console.log("my response is >>", response.data);
        // setCandidateProfile(response.data.candidate);
        setCandidateProfile({
          position: response.data.candidate.position || "",
          department: response.data.candidate.department || "",

          // Personal Particular
          full_name: response.data.candidate.full_name || "",
          mobile_number: response.data.candidate.mobile_number || "",
          gender: response.data.candidate.gender || "",
          passport_number: response.data.candidate.passport_number || "",
          residence_address: response.data.candidate.residence_address || "",
          nationality: response.data.candidate.nationality || "",
          place_of_birth: response.data.candidate.place_of_birth || "",
          email: response.data.candidate.email || "",
          dob: response.data.candidate.dob || "",
          age: response.data.candidate.age || "",
          hobbies: response.data.candidate.hobbies || "",
          marital_status: response.data.candidate.marital_status || "",
        });

        setEducationRows(response?.data?.candidate.educations || []);
        setLanguages(response?.data?.candidate?.languages || []);
        setTechnicalSkills(response?.data?.candidate?.skills_section || "");
        setEmployments(response?.data?.candidate?.employments || []);
        setFamilyMembers(response?.data?.candidate?.families || []);
        setAssessmentSectionData(
          response?.data?.candidate?.assessment_section || []
        );

        setRecommendation({
          status: response.data?.candidate.status ?? "",
          remarks: response.data?.candidate.remarks ?? "",
          sourcing: response.data?.candidate.sourcing ?? "",
          date_of_interview: response.data?.candidate.date_of_interview ?? "",
          interviewed_by: response.data?.candidate.interviewed_by ?? "",
          interview_score: response.data?.candidate.interview_score ?? "",
          current_salary: response.data?.candidate.current_salary ?? "",
          expected_salary: response.data?.candidate.expected_salary ?? "",
          offered_salary: response.data?.candidate.offered_salary ?? "",
          cv_file: response.data.candidate.cv_file ?? ""
        });

        setOtherInfo(
          (response.data.candidate_questions || []).map((q) => ({
            ...q,
            status: "",
            reason: "",
          }))
        );
      } catch (error) {
        console.error("Error fetching candidate:", error);
      }
    };

    fetchCandidate();
  }, [candidate_id]);

  const handleCandidateProfileChange = (field, value) => {
    setCandidateProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("candidate_id", candidate_id);

      for (const key in candidateProfile) {
        formData.append(`candidateProfile[${key}]`, candidateProfile[key]);
      }

      // Assessment Data
      Object.entries(assessmentData).forEach(([interviewerId, data]) => {
        for (const key in data) {
          formData.append(
            `assessmentData[${interviewerId}][${key}]`,
            data[key]
          );
        }
      });

      // Technical Skills
      formData.append("technicalSkills", technicalSkills);

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

      // Assessment Section
      assessmentSectionData.forEach((section, idx) => {
        for (const key in section) {
          formData.append(
            `assessmentSectionData[${idx}][${key}]`,
            section[key]
          );
        }
      });

      // Recommendation / HOD
      for (const key in recommendation) {
        if (key === "upload_cv" && recommendation[key]) {
          formData.append("upload_cv", recommendation[key]);
        } else {
          formData.append(`recommendation[${key}]`, recommendation[key]);
        }
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/candidates/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update successful:", response.data);
      alert("Candidate updated successfully!");
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert("Failed to update candidate.");
    }
  };

  return (
    <>
      <JobParticular
        candidateProfile={candidateProfile}
        onChange={handleCandidateProfileChange}
      />

      <PersonalParticular
        candidateProfile={candidateProfile}
        onChange={handleCandidateProfileChange}
      />

      <EducationDetails
        educationRows={educationRows}
        setEducationRows={setEducationRows}
      />

      <LanguageProficiency languages={languages} setLanguages={setLanguages} />

      <TechnicalSkils
        technicalSkills={technicalSkills}
        setTechnicalSkills={setTechnicalSkills}
      />

      <EmploymentHistory
        employments={employments}
        setEmployments={setEmployments}
      />

      <FamilyDetails
        familyMembers={familyMembers}
        setFamilyMembers={setFamilyMembers}
      />

      <OtherInfo otherInfo={otherInfo} setOtherInfo={setOtherInfo} />

      <OfficialUse
        assessmentData={assessmentData}
        setAssessmentData={setAssessmentData}
      />

      <AssessmentSection
        assessmentSectionData={assessmentSectionData}
        setAssessmentSectionData={setAssessmentSectionData}
      />

      <Hod
        recommendation={recommendation}
        setRecommendation={setRecommendation}
      />

      <div className="col-lg-12">
        <button
          className="btn btn-success float-right wgz-submit"
          type="submit"
          onClick={handleFormSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default CandidateEditForm;
