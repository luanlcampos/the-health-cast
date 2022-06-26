import React from "react";

const HCPAndLiveSessionMetaData = ({ hcpCreatorInfo, liveSessionMetaData }) => {
  return (
    <div className="bg-white mb-8 rounded-xl drop-shadow-lg border-2 border-gray-100">
      <div className="flex rounded-xl p-2">
        <div className="min-w-[150px]">
          <img
            src="https://via.placeholder.com/125"
            width="150px"
            height="150px"
            className="p-4"
          />
          <div className="text-center">
            {hcpCreatorInfo.firstName ? (
              hcpCreatorInfo.firstName + " " + hcpCreatorInfo.lastName
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className="w-1/2 border-r border-gray-400 p-4">
          <h2 className="text-2xl pb-2 hover:cursor-pointer hover:underline">
            {liveSessionMetaData.title}
          </h2>
          <p className="text-sm">{liveSessionMetaData.description}</p>
        </div>
      </div>
    </div>
  );
};

export default HCPAndLiveSessionMetaData;
