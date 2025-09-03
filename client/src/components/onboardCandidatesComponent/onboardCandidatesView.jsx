import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function OnboardCandidatesView() {
  const { id } = useParams(); // candidate_id from route
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/candidate/${id}`,
          { withCredentials: true }
        );

        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch candidate details.");
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) return <p>Loading candidate data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2>Onboard Candidate View</h2>

      {/* Candidate Info */}
      <div>
        <h3>{data?.candidate?.name}</h3>
        <p>Email: {data?.candidateData?.email}</p>
        <p>Phone: {data?.candidateData?.mobile_number}</p>
      </div>

      {/* Tabs */}
      <div>
        {data?.tabs?.map((tab) => (
          <div key={tab.id}>
            <h4>{tab.name}</h4>
            {tab.fields?.map((f) => (
              <div key={f.id}>
                <label>{f.field?.label}:</label>
                <span>{f.field?.fielddata?.[0]?.value || "-"}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Candidate Questions */}
      <div>
        <h4>Candidate Questions</h4>
        <ul>
          {data?.candidate_questions?.map((q) => (
            <li key={q.id}>{q.question}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OnboardCandidatesView;
