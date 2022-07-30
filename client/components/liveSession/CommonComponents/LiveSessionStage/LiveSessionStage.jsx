import { JitsiMeeting } from "@jitsi/react-sdk";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useAuth } from "@/firebase/auth";
import { ClassNames } from "@emotion/react";

const LiveSessionStage = ({
  liveSessionRoomID,
  currentUserData,
  creatorStatus,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useAuth();

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
    "hangup",
  ];

  const regularTools = ["fullscreen", "raisehand"];
  useEffect(() => {
    if (
      !(
        currentUserData &&
        currentUserData.firstName &&
        currentUserData.lastName
      )
    ) {
      currentUserData = { ...userData };
      console.log(currentUserData);
    }
    setIsLoading(false);
  }, []);

  return (
    <>
      {!currentUserData ? (
        <Loading />
      ) : (
        <div className="aspect-video flex-1 mx-2">
          <JitsiMeeting
            configOverwrite={{
              prejoinPageEnabled: false, //This here
              startWithAudioMuted: !creatorStatus,
              startWithVideoMuted: !creatorStatus,
              localRecording: { enabled: creatorStatus },
              toolbarButtons: creatorStatus ? creatorTools : regularTools,
              tileView: { numberOfVisibleTiles: 1 },
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
        </div>
      )}
    </>
  );
};

export default LiveSessionStage;
