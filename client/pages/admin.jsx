import Header from "../components/Header";
import { useAuth } from "../firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  AiOutlineEdit,
  AiFillDelete,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineUserAdd,
  AiOutlineLoading,
} from "react-icons/ai";
import { FaRegShareSquare } from "react-icons/fa";
import { BsFlag } from "react-icons/bs";
import Select from "react-select";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import "../styles/Admin.module.scss";
import { db } from "../firebase/clientApp";
import { RiShareForwardLine } from "react-icons/ri";

const options = [
  { value: "stream", label: "Stream" },
  { value: "forum", label: "Forum" },
  { value: "all", label: "All" },
];

function Admin() {
  const { user, userData, adminData } = useAuth();

  const router = useRouter();

  if ((userData && userData.isHcp === false) || adminData === null) {
    router.push("/");
    return;
  }

  // requests array
  const [requests, setRequests] = useState([]);

  // tab alerts and notifications
  const [alertsTab, setAlertsTab] = useState(true);

  // request action loading
  const [reqLoading, setReqLoading] = useState(false);

  // hcpDataList state
  const [hcpDataList, setHcpDataList] = useState([]);

  // useEffect that will listen to the requests collection and update the requests array
  useEffect(() => {
    console.log("User Data:", user);
    // getHcpList();
    const unsub = onSnapshot(doc(db, "admin", String(user.uid)), (doc) => {
      setRequests(doc.get("requests"));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const getHcpCall = async () => {
      await getHcpList();
    };

    getHcpCall();
  }, []);

  // function that will add the request to the hcpList field of the admin document
  const addRequest = async (e, request) => {
    e.preventDefault();
    setReqLoading(true);
    try {
      await updateDoc(doc(db, "admin", String(user.uid)), {
        hcpList: arrayUnion(request.userId),
        requests: arrayRemove(request),
      });

      // set the request to approved in the user document
      await updateDoc(doc(db, "users", String(request.userId)), {
        isHcp: true,
        permission: "All",
      });

      // get all the hcpData for each hcp in the hcpList
      await getHcpList();
      setReqLoading(false);
    } catch (error) {
      console.log(error);
      setReqLoading(false);
    }

    setReqLoading(false);
  };

  const getHcpList = async () => {
    setHcpDataList([]);
    const hcpList = await (
      await getDoc(doc(db, "admin", String(user.uid)))
    ).get("hcpList");

    hcpList.forEach(async (hcpId) => {
      const hcpData = await (
        await getDoc(doc(db, "users", String(hcpId)))
      ).data();
      hcpData.hcpId = hcpId;
      setHcpDataList((hcpList) => [...hcpList, hcpData]);
    });
  };

  // function that will remove the request from the hcpList field of the admin document
  const removeRequest = async (e, request) => {
    e.preventDefault();
    setReqLoading(true);
    try {
      // remove the request from the array
      await updateDoc(doc(db, "admin", String(user.uid)), {
        requests: arrayRemove(request),
      });

      // set user requestHcp and isHcp to false
      await updateDoc(doc(db, "users", String(request.userId)), {
        requestHcp: false,
        isHcp: false,
      });

      // trying to update the hcp list, but getting trouble
      await getHcpList();
      setReqLoading(false);
    } catch (error) {
      console.log("Admin request Error", error);
    }
    setReqLoading(false);
  };

  const removeHcpFromList = async (e, hcp) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "admin", String(user.uid)), {
        hcpList: arrayRemove(hcp.hcpId),
      });
      // set user requestHcp and isHcp to false
      await updateDoc(doc(db, "users", String(hcp.hcpId)), {
        requestHcp: false,
        isHcp: false,
      });
      await getHcpList();
      setReqLoading(false);
    } catch (error) {
      console.log("Admin table remove hcp Error", error);
    }
  };

  return (
    <>
      <Header user={user} />
      <div className="main">
        <div className="container org-opt">
          <div className="org-col">
            <div className="title">
              <h1>Welcome, Org Name</h1>
            </div>
          </div>
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
              {alertsTab ? (
                <div className="alerts">
                  <div className="alert-item">
                    <div className="alert-image">
                      <BsFlag className="text-xl" />
                    </div>
                    <div className="alert-text">
                      <span className="text-gray-500"> User was reported</span>
                    </div>
                    <div className="alert-actions">
                      <div className="action">
                        <FaRegShareSquare className="text-xl" />
                      </div>
                      <div className="action">
                        <AiFillDelete className="text-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : requests.length === 0 ? (
                <div className="no-requests flex w-full h-full items-center justify-center">
                  <h1>No Requests</h1>
                </div>
              ) : (
                <div className="requests">
                  {requests.map((request, index) => (
                    <div className="request-item" key={index}>
                      <div className="request-image">
                        <AiOutlineUserAdd className="text-xl " />
                      </div>
                      <div className="request-text">
                        <span className="text-gray-500">
                          {request.firstName} {request.lastName}{" "}
                          {" requested to join your team"}{" "}
                        </span>
                      </div>
                      {reqLoading ? (
                        <div className="loading-spinner flex items-center">
                          <AiOutlineLoading />
                        </div>
                      ) : (
                        <div className="request-actions">
                          <div
                            className="action accept"
                            onClick={(e) => addRequest(e, request)}
                          >
                            <AiOutlineCheck className="text-xl text-[#9FC131]" />
                          </div>
                          <div
                            className="action remove"
                            onClick={(e) => removeRequest(e, request)}
                          >
                            <AiOutlineClose className="text-xl text-red-700" />
                          </div>
                          <div className="action">
                            <RiShareForwardLine className="text-xl text-gray-700" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="container table-container overflow-auto">
          <div className="org-table">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-xl">HCP List</h1>
              {/* search input */}
              <div className="search">
                <input
                  type="text"
                  placeholder="Search"
                  className="border-2 rounded-md p-2"
                />
              </div>
            </div>
            <table className="table-auto w-full">
              <thead className="table-header">
                <tr>
                  <th>Username</th>
                  <th>Profession</th>
                  <th>Specialty</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hcpDataList.map((hcp, index) => (
                  <tr key={index}>
                    <td>
                      <span>
                        {hcp.firstName} {hcp.lastName}
                      </span>
                    </td>
                    <td>
                      <span>{hcp.hcpProfession}</span>
                    </td>
                    <td>
                      <span>
                        {hcp.hcpSpecialty === ""
                          ? "Not Specified"
                          : hcp.hcpSpecialty}
                      </span>
                    </td>
                    <td>
                      {/* select input */}
                      <Select options={options} />
                    </td>
                    <td className="actions">
                      <span>
                        <AiOutlineEdit />
                      </span>
                      <span>
                        <AiFillDelete
                          className="text-red"
                          onClick={(e) => removeHcpFromList(e, hcp)}
                        />
                      </span>
                      <span>
                        <FaRegShareSquare />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
