import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useAuth } from "@/firebase/auth";
import { Report } from "@/model/forms/ReportData";

import { db } from '@/firebase/clientApp';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { AiOutlineFrown } from "react-icons/ai";
import Swal from "sweetalert2";

// import {UserData} from '@/model/users/UserData';
// import { getServerSideProps } from '@/pages/profile/[userId]';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 4,
  px: 3,
  pb: 3,
  zIndex: '1 !important',
};

const defaultValues = {
  reportReason: "",
  reportDetails: "",
  reportedAccount: "",
  reportedAccountOrg: "",
  reportedSrc: "",
  reportingAccount: "",
};

export default function ReportModal({/*props*/reportedUserData, reportedUserId, reportingThread}) {
  const [open, setOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState(defaultValues);
  const { user } = useAuth();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // loading state
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      
      const res = await Swal.fire({
        title: "Are you sure you want to submit this report?",
        // text: `Do you want to remove ${interest} from your interests?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, confirm my report!",
        customClass: {
          container: 'report-confirmation'
        },
      });

      if (res.isConfirmed) {
        formValues.reportedAccount = reportedUserId;
        formValues.reportedAccountOrg = reportedUserData.isHcp? reportedUserData.hcpOrg.orgId: "";
        formValues.reportingAccount = user.uid;

        // send reportedSrc data (if threads, live sessions, recordings ...)
        console.log(formValues);

        // submit report data to firebase
          // query user's number of reports and last report submission date (>5 reports and not over 1 week, failed to submit)
        const reportingUserProfileData = await getDoc(doc(db, "users", String(user.uid)));
        reportingUserProfileData = reportingUserProfileData.data();
        console.log("firstMonthlyReportDate", reportingUserProfileData.firstMonthlyReportDate, " | totalNumberReports", reportingUserProfileData.totalNumberReports);
        
        const canSubmitReport = async (date, numOfReportsSubmittedThisWeek) => {
          let currDate = new Date() / 1000;
          let periodSinceLastReport = currDate - date.seconds;  
          
          console.log(`canSubmitReport: `, date, ` | `, numOfReportsSubmittedThisWeek);
          console.log(`canSubmitReport: `, currDate, ` | periodSinceLastReport: `, periodSinceLastReport, ` | 604800 secs in 1 week `);
          if (numOfReportsSubmittedThisWeek < 5){
            return true;
          } else if (periodSinceLastReport > (7 * 24 * 60 * 60)){ //604800 secs in 1 week
            return true;
          }
          return false;
        };

        const subRep = await canSubmitReport(reportingUserProfileData.firstMonthlyReportDate, reportingUserProfileData.totalNumberReports);
        console.log(`val of subRep: ${subRep}`);
        if (subRep){
          const createReport = new Report(
            formValues.reportingAccount,
            formValues.reportedAccount,
            formValues.reportedAccountOrg,
            formValues.reportedSrc,
            formValues.reportReason,
            formValues.reportDetails
          );
          console.log("createReport:", createReport);
          await createReport.save();  // to add a report to the collection "reports"
          

          if (reportingUserProfileData.totalNumberReports > 5) {
            console.log(`totalNumberReports resetted (0 + 1): ${0 + 1}`);
            await updateDoc(doc(db, "users", String(user.uid)), {
              totalNumberReports: 0 + 1,
              firstMonthlyReportDate: new Date(),
            });
          } else {
            console.log(`totalNumberReports added (reportingUserProfileData.totalNumberReports + 1): ${reportingUserProfileData.totalNumberReports + 1}`);
            await updateDoc(doc(db, "users", String(user.uid)), {
              totalNumberReports: reportingUserProfileData.totalNumberReports + 1,
            });
          }

        } else {
          console.log("createReport:", " cannot submit report due to report submission limit");
        }

        handleClose(); // may need to include a response modal here ...
      }
      handleClose();
      setLoading(false);
    } catch (err){
      console.warn(err);
      setLoading(false);
    }
  };

  //logging
  // console.log(props)
  return (
    <div>
      {/* <Button sx={{ color: 'white'  }} onClick={handleOpen}>Report</Button> */}
      <button className="btn btn-primary" onClick={handleOpen}>
        <div className="flex items-center gap-x-3 ">
          <AiOutlineFrown /><p>Report</p>
        </div>
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <FormControl>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {/* You are reporting {reportedUserId} belonging to {reportedUserData.isHcp? reportedUserData.hcpOrg.orgId : 'just a regular user'} */}
            You are reporting 
            {reportedUserData.firstName} 
            {reportedUserData.lastName} 
            {reportedUserData.isHcp? 
            'from ' + reportedUserData.hcpOrg.orgName : ''}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} component="div">
            Please select a reason to issue a report:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} component="div">

            {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="reportReason"
              value={formValues.reportReason}
              onChange={handleInputChange}
            >
              <FormControlLabel value="Violence" control={<Radio />} label="Violence" />
              <FormControlLabel value="Abuse" control={<Radio />} label="Abuse" />
              <FormControlLabel value="Harassment" control={<Radio />} label="Harassment" />
              <FormControlLabel value="Unrelated Content" control={<Radio />} label="Unrelated Content" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              name="reportDetails"
              placeholder="Enter Additional Details here: "
              style={{ width: 350, textAlign: 'center', marginTop: 2, marginBottom: 15   }}
              onChange={handleInputChange}
            />
            </Typography>
            <Button color="warning" variant="contained" href="#contained-buttons" type="submit" 
              onClick={handleSubmit}
            >
              Submit Report
            </Button>
            
          </FormControl>

        </Box>
      </Modal>
    </div>
  );
}
