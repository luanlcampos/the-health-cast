import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import Button from "@mui/material/Button";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function RecordingSettingsModal({
  open,
  setOpen,
  setVideoRecordingStatus,
  setAudioRecordingStatus,
  setShareScreenRecordingStatus,
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value == "video") {
      setVideoRecordingStatus(true);
      setAudioRecordingStatus(true);
      setShareScreenRecordingStatus(false);
      console.log("currently video");
    }
    if (value == "screen") {
      setVideoRecordingStatus(false);
      setAudioRecordingStatus(true);
      setShareScreenRecordingStatus(true);
      console.log("currently screen");
    }
    if (value == "audio") {
      setVideoRecordingStatus(false);
      setAudioRecordingStatus(true);
      setShareScreenRecordingStatus(false);
      console.log("currently audio");
    }
    if (value == "") {
      setVideoRecordingStatus(false);
      setAudioRecordingStatus(false);
      setShareScreenRecordingStatus(false);
      console.log("currently empty");
    }
  }, [value]);

  const handleCancel = () => {
    setValue("");
    handleClose();
  };
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  //const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <FormGroup>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Recording Options
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
          >
            <FormControlLabel
              value="video"
              control={<Radio onClick={handleChange} />}
              label="Video"
            />
            <FormControlLabel
              value="screen"
              control={<Radio onClick={handleChange} />}
              label="Screen"
            />
            <FormControlLabel
              value="audio"
              control={<Radio onClick={handleChange} />}
              label="Audio Only"
            />
          </RadioGroup>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              bgcolor: "#86a819",
              "&:hover": {
                color: "white",
                backgroundColor: "#a9de09",
              },
              m: 1,
            }}
          >
            Submit
          </Button>
          <Button
            onClick={handleCancel}
            variant="contained"
            sx={{
              bgcolor: "#86a819",
              "&:hover": {
                color: "white",
                backgroundColor: "#a9de09",
              },
              m: 1,
            }}
          >
            Cancel
          </Button>
        </FormGroup>
      </Box>
    </Modal>
  );
}
