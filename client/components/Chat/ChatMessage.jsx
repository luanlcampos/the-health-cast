import {db} from '../../firebase/clientApp';
import { collection, doc,where, query, limit, useFirestoreQuery, getDocs, deleteDoc, documentId } from "firebase/firestore";


export default function ChatMessage({message,id, time, senderEmail, currentUserEmail, recipientEmail}){
    const newDate = time.toDate().toLocaleTimeString('en-US')
    let messageHTML = "";
    let targetModal;
    console.log(recipientEmail)
    function updateMessage(event, message){

        let parentE = event.target.parentNode.parentNode;
        let childNodes = parentE.childNodes;
        for(var i = 0; i < childNodes.length; i++){
            if(childNodes[i].matches('.custom-modal')==true){
                targetModal = childNodes[i];
                targetModal.style.display = 'block'
            }

        }
    }

    function deleteAMessage(event, deletedId, message){
        console.log(deletedId)
        console.log(message)
        // sender
        console.log(recipientEmail);
        const senderDocRef = doc(db, "chats", recipientEmail,"messages",deletedId);

        // const senderMessageRef = collection(senderDocRef, "messages");
        // const q = query(senderMessageRef, 
        //     where(documentId(), "==", "124EN6VYSQLkYnQVbPjN"));
        deleteDoc(senderDocRef)

        //const querySnapshot =  getDocs(q);

        // recipient
        const recipientDocRef = doc(db, "chats", senderEmail);
        const recipientMessageRef = collection(recipientDocRef, "messages");
        
    }


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
                <div class='custom-modal bg-white p-2 rounded-md hidden'>
                    <div class='hover:bg-slate-300 cursor-pointer p-2 rounded-md'   onClick={(event) => {
            deleteAMessage(event, id, message);
          }}> Delete</div>
                    <div class='hover:bg-slate-300 cursor-pointer p-2 rounded-md'>Modify</div>
                </div>
                <div id="vertical-dot" class='cursor-pointer'>
            
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-three-dots-vertical" viewBox="0 0 16 16"   onClick={(event) => {
            updateMessage(event, message);
          }}>
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    </svg>
                </div>

                <div 
                    className="single-message rounded-tl-lg rounded-bl-lg text-gray-200 rounded-br-lg user mb-4 px-4 py-2 h-fit">
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