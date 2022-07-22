import * as React from "react";
import { AiFillEdit } from "react-icons/ai";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import EditLiveSessionForm from "@/components/Dashboard/ManageLiveSessions/EditLiveSessionForm";
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

export default function EditLiveSessionModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        <AiFillEdit></AiFillEdit>
        <span className="px-8">Edit</span>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <EditLiveSessionForm></EditLiveSessionForm>
        </Box>
      </Modal>
    </div>
  );
}
