import { useAuth } from "../../firebase/auth";
import SideMenu from "../Layout/SideMenu";

// mock data to simulate live sessions
const mockData = [
  {
    sessionTitle: "Session 1",
    hostName: "Dr. John Doe",
    topic: "Cardiology",
    thumbnail: "https://via.placeholder.com/315x180",
  },
  {
    sessionTitle: "Session 2",
    hostName: "Dr. John Doe",
    topic: "Cardiology",
    thumbnail: "https://via.placeholder.com/315x180",
  },
  {
    sessionTitle: "Session 3",
    hostName: "Dr. John Doe",
    topic: "Cardiology",
    thumbnail: "https://via.placeholder.com/315x180",
  },
  {
    sessionTitle: "Session 4",
    hostName: "Dr. John Doe",
    topic: "Cardiology",
    thumbnail: "https://via.placeholder.com/315x180",
  },
];

export default function SignedHome() {
  const { user, userData } = useAuth();
  return (
    <div className="main-container flex flex-column h-[calc(100vh-70px)]">
      <div className="side-menu w-2/12 min-w-[200px]">
        <SideMenu />
      </div>
      {/* Live Now */}
      <div className="main-content w-full px-10 py-5">
        <div className="main-content-header flex flex-col gap-x-10">
          <h1 className="text-3xl font-bold pb-5">Live Now</h1>
        </div>
        <div className="card-list flex flex-row flex-wrap justify-between w-full ">
          {mockData.map((session, index) => (
            <div className="card-item" key={index}>
              <div className="card-item-thumbnail">
                <img src={session.thumbnail} alt="thumbnail" />
              </div>
              <div className="card-item-content">
                <h3>{session.sessionTitle}</h3>
                <p>{session.topic}</p>
                <p>{session.hostName}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Recommended Lives */}
        <div className="main-content-header flex flex-col gap-x-10">
          <h1 className="text-3xl font-bold pb-5">Recommended HCP&#39;s</h1>
        </div>
        <div className="card-list flex flex-row flex-wrap justify-between w-full ">
          {mockData.map((session, index) => (
            <div className="card-item" key={index}>
              <div className="card-item-thumbnail">
                <img src={session.thumbnail} alt="thumbnail" />
              </div>
              <div className="card-item-content">
                <h3>{session.sessionTitle}</h3>
                <p>{session.topic}</p>
                <p>{session.hostName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
