import { useState } from "react";

const FamilyDetails = ({familyMembers, setFamilyMembers}) => {

     // ///////////////////////////// Handling the Family Details //////////////////////////////
     
    
      const relationshipOptions = [
        "Father",
        "Mother",
        "Brother",
        "Sister",
        "Spouse",
        "Son",
        "Daughter",
        "Other"
      ];
    
      const handleFamilyChange = (index, field, value) => {
        const updated = [...familyMembers];
        updated[index][field] = value;
        setFamilyMembers(updated);
      };
    
      const handleFamilyAddRow = () => {
        setFamilyMembers([
          ...familyMembers,
          {
            name: "",
            relationship: "",
            age: "",
            occupation: "",
            employer: ""
          }
        ]);
      };
    
      const handleFamilyDeleteRow = (index) => {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this family member?"
        );
        if (confirmDelete) {
          const updated = [...familyMembers];
          updated.splice(index, 1);
          setFamilyMembers(updated);
        }
      };
  return (
    <>
      <div className="card">
      <div className="card-header">
        FAMILY DETAILS <span className="req">*</span>
        <button
          type="button"
          className="btn btn-primary btn-sm float-right"
          onClick={handleFamilyAddRow}
        >
          <i className="fas fa-plus"></i> Add Row
        </button>
      </div>
      <div className="card-body">
        <table className="table table-bordered" id="wgz_family">
          <thead>
            <tr>
              <th>S No.</th>
              <th>NAME</th>
              <th>RELATIONSHIP</th>
              <th>AGE</th>
              <th>OCCUPATION</th>
              <th>NAME OF EMPLOYER</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {familyMembers.map((member, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      handleFamilyChange(index, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    className="custom-select"
                    value={member.relationship}
                    onChange={(e) =>
                      handleFamilyChange(index, "relationship", e.target.value)
                    }
                  >
                    <option value="">Relationship</option>
                    {relationshipOptions.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    value={member.age}
                    onChange={(e) =>
                      handleFamilyChange(index, "age", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value={member.occupation}
                    onChange={(e) =>
                      handleFamilyChange(index, "occupation", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value={member.name_of_employer}
                    onChange={(e) =>
                      handleFamilyChange(index, "employer", e.target.value)
                    }
                  />
                </td>
                <td>
                  {index > 0 && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleFamilyDeleteRow(index)}
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
  )
}

export default FamilyDetails