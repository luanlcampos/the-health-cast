import { useEffect, useState } from "react";
import Link from "next/link";

const ThreadPreview = ({ thread }) => {
  const [user, setUser] = useState();
  const date = new Date(Date(thread.createdBy)).toDateString();

  useEffect(() => {
    const getUser = async () => {
      const data = await thread.user.then(
        (data) => data.firstName + " " + data.lastName
      );
      setUser(data);
    };

    getUser();
  }, []);

  return (
    <div className="bg-white mb-8 rounded-xl drop-shadow-lg border-2 border-gray-100">
      <div className="flex rounded-xl p-2">
        <div className="min-w-[150px]">
          <img
            src="https://via.placeholder.com/125"
            width="150px"
            height="150px"
            className="p-4"
          />
          <div className="text-center">{user}</div>
        </div>
        <div className="w-1/2 border-r border-gray-400 p-4">
          <Link
            href={{
              pathname: `/thread/${thread.id}`,
              query: {
                currentThread: JSON.stringify(thread),
                author: JSON.stringify(user),
              },
            }}
            as={`/thread/${thread.id}`}
          >
            <h2 className="text-2xl pb-2 hover:cursor-pointer hover:underline">
              {thread.title}
            </h2>
          </Link>
          <p className="text-sm">{thread.description}</p>
        </div>
        <div className="p-4">
          <div className="grow flex pb-4">
            <div className="mr-7">
              <h4 className="text-gray-400">Replies</h4>
              <div className="text-center">{thread.replies.length}</div>
            </div>
          </div>
          <h4 className="text-gray-400">Activity</h4>
          <div>{date}</div>
        </div>
      </div>
    </div>
  );
};

export default ThreadPreview;
