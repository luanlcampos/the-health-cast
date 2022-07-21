import Link from "next/link";
import { useAuth } from "@/firebase/auth";
import { useEffect, useState } from "react";

import UpcomingLiveSession from "./UpcomingLiveSession";

import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

let nextFiveDays = new Array(5);

const UpcomingPreview = ({ upcomingLiveSessions }) => {
  const { user } = useAuth();

  //tabs handler and state
  const [value, setValue] = React.useState("0");
  const [upcomingDates, setUpcomingDates] = React.useState(nextFiveDays);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setUpcomingDates(nextFiveDays);
  };
  //   const [upcomingSessions, SetUpcomingSessions] = useState([]);
  //   const [isLoading, setIsLoading] = useState(true);

  //   useEffect(() => {
  //     setIsLoading(true);
  //     const loadUpcomingSessions = async () => {
  //       try {
  //         // const result = await getDoc(doc(db, "users", String(thread.authorId)));
  //         // const data = { ...result.data(), threadId: thread.id };

  //         SetUpcomingSessions(upcomingLiveSessions);
  //         setIsLoading(false);
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     };
  //     loadUpcomingSessions();
  //   }, []);

  const upcoming = upcomingLiveSessions;
  // console.log(`upcoming: `, upcoming);
  // console.log(`upcoming.length: `, upcoming.length);

  const getNextFiveDays = () => {
    const currDate = new Date();
    nextFiveDays[0] = currDate;
    let i = 1;
    while (i < 5) {
      nextFiveDays[i] = new Date(currDate);
      nextFiveDays[i].setDate(currDate.getDate() + 1);
      currDate = nextFiveDays[i];
      nextFiveDays[i++].toString();
    }
  };
  getNextFiveDays();
  // console.log(`upcomingDates: `, upcomingDates);

  nextFiveDays.forEach((day) => {
    day = Date(day);
    // console.log(
    //   day.split(" ").slice(0, 4).join().replaceAll(",", " ").replace(" ", ", ")
    // );
    day = day
      .split(" ")
      .slice(0, 4)
      .join()
      .replaceAll(",", " ")
      .replace(" ", ", ");
  });

  //   return (
  //     <div>
  //       {upcomingLiveSessions.map((upcomingLiveSession) => {
  //         return <div key={upcomingLiveSession.id}>{upcomingLiveSession.id}</div>;
  //       })}
  //     </div>
  //   );
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="upcoming live session dates tabs"
          >
            {upcomingDates.map((date, index) => {
              return (
                <Tab
                  label={date
                    .toString()
                    .split(" ")
                    .slice(0, 4)
                    .join()
                    .replaceAll(",", " ")
                    .replace(" ", ", ")}
                  value={index.toString()}
                  key={index}
                />
              );
            })}
          </TabList>
        </Box>
        {upcomingDates.map((date, index) => {
          return (
            <TabPanel value={index.toString()} key={(index + 1).toString()}>
              {/* Live Sessions on{" "}
              {date
                .toString()
                .split(" ")
                .slice(0, 4)
                .join()
                .replaceAll(",", " ")
                .replace(" ", ", ")} */}
              <UpcomingLiveSession
                upcomingLives={upcomingLiveSessions}
                upcomingDate={date}
              />
            </TabPanel>
          );
        })}
      </TabContext>
    </Box>
  );
};

export default UpcomingPreview;
