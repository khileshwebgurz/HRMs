

const LanguageProficiency = ({ languages, setLanguages }) => {
  // ///////////// Handling the Language rows /////////////////////////////////////
  const languagesList = ["English", "Hindi", "Punjabi"];
 
  const handleLangChange = (index, field, value) => {
    const updated = [...languages];
    updated[index][field] = value;
    setLanguages(updated);
  };

  const handleLangAddRow = () => {
    setLanguages([
      ...languages,
      { language: "", speak: "1", write: "1", understand: "1" },
    ]);
  };

  const handleLangDeleteRow = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this language row?"
    );
    if (confirmDelete) {
      const updated = [...languages];
      updated.splice(index, 1);
      setLanguages(updated);
    }
  };
  return (
    <>
      <div className="card">
        <div className="card-header">
          Language Proficiency
          <button
            type="button"
            className="btn btn-primary btn-sm float-right"
            onClick={handleLangAddRow}
          >
            <i className="fas fa-plus"></i> Add Row
          </button>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th width="5%">S No.</th>
                <th width="20%">Language</th>
                <th width="15%">Speak</th>
                <th width="15%">Write</th>
                <th width="15%">Understand</th>
                <th width="10%">Action</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((lang, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <select
                      className="custom-select"
                      value={lang.language}
                      onChange={(e) =>
                        handleLangChange(index, "language", e.target.value)
                      }
                    >
                      <option value="">Select Language...</option>
                      {languagesList.map((lng, i) => (
                        <option key={i} value={lng}>
                          {lng}
                        </option>
                      ))}
                    </select>
                  </td>

                  {["speak", "write", "understand"].map((field) => (
                    <td key={field}>
                      <div className="form-check form-check-inline">
                        <label className="form-check-label">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`${field}-${index}`}
                            value="1"
                            checked={lang[field] === "1"}
                            onChange={(e) =>
                              handleLangChange(index, field, e.target.value)
                            }
                          />
                          Yes
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <label className="form-check-label">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`${field}-${index}`}
                            value="0"
                            checked={lang[field] === "0"}
                            onChange={(e) =>
                              handleLangChange(index, field, e.target.value)
                            }
                          />
                          No
                        </label>
                      </div>
                    </td>
                  ))}

                  <td>
                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleLangDeleteRow(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default LanguageProficiency;
