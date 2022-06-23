import { memo, useEffect, useState } from 'react';
import { Avatar } from "@mui/material";


function InfoSender({ firstName, lastName, chatMessages, currentUser }) {
    const [lastSeen, setLastSeen] = useState();
    useEffect(() => {
        for (var i = chatMessages.length - 1; i >= 0; i--) {

            if (chatMessages[i].senderEmail != currentUser.email) {
                const lastSeenTime = chatMessages[i].timestamp.toDate().toLocaleTimeString('en-US');
                console.log("last seen Time " + lastSeenTime);
                setLastSeen(lastSeenTime);
            }
        };
    }, [chatMessages, currentUser])

    const getUserInitials = () => {
        return (
          firstName.charAt(0) + lastName.charAt(0)
        ).toUpperCase();
    };

    return (
        <div>

            <div className="flex">
                <div className="w-1/6">
                        <Avatar
                        sx={{ width: "35px", height: "35px", bgcolor: "#9FC131" }}
                        >
                        {getUserInitials()}
                        </Avatar>
                    </div>
                <div>
                    <p className="text-md font-bold text-white">{firstName}</p>
                    <p className="text-sm text-gray-400">Last seen at {lastSeen}</p>

                </div>
            </div>
        </div>
    )
}
export default memo(InfoSender);