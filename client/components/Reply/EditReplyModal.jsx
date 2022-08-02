import { doc, updateDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Modal } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export default function EditReplyModal({
  origContent,
  isOpen,
  replyId,
  threadID,
  reply,
  handleClose,
  setReplyContent,
}) {
  const [open, setOpen] = useState(isOpen);
  const [content, setContent] = useState(origContent);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setOpen(false);

    if (origContent !== content) {
      const replyColRef = collection(db, "threads", threadID, "replies");
      const replyRef = doc(replyColRef, replyId);
      await updateDoc(replyRef, {
        content: content,
        updatedAt: Timestamp.now(),
      });
      setReplyContent(content);
      reply.content = content;
    }
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
        <h1 className="text-xl">Edit Content</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            defaultValue={content}
            onChange={handleChange}
            placeholder="Edit the contents..."
            rows="5"
            cols="50"
            maxLength={400}
            className="border border-gray-300 rounded-md p-2 resize-none ring-0 active:ring-0 focus:ring-0 focus:outline-none"
          />
          <br />
          <div className="btn flex w-full justify-end">
            <button
              type="submit"
              className="btn border py-2 px-3 bg-my-blue text-white font-semi-bold rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
