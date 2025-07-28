
import PersonalInfoSection from "./PersonalInfo/PersonalInfoSection";
import AddressInfoSection from "./PersonalInfo/AddressInfoSection";
import ContactInfoSection from "./PersonalInfo/ContactInfoSection";
import OtherSection from "./PersonalInfo/OtherSection";
import EmploymentHistory from "./PersonalInfo/EmploymentHistory";
import EducationDetail from "./PersonalInfo/EducationDetail";
import TrainingInfo from "./PersonalInfo/TrainingInfo";
import IDInfo from "./PersonalInfo/IDInfo";
import AcademicCertification from "./PersonalInfo/AcademicCertification";
import ReferenceNumber from "./PersonalInfo/ReferenceNumber";
import OtherInformation from "./PersonalInfo/OtherInformation";

const PersonalInfo = ({ employeedata, user }) => {
  console.log("my employee data is >>>", employeedata);
  return (
    <>
      <section className="content mt-4 info-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              {/* primary info */}
              <PersonalInfoSection employeedata={employeedata}/>

              {/* address info */}
              <AddressInfoSection employeedata={employeedata} />

              {/* contact info */}
              <ContactInfoSection employeedata={employeedata}  />

              {/* other info */}

              <OtherSection  employeedata={employeedata}  />

              {/* employment history */}

              <EmploymentHistory  employeedata={employeedata}  />

              {/* education details */}

              <EducationDetail employeedata={employeedata}  />
              {/* trining */}

              <TrainingInfo  employeedata={employeedata} />

              {/* ID proof */}

              <IDInfo employeedata={employeedata} />

              {/* Academic Certifications */}
              <AcademicCertification employeedata={employeedata} />

              {/* Reference Number */}
              <ReferenceNumber employeedata={employeedata}/>

              {/* other informations */}

              <OtherInformation employeedata={employeedata} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PersonalInfo;
