import React,{memo} from "react";


function UserProfile({profile, handleSetUserProfile, photoURL}){
    console.log("Profile",profile)
    return(
            <div className="message text-gray-300 px-4 py-3 cursor-pointer" 
                onClick={()=> {
                    handleSetUserProfile({profile});
                    }}>
                <div className="flex items-center relative">
                    <div className="w-1/6">
                        <img className="w-11 h-11 rounded-full"
                             src={photoURL}/>
                    </div>
                    <div className="w-5/6">
                        <div className="text-xl text-white">{profile.firstName}</div>
                        <div className="text-sm truncate">{profile?.lastMessage?.text}</div>
                    </div>
                    <span className="absolute right-0 top-0 text-xs mt-1">13:00</span>
                </div>
            </div>

    )
}
export default memo(UserProfile)