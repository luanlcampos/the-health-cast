import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  increment,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Avatar } from "@mui/material";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import Thread from "@/components/forum/Thread";
import Reply from "@/components/Reply/Reply";
import Loading from "@/components/Loading";
import { Reply as ReplyModel, replyConverter } from "@/model/Reply/reply";
import SignedLayout from "@/components/Layout/SignedLayout";

const ThreadById = () => {
  const router = useRouter();
  const { user, userData } = useAuth();
  const { threadID } = router.query;
  const [thread, setThread] = useState();
  const [thrAuthor, setThrAuthor] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [reply, setReply] = useState();
  const [replies, setReplies] = useState([]);
  const [initial, setInitial] = useState();

  const { register, handleSubmit, reset, formState } = useForm();

  const loadThread = async () => {
    // thread collection reference
    const threadRef = doc(db, "threads", threadID);
    const threadSnap = await getDoc(threadRef);

    if (threadSnap.exists()) {
      const data = threadSnap.data();

      return data;
    }
  };

  const loadReplies = async () => {
    const replyRef = collection(db, "threads", threadID, "replies");

    const q = query(replyRef, orderBy("createdAt", "asc"));
    onSnapshot(q, (s) => {
      let reps = [];
      s.docs.forEach((doc) => {
        reps.push({ id: doc.id, data: doc.data() });
      });
      setReplies(reps);
    });
  };

  const loadUser = async (userId) => {
    // user collection reference
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const user = userSnap.data();

      setThrAuthor(user.firstName + " " + user.lastName);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    loadThread()
      .then((thread) => {
        setThread(thread);
        loadUser(thread.authorId).catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });

    loadReplies().catch((err) => {
      console.log(err);
    });

    if (formState.isSubmitSuccessful) {
      reset({ content: "" });
    }

    if (userData) {
      const fName = userData.firstName;
      const lName = userData.lastName;

      setInitial(fName.split("")[0] + lName.split("")[0]);
    }
    console.log("UseEffect called at threadID.jsx");

    setIsLoading(false);
  }, [reply, threadID, userData]);

  const handleReplySubmit = async (data) => {
    const { content } = data;

    const rep = new ReplyModel(uuidv4(), user.uid, content);

    setReply(rep);

    const threadRef = doc(db, "threads", threadID);
    const replyRef = collection(threadRef, "replies").withConverter(
      replyConverter
    );
    await addDoc(replyRef, rep);
    await updateDoc(threadRef, {
      replies: increment(1),
    });
  };

  if (!user) {
    router.push("/login");
    return;
  }

  return (
    <div>
      <SignedLayout>
        {!isLoading && thread ? (
          <div className="w-full max-h-full overflow-y-auto container-snap">
            <Thread thread={thread} threadId={threadID} userName={thrAuthor} />
            <div className="flex bg-gray-200 p-5 shadow-xl m-10 rounded-xl">
              <div className="my-auto flex">
                <Avatar
                  sx={{
                    width: "80px",
                    height: "80px",
                    bgcolor: "#335555",
                  }}
                  className="w-32 mx-auto rounded-full border-8 border-white"
                >
                  <span className="text-2xl">{initial}</span>
                </Avatar>
              </div>
              <div className="flex-1 h-full ml-5">
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
            {!isLoading &&
              replies.length > 0 &&
              replies.map((reply) => (
                <Reply
                  data={reply.data}
                  threadID={threadID}
                  replyID={reply.id}
                />
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

// Prevent loss of threadID after hard-refresh
export async function getServerSideProps() {
  return {
    props: {},
  };
}
