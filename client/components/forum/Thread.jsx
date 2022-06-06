import { useRouter } from "next/router";

const Thread = ({ thread }) => {
  const router = useRouter();
  const { threadID } = router.query;

  return <div>{threadID}</div>;
};

export default Thread;
