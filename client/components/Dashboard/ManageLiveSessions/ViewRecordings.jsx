import { useAuth } from "../../../firebase/auth";
import { Timestamp } from "firebase/firestore";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";
import Alert from "@mui/material/Alert";


import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";


import EditLiveSessionModal from "./EditLiveSessionModal";
import DeleteRecordingModal from "./DeleteRecordingModal";

const ViewRecordings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const { user } = useAuth();

  const [LiveSessions, setLiveSessions] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    const loadLiveSessions = async () => {
      try {
        // thread collection reference
        const liveSessionsRef = collection(db, "liveSessions");
        const liveSessionsSnap = await getDocs(liveSessionsRef);
        const data = liveSessionsSnap.docs
          .map((givenLiveSession) => ({
            ...givenLiveSession.data(),
            id: givenLiveSession.id,
          }))
          .filter((givenLiveSession) => givenLiveSession.isARecording);

        setLiveSessions(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    loadLiveSessions();
  }, []);

  return (
    <div className="w-full px-10 py-5">
      <h1 className="text-3xl font-bold pb-10">Recordings</h1>
      <div className="card-list flex flex-row flex-wrap justify-between w-full">
        {isLoading && !LiveSessions ? (
          <Loading />
        ) : (
          <>
            {alertMessage != "" && (
              <Alert className="p-8" severity="info">
                {alertMessage}
              </Alert>
            )}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="w-1/3">Title</TableCell>
                    <TableCell className="w-1/3" align="left">
                      Description
                    </TableCell>
                    <TableCell align="left">Date</TableCell>
                    <TableCell align="left">Tags</TableCell>
                    <TableCell align="left">Edit</TableCell>
                    <TableCell align="left">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {LiveSessions.filter(
                    (givenLiveSession) =>
                      givenLiveSession.createdByHcpId === user.uid &&
                      new Timestamp(
                        givenLiveSession.sessionScheduleDate.seconds,
                        givenLiveSession.sessionScheduleDate.nanoseconds
                      )
                        .toDate()
                        .valueOf() < new Date().valueOf() &&
                      givenLiveSession.isARecording
                  ).map((row) => (
                    <TableRow
                      key={row.title}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell className="w-1/3" component="th" scope="row">
                        {row.title}
                      </TableCell>
                      <TableCell className="w-1/3" align="left">
                        {row.description}
                      </TableCell>
                      <TableCell align="left">
                        {new Timestamp(
                          row.sessionScheduleDate.seconds,
                          row.sessionScheduleDate.nanoseconds
                        )
                          .toDate()
                          .toLocaleString("en-us", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                          .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2")}
                      </TableCell>
                      <TableCell align="left">
                        {row.interests.map((givenInterest) => (
                          <Chip
                            className="m-1"
                            key={givenInterest}
                            label={givenInterest}
                          />
                        ))}
                      </TableCell>
                      <TableCell align="left">
                        <EditLiveSessionModal givenLiveSessionID={row.id}
                          setAlertMessage={setAlertMessage}
                        ></EditLiveSessionModal>
                      </TableCell>
                      <TableCell align="left">
                        <DeleteRecordingModal
                          setAlertMessage={setAlertMessage}
                          liveSessionID={row.id}
                          recordingStoragePath={row.recordingStoragePath}
                        ></DeleteRecordingModal>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewRecordings;
