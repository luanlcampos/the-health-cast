import React, { useState } from "react";
import CreateLiveSessionForm from "./CreateLiveSessionForm";
import ViewPastLiveSessions from "./ViewPastLiveSessions";
import ViewScheduledUpcommingSessions from "./ViewScheduledUpcommingSessions";
import Button from "@mui/material/Button";

const ManageLiveSessionsIndex = () => {
  const [showForm, setShowForm] = useState(false);

  const triggerShowForm = (e) => {
    e.preventDefault();
    setShowForm(!showForm);
  };

  return (
    <>
      <div className=" max-h-[calc(100vh-300px)] main-content w-full">
        <div className="  main-content-header flex flex-col gap-y-[2rem]">
          <form>
            <Button
              onClick={(e) => triggerShowForm(e)}
              sx={{
                bgcolor: "#a9de09",
                color: "black",
                fontWeight: "bold",
                padding: "1rem",
                "&:hover": {
                  color: "black",
                  backgroundColor: "#a9de09",
                },
              }}
            >
              {showForm ? `Cancel` : `Go Live`}
            </Button>
          </form>
          {showForm && <CreateLiveSessionForm></CreateLiveSessionForm>}
        </div>
        {/* <ViewPastLiveSessions></ViewPastLiveSessions>
        <ViewPastLiveSessions></ViewPastLiveSessions>
         */}
      </div>
    </>
  );
};

export default ManageLiveSessionsIndex;
