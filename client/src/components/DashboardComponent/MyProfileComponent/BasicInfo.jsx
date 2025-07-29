
import BasicInfoSection from "./BasicInfo/BasicInfoSection";
import ContactInfo from "./BasicInfo/ContactInfo";
import BankInfo from "./BasicInfo/BankInfo";

const BasicInfo = ({ employeedata }) => {

  console.log('basic info empojsjsjhfbsd', employeedata)
  return (
    <>
      <div className="card card-primary  shadow-none">
        <div className="card-header">
          <h3 className="card-title">Official Information</h3>
        </div>
        <div className="card-body1" id="personalForm">
          {/* <div className="tab-content" id="custom-tabs-four-tabContent"></div> */}
          <div id="custom-tabs-four-tabContent">
            <div className="col-lg-12">
              <BasicInfoSection  employeeData={employeedata}/>

              <ContactInfo employeeData={employeedata} />

              <BankInfo employeeData={employeedata} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicInfo;
