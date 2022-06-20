import { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
// --- REMOVE LINE 8
import Test from "./ManageLiveSessions/test";
// ------
import SideMenu from "../Layout/SideMenu";
import ManageLiveSessionsIndex from "./ManageLiveSessions/ManageLiveSessions";
import CreateThread from "./ManageForums/CreateThread";

/**
 * Wrapper for a "Tab" -> Pass in the main component that you want to render.
 * For example, "Live Session Tab" "Forum Tab" or "Recordings"
 * @param { children, value, index, ...other } props
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

/**
 * WCAG stuff
 * @param index
 * @returns
 */
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

/**
 * Main component, renders all three tabs and provides logic to switch between tabs
 */
export default function Dashboard() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <>
        <div className="main-container flex flex-column  h-[calc(100vh-70px)]">
          <div className="side-menu w-2/12 min-w-[200px]">
            <SideMenu />
          </div>
          <div className="outline outline-pink-500 flex flex-col main-content w-full px-10 py-5">
            <div className="outline outline-blue-500 overflow-y-auto main-content-header flex-1 flex flex-col gap-x-10">
              {/* Banner Area Div --> <div className="outline min-h-[10rem]  bg-slate-300">
                <div>Banner Area</div>
              </div> */}
              <div className="px-3 py-5 pb-px outline outline-yellow-500 ">
                <h1 className="text-3xl font-bold pb-5 ">Dashboard</h1>
              </div>
              <Box className="flex-1 overflow-y-auto" sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="Live Session" {...a11yProps(0)} />
                    <Tab label="Recording" {...a11yProps(1)} />
                    <Tab label="Forum" {...a11yProps(2)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <ManageLiveSessionsIndex></ManageLiveSessionsIndex>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Test></Test>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <CreateThread />
                </TabPanel>
              </Box>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
