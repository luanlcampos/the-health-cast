import Button from "@mui/material/Button";
import { useReactMediaRecorder } from "react-media-recorder";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { BsRecordCircle } from "react-icons/bs";
import { BiStopCircle } from "react-icons/bi";
import { BsFillStopBtnFill } from "react-icons/bs";
import { BiCameraMovie } from "react-icons/bi";

import RecordingSettingsModal from "./RecordingStreamSettings/RecordingSettingsModal";
import {
  modifyLiveSessionLife,
  modifyLiveSessionRecordingStatus,
} from "./modifyLiveSession";
import { saveToFirestore } from "./saveToFirestore";

import EditLiveSessionModal from "@/components/Dashboard/ManageLiveSessions/EditLiveSessionModal";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import Typography from "@mui/material/Typography";

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
    <div className="outline ">
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
            Actions
          </Typography>
          {(videoRecordingStatus ||
            audioRecordingStatus ||
            shareScreenRecordingStatus) && (
            <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
              <span className="px-8">Recording Status: {status}</span>
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <div className="flex flex-col space-y-4">
            {!videoRecordingStatus &&
              !audioRecordingStatus &&
              !shareScreenRecordingStatus && (
                <Button
                  className="flex-1"
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
                  className="flex-1"
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
                  className="flex-1"
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

            <EditLiveSessionModal></EditLiveSessionModal>
            <Button
              className="flex-1"
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
          </div>
        </CardActions>
      </Card>

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
  );
};

export default HCPControls;
