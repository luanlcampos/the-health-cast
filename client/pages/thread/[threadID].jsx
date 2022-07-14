import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import SideMenu from "@/components/Layout/SideMenu";
import Header from "@/components/Layout/Header";
import Thread from "@/components/forum/Thread";
import Reply from "@/components/Reply/Reply";
import Loading from "@/components/Loading";
import { Reply as ReplyModel } from "@/model/Reply/reply";
import SignedLayout from "@/components/Layout/SignedLayout";

const ThreadById = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { threadID, author } = router.query;
  const [thread, setThread] = useState();
  const [thrAuthor, setThrAuthor] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [reply, setReply] = useState();

  const { register, handleSubmit, reset, formState } = useForm();

  const loadThread = async () => {
    try {
      // thread collection reference
      const threadRef = doc(db, "threads", threadID);
      const threadSnap = await getDoc(threadRef);

      if (threadSnap.exists()) {
        const data = threadSnap.data();

        return data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadUser = async (userId) => {
    try {
      // user collection reference
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const user = userSnap.data();

        setThrAuthor(user.firstName + " " + user.lastName);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    loadThread()
      .then((thread) => {
        setThread(thread);
        loadUser(thread.authorId).catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    setIsLoading(false);

    if (formState.isSubmitSuccessful) {
      reset({ content: "" });
    }
  }, [reply]);

  const saveReply = async (rep) => {
    await rep.save();
  };

  const addReply = async (data) => {
    const threadRef = doc(db, "threads", threadID);

    await updateDoc(threadRef, {
      replies: arrayUnion(data.replyId),
    });
  };

  const handleReplySubmit = (data) => {
    setIsLoading(true);
    const { content } = data;

    const rep = new ReplyModel(uuidv4(), user.uid, content);

    saveReply(rep)
      .then(() => {
        setReply(rep);
        addReply(rep);
      })
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  };

  if (!user) {
    router.push("/login");
    return;
  }

  return (
    <div>
      <SignedLayout>
        {!isLoading && thread ? (
          <div className="w-full">
            <Thread thread={thread} user={thrAuthor} />
            <div className="flex bg-gray-200 p-5 shadow-xl m-10 rounded-xl">
              <div className="my-auto">
                <img
                  src="https://via.placeholder.com/80"
                  width="80px"
                  height="80px"
                  className="rounded-full mr-5"
                  alt="profile"
                />
              </div>
              <div className="flex-1 h-full">
                <form
                  onSubmit={handleSubmit(handleReplySubmit)}
                  className="flex"
                >
                  <textarea
                    {...register("content")}
                    placeholder="New Comment..."
                    rows={3}
                    maxLength={1000}
                    className="border border-gray-300 rounded-md p-2 resize-none focus:outline-none w-full"
                  />
                  <button
                    type="submit"
                    className="bg-my-green text-white ml-5 px-10 py-1 rounded-lg"
                  >
                    Reply
                  </button>
                </form>
              </div>
            </div>

            {/* Reply */}
            {!isLoading &&
              thread.replies.length > 0 &&
              thread.replies.map((reply) => (
                <Reply replyId={reply} key={reply} />
              ))}
          </div>
        ) : (
          <Loading />
        )}
      </SignedLayout>
    </div>
  );
};

export default ThreadById;
