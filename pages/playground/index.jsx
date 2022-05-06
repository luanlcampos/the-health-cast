import React, { useState } from "react";
import Link from "next/link";
import uuid from "react-uuid";

export default function Home() {
  const [numClicks, setNumClicks] = useState(0);

  function increaseNumClicks(e) {
    // 'e' is the current event object
    setNumClicks((prevClicks) => prevClicks + 1);
  }

  function isEmpty() {
    if (numClicks > 2) return true;
    else return false;
  }
  return (
    <>
      <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-black-600">
        Hi Supriya HCP, This is your dashboard
      </h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={increaseNumClicks}
      >
        Click me!
      </button>
      <p>{isEmpty ? "Clicks is " + numClicks : ""}</p>

      <Link href={`/playground/${uuid()}`}>
        <a className="font-medium leading-tight text-5xl mt-0 mb-2 text-black-600">
          Create New Live Session
        </a>
      </Link>
      <Link href="/playground/new">
        <a> Create New Live Session --- this link</a>
      </Link>
    </>
  );
}
