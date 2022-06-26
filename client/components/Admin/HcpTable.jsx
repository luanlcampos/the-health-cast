import { useState, useEffect } from "react";
import { AiOutlineEdit, AiFillDelete, AiOutlineReload } from "react-icons/ai";
import { FaRegShareSquare } from "react-icons/fa";
import Select from "react-select";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";

import "../../styles/Admin.module.scss";
import { db } from "../../firebase/clientApp";
import Swal from "sweetalert2";

const options = [
  { value: "stream", label: "Stream" },
  { value: "forum", label: "Forum" },
  { value: "all", label: "All" },
  { value: "none", label: "None" },
];

export default function HcpTable({ user, hcpListTabSelected }) {
  // hcpDataList state
  const [hcpDataList, setHcpDataList] = useState(Array());

  // enableEdit state
  const [enableEdit, setEnableEdit] = useState(null);

  // loading HCP List state
  const [loadingHcpList, setLoadingHcpList] = useState(false);

  useEffect(() => {
    const getHcpCall = async () => {
      await getHcpList();
    };
    console.log("useEffect: ", hcpDataList);
    getHcpCall();
  }, []);

  // open swal modal
  const openModal = (text) => {
    return Swal.fire({
      title: "Are you sure?",
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    });
  };

  const getHcpList = async () => {
    try {
      setLoadingHcpList(true);
      setHcpDataList([]);
      const hcpList = await (
        await getDoc(doc(db, "admin", String(user.uid)))
      ).get("hcpList");
      console.log("getHcpList.HCPlIST: ", hcpList);
      let hcpArray = [];
      for (let i = 0; i < hcpList.length; i++) {
        if (hcpList[i] !== null && hcpList[i].length > 0) {
          const hcp = await getDoc(doc(db, "users", String(hcpList[i])));
          // if user is not found, remove from hcpList
          if (hcp && !hcp.exists()) {
            // remove the id from the array
            await updateDoc(doc(db, "admin", String(user.uid)), {
              hcpList: arrayRemove(hcpList[i]),
            });
          }
          // else add to hcpDataList
          else {
            const data = await hcp.data();
            data.hcpId = hcpList[i];
            hcpArray.push(data);
            // setHcpDataList((prev) => [...prev, data]);
          }
        } else {
          // remove the id from the array
          await updateDoc(doc(db, "admin", String(user.uid)), {
            hcpList: arrayRemove(hcpList[i]),
          });
        }
      }
      setHcpDataList(hcpArray);
      setLoadingHcpList(false);
    } catch (error) {
      console.warn(error);
      setLoadingHcpList(false);
    }
  };

  const removeHcpFromList = async (e, hcp) => {
    e.preventDefault();
    openModal("The user will be deleted from your list").then(
      async (result) => {
        if (result.value) {
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
        } else {
          return;
        }
      }
    );
  };

  const handlePermissionChange = async (e, hcp) => {
    if (hcp.permission.toLowerCase() !== e.value.toLowerCase()) {
      openModal("The user permissions will be updated").then(async (result) => {
        if (result.isConfirmed) {
          try {
            await updateDoc(doc(db, "users", String(hcp.hcpId)), {
              permission: e.value,
            });
            await getHcpList();
            setEnableEdit(null);
          } catch (error) {
            console.log("Admin table handlePermissionChange Error", error);
          }
        }
      });
    }
  };

  const toggleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (id !== enableEdit) {
      setEnableEdit(id);
    } else {
      setEnableEdit(null);
    }
  };

  return (
    <div>
      <div className="container table-container overflow-auto">
        <div className="org-table">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-xl">HCP List</h1>

            <div className="right-side flex flex-row items-center gap-x-5">
              <div className="reload-list h-full">
                <button className="reload-btn " onClick={getHcpList}>
                  <AiOutlineReload
                    className="reload-icon text-xl"
                    disabled={loadingHcpList}
                  />
                  {loadingHcpList ? "Loading" : "Reload"}
                </button>
              </div>
              {/* search input */}
              <input
                type="text"
                placeholder="Search"
                className="border-2 rounded-md p-2"
              />
            </div>
          </div>
          <table className="table-auto w-full">
            <thead className="table-header h-[50px] rounded-md">
              <tr>
                <th>Full Name</th>
                <th>Profession</th>
                <th>Specialty</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            {hcpDataList.length === 0 ? null : (
              <tbody>
                {hcpDataList.map((hcp, index) => (
                  <tr key={index} className="fade-enter">
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
                        {hcp.hcpSpecialty === "" || hcp.hcpSpecialty === null
                          ? "Not Specified"
                          : hcp.hcpSpecialty}
                      </span>
                    </td>
                    <td>
                      {/* permission select input */}
                      <Select
                        options={options}
                        isDisabled={enableEdit !== hcp.hcpId ? true : false}
                        value={{
                          value: hcp.permission,
                          label:
                            hcp.permission[0].toUpperCase() +
                            hcp.permission.slice(1),
                        }}
                        onChange={(e) => handlePermissionChange(e, hcp)}
                      />
                    </td>
                    <td>
                      <div className="actions flex justify-around text-2xl">
                        <div className="hover:cursor-pointer">
                          <AiOutlineEdit
                            className="hover:cursor-pointer"
                            onClick={(e) => toggleEdit(e, hcp.hcpId)}
                          />
                        </div>
                        <div className="hover:cursor-pointer">
                          <AiFillDelete
                            className="text-red-700"
                            onClick={(e) => removeHcpFromList(e, hcp)}
                          />
                        </div>
                        <div className="hover:cursor-pointer">
                          <FaRegShareSquare />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
