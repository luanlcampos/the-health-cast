// import all the missing components
import { useState, useEffect } from "react";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineUserAdd,
  AiOutlineLoading,
} from "react-icons/ai";
import { RiShareForwardLine } from "react-icons/ri";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import "../../styles/Admin.module.scss";
import { db } from "../../firebase/clientApp";

export default function Requests({ user }) {
  // requests array
  const [requests, setRequests] = useState([]);

  // reqLoading state
  const [reqLoading, setReqLoading] = useState(false);

  // requestsLoading state
  const [requestsLoading, setRequestsLoading] = useState(false);

  // useEffect that will listen to the requests collection and update the requests array
  useEffect(() => {
    setReqLoading(true);
    const unsub = onSnapshot(doc(db, "admin", String(user.uid)), (doc) => {
      setRequests(doc.get("requests"));
    });
    setReqLoading(false);
    return () => unsub();
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

      setReqLoading(false);
    } catch (error) {
      console.log(error);
      setReqLoading(false);
    }

    setReqLoading(false);
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

  return requestsLoading ? (
    <div className="flex">
      <AiOutlineLoading className="loading" />
    </div>
  ) : requests.length == 0 ? (
    <div className="no-requests flex w-full h-full items-center justify-center">
      <h1>No Requests</h1>
    </div>
  ) : (
    <div className="requests">
      {requests.map((request, index) => (
        <div className="request-item fade-enter" key={index}>
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
  );
}
