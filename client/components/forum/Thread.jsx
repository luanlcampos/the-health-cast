import { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useAuth } from "@/firebase/auth";
import EditThreadModal from "./EditThreadModal";
import DeleteThreadModal from "./DeleteThreadModal";

const Thread = ({ thread, threadId, userName }) => {
  const [isEditOpen, setIsEditOpen] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState();
  const [threadContent, setThreadContent] = useState();
  const { user } = useAuth();

  useEffect(() => {
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setThreadContent(thread.content);
    console.log("UseEffect called at Thread.jsx");
  }, [thread]);

  return (
    <>
      <div className="w-full">
        {/* Title */}
        <div className="px-10 py-5">
          <h2 className="text-2xl">{thread.title}</h2>
          <div className="border-b border-black mb-5"></div>

          {/* Content */}
          <div className="flex bg-my-green rounded-xl shadow-lg">
            <div className="w-[150px] h-[150px]">
              <img
                src="https://via.placeholder.com/150"
                width="150px"
                height="150px"
                className="p-4 rounded-full"
                alt="profile"
              />
            </div>
            <div className="flex-1 p-5">
              <div className="text-xl">{userName}</div>
              <div>{threadContent}</div>
            </div>
            {thread.authorId === user.uid && (
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
      </div>
      {isEditOpen && (
        <EditThreadModal
          isOpen={isEditOpen}
          origContent={thread.content}
          threadId={threadId}
          thread={thread}
          handleClose={() => setIsEditOpen(false)}
          setThreadContent={setThreadContent}
        />
      )}
      {isDeleteOpen && (
        <DeleteThreadModal
          isOpen={isDeleteOpen}
          origContent={thread.content}
          threadId={threadId}
          thread={thread}
          handleClose={() => setIsDeleteOpen(false)}
          setThreadContent={setThreadContent}
        />
      )}
    </>
  );
};

export default Thread;
