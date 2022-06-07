import React from "react";


export default function UserProfile({profile, handleSetUserProfile, photoURL}){
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
                        <div className="text-sm truncate">Hello World! It's been a pleasure to meet you!
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta, ullam.
                        </div>
                    </div>
                    <span className="absolute right-0 top-0 text-xs mt-1">13:00</span>
                </div>
            </div>

    )
}