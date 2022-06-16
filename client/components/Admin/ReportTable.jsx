import { useState, useEffect } from "react";
import { AiOutlineEdit, AiFillDelete, AiOutlineReload } from "react-icons/ai";
import { FaRegShareSquare } from "react-icons/fa";
import Select from "react-select";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";

import "../../styles/Admin.module.scss";
import { db } from '@/firebase/clientApp';
import Swal from "sweetalert2";

const options = [
  { value: "stream", label: "Stream" },
  { value: "forum", label: "Forum" },
  { value: "all", label: "All" },
  { value: "none", label: "None" },
];

export default function ReportTable({ user }) {
  // reportList state
  const [reportList, setReportList] = useState(Array());

  // enableEdit state
  const [enableEdit, setEnableEdit] = useState(null);

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

  const getReportList = async () => {
    try {    
        setReportList([]);
        const reportsRef = collection(db, "reports");
        // console.log(`admin id: ${user.uid}\nreportsRef ${JSON.stringify(reportsRef)}`);
        const q = await query(reportsRef, where("reportedAccountOrg", "==", String(user.uid)));

        // const usersRef = collection(db,"users");
        // console.log(`queries: ${JSON.stringify(q)}`);
        const reportsSnap = await getDocs(q);
        
        let i = 0;
        const reportList = reportsSnap.docs.map((report) => ({ //array of reports for given admin (user.uid)
            ...report.data(),
            id: report.id,
          }));
        
        const reportedAccts = [];
        for (let i = 0; i < reportList.length; i++){
            const acc = await getDoc(doc(db, "users", String(reportList[i].reportedAccountId)));
            reportedAccts.push(acc.data());
        }
        console.log(`after forloop: ${JSON.stringify(reportedAccts)}`);
        i = 0;
        reportList.forEach(rep=>{
            rep.permission = reportedAccts[i].permission;
            rep.firstName = reportedAccts[i].firstName;
            rep.lastName = reportedAccts[i++].lastName;
        })

        console.log(`after all operations, displaying reports of org inside reportList.map:`)
        reportList.map((report)=>{
            console.log(report);
        });

        setReportList(reportList);
    } catch (error) {
      console.warn(error);
    }
  };

  const removeHcpFromList = async (e, report) => {
    e.preventDefault();
    console.log(`removing report ${report.id} from ${report.reportedAccountId} -- hcps; orgId ${user.uid}`)
    openModal("The selected report will be unavailable once deleted from your list").then(
      async (result) => {
        if (result.value) {
          try {
            await deleteDoc(doc(db, "reports", report.id));
            await getReportList();
            setReqLoading(false);
          } catch (error) {
            console.log("Admin table remove report Error", error);
          }
        } else {
          return;
        }
      }
    );
  };

  const handlePermissionChange = async (e, report) => {
    console.log(`updating permissions`);
    const hcp = await getDoc(doc(db, "users", String(report.reportedAccountId)));
    hcp = hcp.data();
    // console.log(`after querying hcp: ${JSON.stringify(hcp.permission.toLowerCase())} && e.value: ${e.value.toLowerCase()}`)
    if (hcp.permission.toLowerCase() !== e.value.toLowerCase()) {
      openModal("The user permissions will be updated").then(async (result) => {
        if (result.isConfirmed) {
          try {
            console.log(`in updateDoc permissions`)
            await updateDoc(doc(db, "users", String(report.reportedAccountId)), {
              permission: e.value,
            });
            await getReportList();
            setEnableEdit(null);
          } catch (error) {
            console.log("Admin table handlePermissionChange Error", error);
          }
        }
      });
    }
  };

  useEffect(() => {
    const getReports = async () => {
      await getReportList();
    };

    return () => getReports();
  }, []);

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
    <>
      <div className="container table-container overflow-auto">
        <div className="org-table">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-xl">HCP List</h1>

            <div className="right-side flex flex-row items-center gap-x-5">
              <div className="reload-list h-full">
                <button className="reload-btn " onClick={getReportList}>
                  <AiOutlineReload className="reload-icon text-xl" />
                  Reload
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
            <thead className="table-header">
              <tr>
                <th>Reported HCP</th>
                <th>Report Issue</th>
                <th>Report Details</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportList.length === 0
                ? null
                : reportList.map((report, index) => (/*hcp, index*/
                    <tr key={index} className="fade-enter">
                      <td>
                        <span>
                          {report.firstName} {report.lastName}
                          {/* {report.reportedAccountId} */}
                        </span>
                      </td>
                      <td>
                        <span>{report.reportReason}</span>
                      </td>
                      <td>
                        <span>
                          {report.reportDetails === "" || report.reportDetails === null
                            ? "Not Specified"
                            : report.reportDetails}
                        </span>
                      </td>
                      <td>
                        {/* permission select input */}
                        <Select
                          options={options}
                          isDisabled={enableEdit !== report.reportedAccountId ? true : false}
                          value={{
                            value: report.permission,// options[2],
                            label: report.permission[0].toUpperCase() + report.permission.slice(1),
                          }}
                          onChange={(e) => handlePermissionChange(e, report)}
                        />
                      </td>
                      <td>
                        <div className="actions flex justify-around text-2xl">
                          <div className="hover:cursor-pointer">
                            <AiOutlineEdit
                              className="hover:cursor-pointer"
                              onClick={(e) => toggleEdit(e, report.reportedAccountId)}
                            />
                          </div>
                          <div className="hover:cursor-pointer">
                            <AiFillDelete
                              className="text-red-700"
                              onClick={(e) => removeHcpFromList(e, report)}
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
          </table>
        </div>
      </div>
    </>
  );
}
