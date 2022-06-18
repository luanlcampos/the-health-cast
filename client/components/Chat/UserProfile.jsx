import React,{memo} from "react";
import { Avatar } from "@mui/material";


function UserProfile({profile, lastMessage, handleSetSelectedUser, photoURL}){
    const getUserInitials = () => {
          return (
            profile.firstName.charAt(0) + profile.lastName.charAt(0)
          ).toUpperCase();
      };
    return(
            <div className="message text-gray-300 px-4 py-3 cursor-pointer" 
                onClick={()=> {
                    handleSetSelectedUser({profile});
                    }}>
                <div className="flex items-center relative">
                    <div className="w-1/6">
                        <Avatar
                        sx={{ width: "27px", height: "27px", bgcolor: "#9FC131" }}
                        >
                        {getUserInitials()}
                        </Avatar>
                    </div>
                    <div className="w-5/6">
                        <div className="text-xl text-white">{profile.firstName}</div>
                        <div className="text-sm truncate">{lastMessage}</div>
                    </div>
                </div>
            </div>

    )
}
export default memo(UserProfile)