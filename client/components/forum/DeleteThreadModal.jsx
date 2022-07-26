import { doc, deleteDoc } from "firebase/firestore";
import { useState } from "react";
import { Modal } from "@mui/material";
import { db } from "@/firebase/clientApp";

export default function DeleteThreadModal({ isOpen, threadId, handleClose }) {
  const [open, setOpen] = useState(isOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setOpen(false);
    await deleteDoc(doc(db, "threads", threadId));
    handleClose(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => handleClose(false)}
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(75, 85, 99, 0.5)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="flex flex-col bg-white p-5 rounded-md gap-y-2">
        <h1 className="text-xl">Are you sure to delete your content?</h1>
        <div className="btn flex w-full justify-end">
          <button
            className="btn border py-2 px-3 bg-my-blue text-white font-semi-bold rounded-md"
            onClick={handleSubmit}
          >
            Confirm
          </button>
          <button
            className="btn border py-2 px-3 bg-red-700 text-white font-semi-bold rounded-md"
            onClick={() => handleClose(false)}
          >
            cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
