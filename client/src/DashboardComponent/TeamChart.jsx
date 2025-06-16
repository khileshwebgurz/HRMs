import React from "react";
import "../assets/css/teamchart.css";
import { useState, useEffect } from "react";
import axios from "axios";

const TeamChart = () => {
  const [teamData, setTeamData] = useState([]);
  useEffect(() => {
    const fetchingTeam = async () => {
      const fetchedTeam = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employee/getTeamTree`,
        { withCredentials: true }
      );
      setTeamData(fetchedTeam.data);
    };
    fetchingTeam();
  },[]);


  // optimised jsx
  const renderNode = (node) => {
    return (
      <li key={node.id}>
        <div className="organization-card manager-card">
          <figure className="card-pic image-stroke">
            <img
              src={
                node.profile_pic
                  ? `/uploads/employees-photos/${node.profile_pic}`
                  : `/dist/img/profile${node.gender}.png`
              }
              alt={node.name}
              style={{
                width: "125px",
                height: "125px",
                borderRadius: "50%",
                marginTop: "-3px",
              }}
            />
          </figure>
          <figcaption className="card-content my-2">
            <strong>{node.name}</strong>
            <br />
            <span className="job_title">{node.job_title}</span>
          </figcaption>
        </div>

        {node.children && node.children.length > 0 && (
          <ul>{node.children.map(renderNode)}</ul>
        )}
      </li>
    );
  };

  if (!teamData) return <p>Loading team tree...</p>;

  return (
    <div className="tree">
      {teamData.upliner && (
        <ul className="organization-main-list">
          <li>
            <div className="organization-card manager-card">
              <figure className="card-pic image-stroke">
                <img
                  src={
                    teamData.upliner.profile_pic
                      ? `/uploads/employees-photos/${teamData.upliner.profile_pic}`
                      : `/dist/img/profile${teamData.upliner.gender}.png`
                  }
                  alt={teamData.upliner.name}
                  style={{
                    width: "125px",
                    height: "125px",
                    borderRadius: "50%",
                    marginTop: "-3px",
                  }}
                />
              </figure>
              <figcaption className="card-content my-2">
                <strong>{teamData.upliner.name}</strong>
                <br />
                <span className="job_title">
                  {teamData.upliner.candidate?.job_title || "-"}
                </span>
              </figcaption>
            </div>

            <ul className="employee-list">
              <li>
                <div className="organization-card manager-card">
                  <figure className="card-pic image-stroke">
                    <img
                      src={
                        teamData.current.profile_pic
                          ? `/uploads/employees-photos/${teamData.current.profile_pic}`
                          : `/dist/img/profile${teamData.current.gender}.png`
                      }
                      alt={teamData.current.name}
                      style={{
                        width: "125px",
                        height: "125px",
                        borderRadius: "50%",
                        marginTop: "-3px",
                      }}
                    />
                  </figure>
                  <figcaption className="card-content my-2">
                    <strong>{teamData.current.name}</strong>
                    <br />
                    <span className="job_title">
                      {teamData.current.candidate?.job_title || "-"}
                    </span>
                  </figcaption>
                </div>

                <ul>{teamData.tree.map(renderNode)}</ul>
              </li>
            </ul>
          </li>
        </ul>
      )}
    </div>
  );
};

export default TeamChart;
