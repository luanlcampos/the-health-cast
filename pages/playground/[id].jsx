import { useRouter } from "next/router";
import PlaygroundWebRTCDemo from "../../components/Playground/Room/PlaygroundWebRTCDemo";
import LiveSessionChatRoom from "../../components/Playground/Room/LiveSessionChatRoom";

export default function Playground() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-black-600">
        Hi Dear {id}
      </h1>
      <div className={`outline outline-4 outline-pink-500`}>
        <h1>Room Component Being Rendered</h1>
        <div className="flex">
          <PlaygroundWebRTCDemo room={id}></PlaygroundWebRTCDemo>
          <LiveSessionChatRoom room={id}></LiveSessionChatRoom>
        </div>
      </div>
      <footer className={`outline outline-4 outline-red-500`}>
        This is the footer
        Enable Delete Button
      </footer>
    </>
  );
}
