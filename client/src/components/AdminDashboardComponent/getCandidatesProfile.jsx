import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CandidateProfile = () => {
  const { profile_id } = useParams();

  const [candidateData, setCandidateData] = useState([]);


    const fetchCandidateProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/candidate/profile/${profile_id}`,
        { withCredentials: true }
      );
      console.log(response.data);
      setCandidateData(response.data); 
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } 
  };

  useEffect(() => {
    fetchCandidateProfile();
   }, [profile_id]);

  if (!candidateData) return <p>Loading...</p>;

//   const { candidate, candidate_questions, candidate_relationship } = candidateData;
// console.log(candidateData);
  return (
    // <h1>jhsgdj</h1>
    <div>
      <h2>{candidateData?.candidate?.full_name}</h2>
      <p>Email: {candidateData?.candidate?.email}</p>
      <p>Mobile: {candidateData?.candidate?.mobile_number}</p>

      <h3>Educations</h3>
      <ul>
        {candidateData?.candidate?.educations?.map((edu, i) => (
          <li key={i}>{edu.institute_name} ({edu.from} - {edu.to}) - {edu.professional_qualification}</li>
        ))}
      </ul>

      {/* Add similar sections for employment, family, assessments, etc. */}
    </div>
  );
};

export default CandidateProfile;
