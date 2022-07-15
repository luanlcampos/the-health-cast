import { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import EditThreadModal from "./EditThreadModal";

const Thread = ({ thread, threadId, user }) => {
  const [isOpen, setIsOpen] = useState();
  const [threadContent, setThreadContent] = useState();

  useEffect(() => {
    setIsOpen(false);
    setThreadContent(thread.content);
  }, []);

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
              <div className="text-xl">{user}</div>
              <div>{threadContent}</div>
            </div>
            <div className="p-4">
              <AiFillEdit
                onClick={() => setIsOpen(true)}
                className="hover:cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <EditThreadModal
          isOpen={isOpen}
          origContent={thread.content}
          threadId={threadId}
          thread={thread}
          handleClose={() => setIsOpen(false)}
          setThreadContent={setThreadContent}
        />
      )}
    </>
  );
};

export default Thread;
