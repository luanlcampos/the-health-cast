import LiveSessionStage from "@/components/liveSession/CommonComponents/LiveSessionStage/LiveSessionStage";
import Audience from "@/components/liveSession/CommonComponents/Audience/Audience";
import HCPInfo from "@/components/liveSession/CommonComponents/HCPInformation/HCPInfo";
import LiveSessionChatWindow from "@/components/liveSession/CommonComponents/LiveSessionChatWindow/LiveSessionChatWindow";

import HCPControls from "@/components/liveSession/HCPControls/HCPControls";

const OngoingLiveSession = () => {
  return (
    <div className="outline outline-cyan-500 flex flex-col">
      <h1>Live Session Wrapper</h1>
      <LiveSessionStage></LiveSessionStage>
      <Audience></Audience>
      <HCPInfo></HCPInfo>
      <HCPControls></HCPControls>
      <LiveSessionChatWindow></LiveSessionChatWindow>
    </div>
  );
};

export default OngoingLiveSession;
