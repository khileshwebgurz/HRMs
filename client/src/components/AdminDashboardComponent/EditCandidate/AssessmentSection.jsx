
const AssessmentSection = ({
  assessmentSectionData,
  setAssessmentSectionData,
}) => {
  const handleChange = (index, field, value) => {
    const updated = [...assessmentSectionData];
    updated[index][field] = value;
    setAssessmentSectionData(updated);
  };

  const weightOptions = [
    { label: "Below Average", value: "1" },
    { label: "Average", value: "2" },
    { label: "Above Average", value: "3" },
  ];

  // Static titles (these will always show in the UI)
  const staticTitles = [
    "Aptitude Test Score",
    "Technical Test (Theoretical)",
    "Technical Test (Practical)",
    "HR Round",
  ];

  return (
    <div className="card">
      <div className="card-header">Assessment Section</div>
      <div className="card-body">
        <table className="table table-bordered" id="wgz_assessments">
          <thead>
            <tr>
              <th>Assessment Title</th>
              <th>Assessment By</th>
              <th>Weight Age</th>
              <th>Score (out of 10)</th>
            </tr>
          </thead>
          <tbody>
            {staticTitles.map((title, index) => (
              <tr key={index}>
                <td>{title}</td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value={assessmentSectionData[index]?.assessment_by || ""}
                    onChange={(e) =>
                      handleChange(index, "assessment_by", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    className="custom-select"
                    value={assessmentSectionData[index]?.weight_age || ""}
                    onChange={(e) =>
                      handleChange(index, "weight_age", e.target.value)
                    }
                  >
                    <option value="">Choose...</option>
                    {weightOptions.map((opt, i) => (
                      <option key={i} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    max="10"
                    step=".5"
                    value={assessmentSectionData[index]?.score || ""}
                    onChange={(e) =>
                      handleChange(index, "score", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default AssessmentSection;
