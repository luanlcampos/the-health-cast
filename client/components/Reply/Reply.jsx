import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

const Reply = ({ replyId }) => {
  const [reply, setReply] = useState();
  const [author, setAuthor] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadReply = async () => {
      const replyRef = doc(db, "replies", replyId);
      const replySnap = await getDoc(replyRef);

      console.log(replySnap.exists());
      if (replySnap.exists()) {
        const data = replySnap.data();

        setReply(data);

        return data;
      }
    };

    const loadAuthor = async (userId) => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const user = userSnap.data();

        setAuthor(user.firstName + " " + user.lastName);
      }
    };

    loadReply()
      .then((data) => {
        loadAuthor(data.authorId).catch((err) => console.log(err));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <div className="w-full">
      {!isLoading && reply && author && (
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
                <div>{reply.content}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reply;
