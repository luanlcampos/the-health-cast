import UserProfile from "./UserProfile";
import {db} from '../../firebase/clientApp';
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
    AiOutlineSearch
  } from "react-icons/ai";

export default function Sidebar({currentUserFName, currentUserEmail, handleSetAllUsers, handleSetUserProfile}){
    const [allUsers, setAllUsers] = useState([]);    
    const [searchInput, setSearchInput] = useState("");

    
    useEffect(() => {
        const getAllUsers = async () => {          
            await getDocs(collection(db, "users")).then(querySnapshot=>{
              allUsers =  querySnapshot.docs.map((d)=>{
                return d.data();
              });  

              const filtered = allUsers.filter((d)=>d.email!==currentUserEmail);
              setAllUsers(filtered);
              handleSetAllUsers(filtered);
              return null;});

        };
        getAllUsers();
      }, []);

      const searchedUser = allUsers.filter((user) => {
        if (searchInput) {
          if (
            user.firstName.toLowerCase().includes(searchInput.toLowerCase())
          ) {
            return user;
          }
        }
      });
    
      const searchItem = searchedUser.map((subscriber) => {
        return (
          <UserProfile
            key = {subscriber.email}
            profile={subscriber}
            photoURL="https://t4.ftcdn.net/jpg/03/49/49/79/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg"
          />
        );
      });


    return(
        <>
            <aside className="overflow-y-auto border-r border-gray-800 relative block bg-slate-900">
                <div className="aside-header sticky top-0 right-0 left-0 z-40 text-gray-400">
                    <div className="flex items-center px-4 py-3">
                        <div className="flex">
                            <img className="w-11 h-11 rounded-full"
                                 src="https://www.writersdigest.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTcxMDY5MzE5OTYyMzcyMDgx/image-placeholder-title.jpg"/>
                        </div>
                        <p className="ml-3">{currentUserFName}</p>
                        
                    </div>
                    <div className="search-bar px-4 py-2 w-full">
                        <form method="GET">
                            <div className="relative text-gray-600 focus-within:text-gray-200">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                        <button type="submit" className="text-xl p-1 focus:outline-none focus:shadow-outline">
                                            <AiOutlineSearch/>
                                        </button>
                                    </span>
                                <input type="search" name="q"
                                       className="w-full py-2 text-sm text-white bg-gray-600 rounded-full pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
                                       placeholder="Search or start new chat" 
                                       value={searchInput}
                                       onChange={(e) => {
                                           setSearchInput(e.target.value);
                                       }}
                                       autoComplete="off"/>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="aside-messages">
                    {
                        searchItem.length > 0 ? searchItem : allUsers.map((subscriber) => (
                                <UserProfile
                                key = {subscriber.id}
                                profile = {subscriber}
                                handleSetUserProfile={handleSetUserProfile}
                                />                            
                        ))
                    }
                </div>
            </aside>
        </>
    )
}