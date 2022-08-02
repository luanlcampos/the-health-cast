import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import CreateLiveSessionForm from "./CreateLiveSessionForm";

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

export default function CreateLiveSessionModal({ setAlertMessage }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        sx={{
          bgcolor: "#a9de09",
          color: "black",
          fontWeight: "bold",
          padding: "1rem",
          "&:hover": {
            color: "black",
            backgroundColor: "#a9de09",
          },
        }}
        onClick={handleOpen}
      >
        Go Live
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CreateLiveSessionForm
            setAlertMessage={setAlertMessage}
            handleClose={handleClose}
          ></CreateLiveSessionForm>
        </Box>
      </Modal>
    </div>
  );
}
