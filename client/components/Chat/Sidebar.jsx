import UserProfile from "./UserProfile";
import {db} from '../../firebase/clientApp';
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import {
    AiOutlineSearch
  } from "react-icons/ai";

  import { UserChat } from "@/model/UserChat";
import { Avatar } from "@mui/material";
import { useAuth } from "../../firebase/auth";

export default function Sidebar({currentUserFName, currentUserEmail, handleSetAllUsers, handleSetUserProfile, handleSetSelectedUser}){
    const [allUsers, setAllUsers] = useState([]);    
    const [searchInput, setSearchInput] = useState("");
    const [firstUserSidebar, setFirstUserSidebar] = useState();
    const { user } = useAuth();

    const getUserInitials = () => {
      return (
        currentUserFName.charAt(0) + currentUserEmail.charAt(0)
      ).toUpperCase();
    };

    const handleSetFirstUserSidebar = (profile)=>{
      setFirstUserSidebar(profile);
    }


    useEffect(() => {
        const getAllUsers = async () => {   
          const userRef = collection(db, "users");
          const userSnapshot = await getDocs(userRef);
          const data = userSnapshot.docs.map((givenUser) => ({
            ...givenUser.data(),
            id: givenUser.id,
          }));
    
          const followers = data.filter((u) => u.id === user.uid)[0].followers;
          const followings = data.filter((u) => u.id === user.uid)[0].following;
    
          const chatUserIds = filterFollowersFollowings(followers, followings);
          const chatUsers = data.filter(function (d) {
            let chatUser = chatUserIds.filter((id) => d.id === id)[0];
            return chatUser != null;
          });
    
          allUsers = chatUsers.map((d) => {
            const payload = {
              recipientEmail: "",
              senderEmail: "",
              text: "",
            };
            d.lastMessage = payload;
            const userData = new UserChat(d);
            const subColRef = collection(db, "chats", userData.email, "messages");
            const q = query(subColRef, orderBy("timestamp", "desc"), limit(1));
            onSnapshot(q, (snapshot) => {
              if (snapshot.docs.length > 0) {
                userData.lastMessage = snapshot.docs[0].data();
              }
            });
            return userData;
          });

            // await getDocs(collection(db, "users")).then(querySnapshot=>{
            //   allUsers =  querySnapshot.docs.map((d)=>{
            //     return d.data();
            //   });  

              allUsers = rearrangeArray(allUsers, firstUserSidebar);
              setAllUsers(allUsers);
              handleSetAllUsers(allUsers);
              return null;;

        };
        getAllUsers();
      }, [firstUserSidebar]);

      const searchedUser = allUsers.filter((user) => {
        if (searchInput) {
          if (
            user.firstName.toLowerCase().includes(searchInput.toLowerCase())
          ) {
            return user;
          }
        }
      });
    
      const rearrangeArray = (users, selectedUser) => {
        if(selectedUser!=null && users.length > 0){
          let firstE = Object.assign({}, users[0]);
          var i = 0;
          for(; i < users.length; i++){
            if(users[i].email == selectedUser.profile.email){
              break;
            }
          }
          users[i] = firstE;
          users[0] = selectedUser.profile;
        }

        return users;
      }

      const filterFollowersFollowings = (followers, followings) => {
        if (followers == null && followings == null) return [];
        if (followers == null && followings != null) return followings;
        if (followers != null && followings == null) return followers;
        return followers.filter(function (obj) {
          return followings.indexOf(obj) == -1;
        });
      };

      
      const searchItem = searchedUser.map((subscriber) => {
        return (
          <UserProfile
            key = {subscriber.email}
            profile={subscriber}
            handleSetSelectedUser = {handleSetSelectedUser}
            handleSetFirstUserSidebar = {handleSetFirstUserSidebar}
          />
        );
      });


    return(
        <>
            <aside className="overflow-y-auto border-r border-gray-800 relative block bg-slate-900">
                <div className="aside-header sticky top-0 right-0 left-0 z-40 text-gray-400">
                <div className="flex items-center px-4 py-3">
                  <div className="w-1/6">
                    <Avatar
                    sx={{ width: "35px", height: "35px", bgcolor: "#9FC131" }}
                    >
                    {getUserInitials()}
                    </Avatar>
                  </div>
                  <p className="ml-1 text-white">{currentUserFName}</p>
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
                                handleSetSelectedUser={handleSetSelectedUser}
                                lastMessage = {subscriber.lastMessage?.text}
                                handleSetFirstUserSidebar = {handleSetFirstUserSidebar}
                                />                            
                        ))
                    }
                </div>
            </aside>
        </>
    )
}