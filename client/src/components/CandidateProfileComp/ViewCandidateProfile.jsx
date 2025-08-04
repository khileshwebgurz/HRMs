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

  if (loading) return <p>Loading...</p>;
  if (errorMsg) return <p className="text-danger">{errorMsg}</p>;

  const { candidate: c } = candidate;

  return (
    <div className="container mt-4">
      <h2>Candidate Profile: {c?.full_name}</h2>
      <hr />

      <section>
        <h4>Personal Information</h4>
        <p><strong>Email:</strong> {c?.email}</p>
        <p><strong>Mobile:</strong> {c?.mobile_number}</p>
        <p><strong>Gender:</strong> {c?.gender}</p>
        <p><strong>Date of Birth:</strong> {c?.dob}</p>
      </section>

      <section>
        <h4>Education</h4>
        <ul>
          {c?.educations?.map((edu, idx) => (
            <li key={idx}>
              {edu.degree} at {edu.institute} ({edu.year})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4>Skills</h4>
        <ul>
          {c?.skills_section?.map((skill, idx) => (
            <li key={idx}>{skill.skill_name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4>Languages</h4>
        <ul>
          {c?.languages?.map((lang, idx) => (
            <li key={idx}>{lang.language_name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4>Employment History</h4>
        <ul>
          {c?.employments?.map((job, idx) => (
            <li key={idx}>
              {job.company_name} – {job.designation} ({job.from} to {job.to})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4>Family Information</h4>
        <ul>
          {c?.families?.map((member, idx) => (
            <li key={idx}>
              {member.name} – {member.relationship} ({member.age} years old)
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4>Assessment</h4>
        <ul>
          {c?.assessment_section?.map((assess, idx) => (
            <li key={idx}>
              {assess.parameter_name}: {assess.rating}/5
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4>Other Information</h4>
        <ul>
          {c?.other_informations?.map((info, idx) => (
            <li key={idx}>
              {info.question}: {info.answer}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ViewCandidateProfile;
