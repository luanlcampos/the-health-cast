import { memo, useEffect, useState } from 'react';

function InfoSender({ firstName, chatMessages, currentUser }) {
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
    return (
        <div>

            <div className="flex">
                <div className="mr-4">
                    <img className="w-11 h-11 rounded-full"
                        src="https://images.generated.photos/TF1poQJzPyLbQsqitETSQBeDzgY7vEsSLPl4UVbgZTM/rs:fit:512:512/wm:0.95:sowe:18:18:0.33/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzA3MzMwMzAuanBn.jpg" />
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