import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { AiFillEdit } from "react-icons/ai";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import EditReplyModal from "./EditReplyModal";

const Reply = ({ data, threadID, replyID }) => {
  const [author, setAuthor] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState();
  const [replyContent, setReplyContent] = useState();

  const { user } = useAuth();

  useEffect(() => {
    setIsOpen(false);
    setReplyContent(data.content);
  }, []);

  const loadAuthor = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const user = userSnap.data();

      setAuthor(user.firstName + " " + user.lastName);
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
              <div className="w-[150px] h-[150px]">
                <img
                  src="https://via.placeholder.com/150"
                  width="150px"
                  height="150px"
                  className="p-4 rounded-full w-[150px] h-[150px]"
                  alt="profile"
                />
              </div>
              <div className="flex-1">
                <div className="p-5">
                  <h2 className="text-2xl">{author}</h2>
                  <div>{replyContent}</div>
                </div>
              </div>
              {data.authorId === user.uid && (
                <div className="p-4">
                  <AiFillEdit
                    onClick={() => setIsOpen(true)}
                    className="hover:cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {isOpen && (
        <EditReplyModal
          isOpen={isOpen}
          origContent={data.content}
          replyId={replyID}
          threadID={threadID}
          reply={data}
          handleClose={() => setIsOpen(false)}
          setReplyContent={setReplyContent}
        />
      )}
    </>
  );
};

export default Reply;
