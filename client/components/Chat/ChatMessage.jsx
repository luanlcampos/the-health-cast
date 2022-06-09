export default function ChatMessage({message, time, senderEmail, currentUserEmail}){
    const newDate = time.toDate().toLocaleTimeString('en-US')
    let messageHTML = "";

    if(senderEmail!=currentUserEmail){
        messageHTML = 
        <>
                    <span>
                    <svg className="incoming-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13">
                        <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
                        <path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path>
                    </svg>
                </span>

                    <div className="single-message rounded-tr-lg text-gray-200 rounded-bl-lg rounded-br-lg mb-4 px-4 py-2">
                        <p>
                        {message}
                        </p>
                        <div className="chat-message-date">
                            <p className="text-right text-sm">{newDate}</p>
                        </div>
                    </div>
            
        </>
    }
    else{
        messageHTML = 
        <>
            <div className="flex justify-end">
                <div 
                    className="single-message rounded-tl-lg rounded-bl-lg text-gray-200 rounded-br-lg user mb-4 px-4 py-2">
                    {message}
                </div>
                <span>
                    <svg 
                        className="user-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13">
                            <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
                            <path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path>
                            
                    </svg>
                </span>
            </div> 
        </>

    }
    return (
        <>
        <div className={senderEmail!=currentUserEmail ? "flex": "flex justify-end"}>
            {messageHTML}
        </div>

        </>
    )
}