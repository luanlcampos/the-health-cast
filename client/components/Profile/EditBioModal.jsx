import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Modal } from "@mui/material";
import { db } from "@/firebase/clientApp";

export default function EditBioModal({
  mbio,
  isOpen,
  userId,
  userProfileData,
  isAdmin,
  handleClose,
  setUserBio,
}) {
  const [open, setOpen] = useState(isOpen);
  const [bio, setBio] = useState(mbio);

  const handleChange = (e) => {
    setBio(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    console.log("handleSubmit", bio !== userProfileData.biography);
    if (bio !== userProfileData.biography) {
      const col = !isAdmin ? "users" : "admin";
      await updateDoc(doc(db, String(col), String(userId)), {
        biography: bio,
      });
      setUserBio(bio);
      userProfileData.biography = bio;
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
        <h1 className="text-xl">Edit Bio</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            defaultValue={bio}
            onChange={handleChange}
            placeholder="Enter your bio here"
            rows="5"
            cols="50"
            maxLength={200}
            className="border border-gray-300 rounded-md p-2 resize-none ring-0 active:ring-0 focus:ring-0 focus:outline-none"
          />
          <br />
          <div className="btn flex w-full justify-end">
            <button
              type="submit"
              className="btn border py-2 px-3 bg-my-blue text-white font-semi-bold rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
