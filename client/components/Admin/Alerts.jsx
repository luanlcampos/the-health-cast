import { AiFillDelete } from "react-icons/ai";
import { BsFlag } from "react-icons/bs";
import { FaRegShareSquare } from "react-icons/fa";
import "../../styles/Admin.module.scss";

export default function Alerts() {
  return (
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
  );
}
