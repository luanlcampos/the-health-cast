import { JitsiMeeting } from "@jitsi/react-sdk";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

const LiveSessionStage = ({
  liveSessionRoomID,
  hcpCreatorInfo,
  currentUser,
  currentUserData,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const creatorStatus = hcpCreatorInfo.uid == currentUser.uid;
  console.log("rendering");
  console.log(hcpCreatorInfo.uid);
  console.log(currentUser.uid);
  console.log(creatorStatus);
  console.log(currentUserData);

  const creatorTools = [
    "microphone",
    "camera",
    "closedcaptions",
    "desktop",
    "fullscreen",
    "livestreaming",
    "help",
    "mute-everyone",
    "mute-video-everyone",
    "security",
    "hangup"
  ];

 const  regularTools = ["fullscreen", "raisehand"];
  useEffect(() => {
    if (
      currentUserData &&
      currentUserData.firstName &&
      currentUserData.lastName
    )
      setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <JitsiMeeting
          configOverwrite={{
            prejoinPageEnabled: false, //This here
          startWithAudioMuted: !creatorStatus,
            startWithVideoMuted: !creatorStatus,
            localRecording: { enabled: creatorStatus },
            toolbarButtons: creatorStatus ? creatorTools : regularTools,
              tileView: {  numberOfVisibleTiles: 1}
          }}
          roomName={`${liveSessionRoomID}`}
          userInfo={{
            displayName: `${currentUserData.firstName} ${currentUserData.lastName}`,
          }}
          getIFrameRef={(node) => {
            node.style.width = "100%";
            node.style.height = "100%";
          }}
        />
      )}
    </>
  );
};

export default LiveSessionStage;
