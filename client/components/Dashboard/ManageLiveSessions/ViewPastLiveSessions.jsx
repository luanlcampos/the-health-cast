import { useAuth } from "../../../firebase/auth";
import { Timestamp } from "firebase/firestore";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";



import EditLiveSessionModal from "./EditLiveSessionModal";

const ViewPastLiveSessions = ({ LiveSessions }) => {
  //1657076400438
  if (LiveSessions) {
    LiveSessions[0].interests.map((givenInterest) =>
      console.log(givenInterest)
    );
  }

  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  return (
    <div className="w-full px-10 py-5">
      <h1 className="text-3xl font-bold pb-10">Current & Past Live Sessions</h1>
      <div className="card-list flex flex-row flex-wrap justify-between w-full">
        {isLoading && !LiveSessions ? (
          <Loading />
        ) : (
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
                      .valueOf() < new Date().valueOf()
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
                      {" "}
                      <Stack direction="row" spacing={1}>
                        {row.interests.map((givenInterest) => {
                          <Chip
                            key={givenInterest.toString()}
                            label={givenInterest.toString()}
                          />;
                        })}
                      </Stack>
                    </TableCell>
                    <TableCell align="left">
                      <EditLiveSessionModal></EditLiveSessionModal>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default ViewPastLiveSessions;
