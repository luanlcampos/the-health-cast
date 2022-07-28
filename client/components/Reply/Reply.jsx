import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Avatar } from "@mui/material";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import EditReplyModal from "./EditReplyModal";
import DeleteReplyModal from "./DeleteReplyModal";

const Reply = ({ data, threadID, replyID }) => {
  const [author, setAuthor] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState();
  const [replyContent, setReplyContent] = useState();
  const [initial, setInitial] = useState();

  const { user } = useAuth();

  useEffect(() => {
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setReplyContent(data.content);
  }, []);

  const loadAuthor = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const user = userSnap.data();

      const fName = user.firstName;
      const lName = user.lastName;

      setAuthor(fName + " " + lName);
      setInitial(fName.split("")[0] + lName.split("")[0]);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    loadAuthor(data.authorId).catch((err) => console.log(err));

    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="w-full">
        {!isLoading && data && author && (
          <div className="px-10 py-5">
            {/* Content */}
            <div className="flex bg-gray-400 rounded-xl shadow-lg">
              <div className="w-[150px] h-[150px] flex">
                <Avatar
                  sx={{
                    width: "135px",
                    height: "135px",
                    bgcolor: "#444444",
                  }}
                  className="w-32 my-auto mx-auto rounded-full border-8 border-white"
                >
                  <span className="text-4xl">{initial}</span>
                </Avatar>
              </div>
              <div className="flex-1">
                <div className="p-5">
                  <h2 className="text-2xl">{author}</h2>
                  <div>{replyContent}</div>
                </div>
              </div>
              {data.authorId === user.uid && (
                <div className="flex">
                  <div className="p-4">
                    <AiFillEdit
                      onClick={() => setIsEditOpen(true)}
                      className="hover:cursor-pointer"
                    />
                  </div>
                  <div className="p-4">
                    <AiFillDelete
                      onClick={() => setIsDeleteOpen(true)}
                      className="hover:cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {isEditOpen && (
        <EditReplyModal
          isOpen={isEditOpen}
          origContent={data.content}
          replyId={replyID}
          threadID={threadID}
          reply={data}
          handleClose={() => setIsEditOpen(false)}
          setReplyContent={setReplyContent}
        />
      )}
      {isDeleteOpen && (
        <DeleteReplyModal
          isOpen={isDeleteOpen}
          replyId={replyID}
          threadID={threadID}
          handleClose={() => setIsDeleteOpen(false)}
        />
      )}
    </>
  );
};

export default Reply;
