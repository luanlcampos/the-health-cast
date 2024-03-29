import Button from "@mui/material/Button";
import { useReactMediaRecorder } from "react-media-recorder";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { BsRecordCircle } from "react-icons/bs";
import { BiStopCircle } from "react-icons/bi";
import { BsFillStopBtnFill } from "react-icons/bs";
import { BiCameraMovie } from "react-icons/bi";
import Alert from "@mui/material/Alert";

import RecordingSettingsModal from "./RecordingStreamSettings/RecordingSettingsModal";
import {
  modifyLiveSessionLife,
  modifyLiveSessionRecordingStatus,
} from "@/model/LiveSessions/modifyLiveSession";
import { saveRecordingToFirestoreStorage } from "@/model/LiveSessions/saveRecordingToFirestoreStorage";

import EditLiveSessionModal from "@/components/Dashboard/ManageLiveSessions/EditLiveSessionModal";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import Typography from "@mui/material/Typography";

const HCPControls = ({
  liveSessionRoomID,
  liveSessionDocument,
  liveSessionDocReference,
  createdByHcpId,
}) => {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState("");

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
        saveRecordingToFirestoreStorage(
          blobUrl,
          liveSessionRoomID,
          createdByHcpId,
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
    <div className="my-8">
      <div className="bg-white rounded-xl drop-shadow-lg flex flex-col outline outline-gray-100	">
        <div className="flex m-4 justify-center gap-4">
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
                <BiCameraMovie></BiCameraMovie>
                <span className="px-8">Record Live Stream</span>
              </Button>
            )}
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
                <BsRecordCircle></BsRecordCircle>
                <span className="px-8"> Start Recording</span>
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
                <BiStopCircle></BiStopCircle>
                <span className="px-8">Stop Recording</span>
              </Button>
            </>
          )}

          <EditLiveSessionModal
            setAlertMessage={setAlertMessage}
            givenLiveSessionID={liveSessionRoomID}
          ></EditLiveSessionModal>
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
            <BsFillStopBtnFill></BsFillStopBtnFill>
            <span className="px-8">Close Room</span>
          </Button>
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
        </div>
        <div className="flex m-4 justify-center ">
          {(videoRecordingStatus ||
            audioRecordingStatus ||
            shareScreenRecordingStatus) && (
            <Alert className="p-8" severity="info">
              <Typography
                sx={{ fontSize: 18 }}
                color="text.primary"
                gutterBottom
              >
                <span>Recording Status: {status}</span>
              </Typography>
            </Alert>
          )}
          {alertMessage != "" && (
            <Alert className="p-8" severity="info">
              {alertMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default HCPControls;
