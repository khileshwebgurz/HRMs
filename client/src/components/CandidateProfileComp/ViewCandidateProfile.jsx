import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewCandidateProfile = () => {
  const { profile_id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!profile_id) {
      setErrorMsg("Invalid profile ID.");
      setLoading(false);
      return;
    }

    const fetchCandidate = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/tracker/candidate/profile/${profile_id}/view`,
          { withCredentials: true }
        );
        setCandidate(response.data);
      } catch (error) {
        console.error("Error fetching candidate:", error);
        setErrorMsg("Candidate not found or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [profile_id]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (errorMsg) return <p className="text-danger text-center mt-4">{errorMsg}</p>;

  const { candidate: c } = candidate;

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">Candidate Profile</h2>

      {/* Personal Information */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          Personal Information
        </div>
        <div className="card-body row">
          <div className="col-md-6 mb-2">
            <strong>Full Name:</strong> {c?.full_name}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Email:</strong> {c?.email}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Mobile:</strong> {c?.mobile_number}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Gender:</strong> {c?.gender}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Date of Birth:</strong> {c?.dob}
          </div>
        </div>
      </div>

      {/* Education */}
      {c?.educations?.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">Education</div>
          <ul className="list-group list-group-flush">
            {c.educations.map((edu, idx) => (
              <li className="list-group-item" key={idx}>
                <strong>{edu.degree}</strong> at {edu.institute} ({edu.year})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {c?.skills_section?.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">Skills</div>
          <ul className="list-group list-group-flush">
            {c.skills_section.map((skill, idx) => (
              <li className="list-group-item" key={idx}>
                {skill.skill_name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {c?.languages?.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">Languages</div>
          <ul className="list-group list-group-flush">
            {c.languages.map((lang, idx) => (
              <li className="list-group-item" key={idx}>
                {lang.language_name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Employment History */}
      {c?.employments?.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">Employment History</div>
          <ul className="list-group list-group-flush">
            {c.employments.map((job, idx) => (
              <li className="list-group-item" key={idx}>
                <strong>{job.company_name}</strong> – {job.designation} ({job.from} to {job.to})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Family Information */}
      {c?.families?.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">Family Information</div>
          <ul className="list-group list-group-flush">
            {c.families.map((member, idx) => (
              <li className="list-group-item" key={idx}>
                <strong>{member.name}</strong> – {member.relationship} ({member.age} years old)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assessment */}
      {c?.assessment_section?.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">Assessment</div>
          <ul className="list-group list-group-flush">
            {c.assessment_section.map((assess, idx) => (
              <li className="list-group-item" key={idx}>
                {assess.parameter_name}: {assess.rating}/5
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Other Information */}
      {c?.other_informations?.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">Other Information</div>
          <ul className="list-group list-group-flush">
            {c.other_informations.map((info, idx) => (
              <li className="list-group-item" key={idx}>
                <strong>{info.question}</strong>: {info.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewCandidateProfile;
