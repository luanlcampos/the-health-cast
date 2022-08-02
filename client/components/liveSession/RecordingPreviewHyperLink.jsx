import React from 'react'
import Link from "next/link";

const RecordingPreviewHyperLink = ({ liveSession }) => {
  return (
    <Link
      href={{
        pathname: `/recording/${liveSession.id}`,
        query: { liveSessionId: liveSession.id },
      }}
      as={`/recording/${liveSession.id}`}
    >
      <h2 className="text-2xl pb-2 hover:cursor-pointer hover:underline">
        {liveSession.title}
      </h2>
    </Link>
  );
};

export default RecordingPreviewHyperLink