import Button from "@mui/material/Button";
import { useReactMediaRecorder } from "react-media-recorder";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

import RecordingSettingsModal from "./RecordingStreamSettings/RecordingSettingsModal";
import {
  modifyLiveSessionLife,
  modifyLiveSessionRecordingStatus,
} from "./modifyLiveSession";
import { saveToFirestore } from "./saveToFirestore";

const HCPControls = ({
  liveSessionRoomID,
  liveSessionDocument,
  liveSessionDocReference,
}) => {
  const router = useRouter();

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      // Analyze if health care professional is leaving the room admist them recording or leaving the session open.
      if (
        creatorStatus &&
        currentLiveSession.liveSessionMetaData &&
        currentLiveSession.liveSessionMetaData.isOngoing
      ) {
        // Have SSR render bad routes as a 404.
        modifyLiveSessionLife(liveSessionDocReference);
      }

      return true;
    });

    console.log(liveSessionDocument, liveSessionDocReference);
  }, []);

  const [videoRecordingStatus, setVideoRecordingStatus] = useState(false);
  const [audioRecordingStatus, setAudioRecordingStatus] = useState(false);
  const [shareScreenRecordingStatus, setShareScreenRecordingStatus] =
    useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: videoRecordingStatus,
      audio: audioRecordingStatus,
      screen: shareScreenRecordingStatus,
      onStop: (blobUrl, blob) => {
        saveToFirestore(
          blobUrl,
          liveSessionRoomID,
          videoRecordingStatus,
          audioRecordingStatus,
          shareScreenRecordingStatus
        );
        try {
          if (!liveSessionDocument.isARecording)
            modifyLiveSessionRecordingStatus(liveSessionDocReference);
        } catch (e) {
          console.error("Could not find live session document");
        }
      },
    });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const handleStopRecordingAndSave = async () => {
    stopRecording();
  };

  const handleCloseLiveSession = async () => {
    try {
      if (liveSessionDocument.isOngoing)
        modifyLiveSessionLife(liveSessionDocReference);
      router.push(`/dashboard`);
    } catch (e) {
      console.error("Could not find live session document");
    }
  };

  return (
    <div className="outline outline-cyan-500 ">
      <h1>HCP Controls</h1>
      {!videoRecordingStatus &&
        !audioRecordingStatus &&
        !shareScreenRecordingStatus && (
          <Button
            onClick={handleOpen}
            variant="contained"
            sx={{
              bgcolor: "#86a819",
              "&:hover": {
                color: "white",
                backgroundColor: "#a9de09",
              },
            }}
          >
            Record Live Stream
          </Button>
        )}

      <RecordingSettingsModal
        open={open}
        setOpen={setOpen}
        videoRecordingStatus={videoRecordingStatus}
        audioRecordingStatus={audioRecordingStatus}
        shareScreenRecordingStatus={shareScreenRecordingStatus}
        setVideoRecordingStatus={setVideoRecordingStatus}
        setAudioRecordingStatus={setAudioRecordingStatus}
        setShareScreenRecordingStatus={setShareScreenRecordingStatus}
      ></RecordingSettingsModal>
      {(videoRecordingStatus ||
        audioRecordingStatus ||
        shareScreenRecordingStatus) && (
        <>
          <Button
            onClick={startRecording}
            variant="contained"
            sx={{
              bgcolor: "#86a819",
              "&:hover": {
                color: "white",
                backgroundColor: "#a9de09",
              },
            }}
          >
            Start Recording
          </Button>
          <Button
            variant="contained"
            onClick={handleStopRecordingAndSave}
            sx={{
              bgcolor: "#86a819",
              "&:hover": {
                color: "white",
                backgroundColor: "#a9de09",
              },
            }}
          >
            Stop Recording
          </Button>
        </>
      )}

      <Button
        variant="contained"
        onClick={handleCloseLiveSession}
        sx={{
          bgcolor: "#86a819",
          "&:hover": {
            color: "white",
            backgroundColor: "#a9de09",
          },
        }}
      >
        Close Room
      </Button>
      <p>{status}</p>
      <video src={mediaBlobUrl} controls autoPlay loop />
    </div>
  );
};

export default HCPControls;
