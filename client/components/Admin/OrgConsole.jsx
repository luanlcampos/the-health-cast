import { useState } from "react";
import Alerts from "./Alerts";
import Requests from "./Requests";

export default function OrgConsole({ user }) {
  // tab alerts and notifications
  const [alertsTab, setAlertsTab] = useState(false);
  return (
    <div className="org-req">
      <div className="menu">
        <div
          className={`tab-title ${alertsTab ? "active" : ""}`}
          onClick={() => setAlertsTab(true)}
        >
          <h1>Alerts</h1>
        </div>
        <div
          className={`tab-title ${!alertsTab ? "active" : ""}`}
          onClick={() => setAlertsTab(false)}
        >
          <h1>Requests</h1>
        </div>
      </div>
      <div className="tab-content h-full">
        {alertsTab ? <Alerts /> : <Requests user={user} />}
      </div>
    </div>
  );
}
