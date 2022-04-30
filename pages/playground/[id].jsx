import { useRouter } from "next/router";
import LiveSessionChatRoom from "../../components/LiveSessionChatRoom";

export default function Playground() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-black-600">
        Hi Dear {id}
      </h1>
      <LiveSessionChatRoom></LiveSessionChatRoom>
      {/* <div>
        <video />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Take a photo
        </button>
      </div> */}

    </>
  );
}
