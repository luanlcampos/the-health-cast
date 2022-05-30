import { AiOutlineLoading } from "react-icons/ai";

export default function Loading() {
  return (
    <div className="loading-page h-screen w-screen flex items-center justify-center">
      <AiOutlineLoading className="loading-spinner text-3xl" />
    </div>
  );
}
