import React, { useState } from "react";
import CreateLiveSessionForm from "./CreateLiveSessionForm";
import ViewPastLiveSessions from "./ViewPastLiveSessions";
import ViewScheduledUpcommingSessions from "./ViewScheduledUpcommingSessions";

const ManageLiveSessionsIndex = () => {
  const [showForm, setShowForm] = useState(false);

  const triggerShowForm = (e) => {
    e.preventDefault();
    setShowForm(!showForm);
  };

  return (
    <>
      <div className="outline outline-pink-500  main-content w-full">
        <div className="overflow-auto outline outline-blue-500 main-content-header flex flex-col gap-y-[2rem]">
          <form>
            <button
              onClick={(e) => triggerShowForm(e)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {showForm ? `Cancel` : `Go Live`}
            </button>
          </form>
          {showForm && <CreateLiveSessionForm></CreateLiveSessionForm>}
          <p className="outline outline-pink-500">Should render the upcoming live sessions</p>
          <p className="outline outline-pink-500">Should render the upcoming live sessions</p>
        </div>
      </div>
    </>
  );
};

export default ManageLiveSessionsIndex;
