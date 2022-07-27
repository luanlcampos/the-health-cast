import React from "react";
import { Timestamp } from "firebase/firestore";
import Loading from "@/components/Loading"

const RecordingMetaData = ({ hcpCreatorInfo, liveSessionMetaData }) => {

  console.log("hcpCreator", hcpCreatorInfo)
  console.log("liveSessionMetaData", liveSessionMetaData);
  

  return (
    <div className="bg-white mb-8 rounded-xl drop-shadow-lg">
      <div className="flex flex-col rounded-xl p-2">
        <div className="min-w-[150px] flex content-center">
          <img
            src="https://via.placeholder.com/125"
            width="150px"
            height="150px"
            className="p-4"
          />
          <div className="text-center self-center ">
            {hcpCreatorInfo.firstName ? (
              hcpCreatorInfo.firstName + " " + hcpCreatorInfo.lastName
            ) : (
              <Loading></Loading>
            )}
          </div>
        </div>
        <div className=" border-r border-gray-400 p-4">
          <h2 className="m-2 text-2xl pb-2">{liveSessionMetaData.title}</h2>
          <p className="m-2 text-lg">
            {new Timestamp(
              liveSessionMetaData.sessionScheduleDate.seconds,
              liveSessionMetaData.sessionScheduleDate.nanoseconds
            )
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

export default RecordingMetaData;
