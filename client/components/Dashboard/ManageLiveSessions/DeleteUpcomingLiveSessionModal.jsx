import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { AiFillDelete } from "react-icons/ai";
import { deleteUpcomingSession } from "@/model/LiveSessions/deleteUpcomingSession";
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

export default function DeleteUpcomingLiveSessionModal({
  setAlertMessage,
  givenLiveSessionID,
}) {
  console.log("The Row ID passed in is ", givenLiveSessionID);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDeleteUpcomingSession = () => {
    deleteUpcomingSession(givenLiveSessionID);
    setAlertMessage(
      "Upcoming Live Session Successfully Deleted. Please refresh the page to reflect the results"
    );
    handleClose();
  };
  return (
    <div>
      <Button
        className="flex-1"
        variant="contained"
        onClick={handleOpen}
        sx={{
          bgcolor: "#86a819",
          "&:hover": {
            color: "white",
            backgroundColor: "#a9de09",
          },
        }}
      >
        {" "}
        <AiFillDelete size={20}></AiFillDelete>
        <span className="px-8">Delete</span>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Upcoming Live Session?
          </Typography>
          <Typography
            className="m-8"
            id="modal-modal-description"
            sx={{ mt: 2, mb: 2 }}
          >
            Are you sure you want to delete this upcoming live session?
          </Typography>
          <Button
            onClick={handleDeleteUpcomingSession}
            className="flex-1 m-2"
            variant="contained"
            sx={{
              bgcolor: "#86a819",
              "&:hover": {
                color: "white",
                backgroundColor: "#a9de09",
              },
              ml: 2,
              mr: 2,
            }}
          >
            <span className="px-8">Yes</span>
          </Button>
          <Button
            onClick={handleClose}
            className="flex-1 m-2"
            variant="contained"
            sx={{
              bgcolor: "#86a819",
              "&:hover": {
                color: "white",
                backgroundColor: "#a9de09",
              },
            }}
          >
            <span className="px-8">No</span>
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
