import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";

import { useAuth } from "../../../firebase/auth";
import LiveSessionPreview from "../../liveSession/LiveSessionPreview";
import Loading from "@/components/Loading";

const ViewScheduledUpcommingSessions = ({ LiveSessions }) => {
  if (LiveSessions)
    console.log(
      new Timestamp(
        LiveSessions[0].sessionScheduleDate.seconds,
        LiveSessions[0].sessionScheduleDate.nanoseconds,
        LiveSessions[0]
      )
        .toDate()
        .valueOf() < new Date().valueOf()
    );
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  return (
    <div className="w-full px-10 py-5">
      <h1 className="text-3xl font-bold pb-10">
        {" "}
        Upcoming Live Sessions Scheduled
      </h1>{" "}
      <div className="card-list flex flex-row flex-wrap justify-between w-full">
        {isLoading && !LiveSessions ? (
          <Loading />
        ) : (
          LiveSessions.filter(
            (givenLiveSession) =>
              givenLiveSession.createdByHcpId === user.uid &&
              new Timestamp(
                givenLiveSession.sessionScheduleDate.seconds,
                givenLiveSession.sessionScheduleDate.nanoseconds
              )
                .toDate()
                .valueOf() > new Date().valueOf()
          ).map((givenLiveSession) => {
            return (
              <LiveSessionPreview
                liveSession={givenLiveSession}
                key={givenLiveSession.id}
              ></LiveSessionPreview>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ViewScheduledUpcommingSessions;
