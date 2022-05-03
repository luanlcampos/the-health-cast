import Header from "../components/Header";
import { useAuth } from "../firebase/auth";
import { useRouter } from "next/router";
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";
import { FaRegShareSquare } from "react-icons/fa";
import Select from "react-select";

import "../styles/Admin.module.scss";

const options = [
  { value: "stream", label: "Stream" },
  { value: "forum", label: "Forum" },
  { value: "all", label: "All" },
];

function Admin() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();

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
              <div className="alerts active">
                <h1>Alerts</h1>
              </div>
              <div className="requests">
                <h1>Requests</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container table-container">
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
                <tr>
                  <td>
                    <span>Username</span>
                  </td>
                  <td>
                    <span>Profession</span>
                  </td>
                  <td>
                    <span>Specialty</span>
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
                      <AiFillDelete className="text-red" />
                    </span>
                    <span>
                      <FaRegShareSquare />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
