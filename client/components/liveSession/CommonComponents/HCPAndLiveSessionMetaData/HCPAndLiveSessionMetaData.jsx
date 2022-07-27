import React from "react";
import { Timestamp } from "firebase/firestore";
import { Avatar } from "@mui/material";

const HCPAndLiveSessionMetaData = ({ hcpCreatorInfo, liveSessionMetaData }) => {
  
  const liveSessionDate = JSON.parse(liveSessionMetaData.sessionScheduleDate);

  return (
    <div className="bg-white mb-8 rounded-xl drop-shadow-lg">
      <div className="flex flex-col rounded-xl p-2">
        <div className="min-w-[150px] flex content-center">
          <div className="user-avatar pt-1">
            <Avatar
              sx={{ width: "120px", 
                    height: "120px", 
                    bgcolor: "#9FC131",
                 }}
              className="w-32 mx-auto rounded-full border-8 border-white" 
            >
              <span className="text-4xl">
                {hcpCreatorInfo.firstName.toUpperCase().at(0) + " " + hcpCreatorInfo.lastName.toUpperCase().at(0)}
              </span>                  
            </Avatar>
          </div>
          <div className="text-center self-center text-4xl ml-3">
            {hcpCreatorInfo.firstName ? (
              hcpCreatorInfo.firstName + " " + hcpCreatorInfo.lastName
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className=" border-r border-gray-400 p-4">
          <h2 className="m-2 text-2xl pb-2">
            {liveSessionMetaData.title}
          </h2>
          <p className="m-2 text-lg">
            {new Timestamp(liveSessionDate.seconds, liveSessionDate.nanoseconds)
              .toDate()
              .toLocaleString("en-us", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2")}
          </p>
          <p className="m-2 text-lg">{liveSessionMetaData.description}</p>
        </div>
      </div>
    </div>
  );
};

export default HCPAndLiveSessionMetaData;
