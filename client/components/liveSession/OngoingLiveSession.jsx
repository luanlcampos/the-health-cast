
import HCPInfo from "@/components/liveSession/CommonComponents/HCPInformation/HCPInfo";
import LiveSessionChatWindow from "@/components/liveSession/CommonComponents/LiveSessionChatWindow/LiveSessionChatWindow";

import HCPControls from "@/components/liveSession/HCPControls/HCPControls";

const OngoingLiveSession = ({ liveSessionRoomID }) => {
  return (
    <div className="outline outline-cyan-500 flex flex-col">
      <h1>Live Session Wrapper</h1>
      <HCPInfo liveSessionRoomID={liveSessionRoomID}></HCPInfo>
      <HCPControls liveSessionRoomID={liveSessionRoomID}></HCPControls>
      <LiveSessionChatWindow
        liveSessionRoomID={liveSessionRoomID}
      ></LiveSessionChatWindow>
    </div>
  );
};

export default OngoingLiveSession;

// go here for testing : 0XY62xf3Ai7kLZmU2f33H
