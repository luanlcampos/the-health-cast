import React from 'react'
import Link from "next/link";

const LiveSessionPreviewHyperLink = ({ liveSession }) => {
  return (
    <Link
      href={{
        pathname: `/livesession/${liveSession.id}`,
        query: { liveSessionId: liveSession.id },
      }}
      as={`/livesession/${liveSession.id}`}
    >
      <h2 className="text-2xl pb-2 hover:cursor-pointer hover:underline">
        {liveSession.title}
      </h2>
    </Link>
  );
};

export default LiveSessionPreviewHyperLink