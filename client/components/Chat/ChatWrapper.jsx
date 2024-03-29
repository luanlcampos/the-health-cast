import React, { useState, useRef, useContext, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import {GrEmoji} from 'react-icons/gr';
import dynamic from "next/dynamic";
import {db} from '../../firebase/clientApp';
import { collection, doc, Timestamp, updateDoc,where, addDoc, onSnapshot,  getDocs, query, orderBy } from "firebase/firestore";
import InfoSender from './InfoSender';
import ChatMessage from "./ChatMessage";
import { setUserId } from 'firebase/analytics';

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ChatWrapper({currentUser, selectedProfile}){
    const [openEmojiBox, setOpenEmojiBox] = useState(false);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [recipientEmail, setRecipientEmail] = useState();
    const [currentUserEmail, setCurrentUserEmail] = useState();
    const [oldMessage, setOldMessage] = useState();
    const [id, setMessageID] = useState();
    const [timestamp, setTimeStamp] = useState();
    const chatBox = useRef(null);
    const [isModifying, setModifying] = useState();


    
    const emojiPicker = useRef(handleClick);
    const handleClick = (event) =>{
        let emojiPicker = document.querySelector('.emoji-picker-react');
        let customModal = document.getElementsByClassName("custom-modal");
        
        if(!event.target.matches('path')&& !event.target.matches('svg') ){
            for(var i = 0; i < customModal.length; i++){
                customModal[i].style.display = "none"
            }
        }
        if(emojiPicker!=null){
            document.querySelector('.emoji-picker-react').style.display = 'none';
        }

    }

    const handleModifiedMessage = (time, id, message, recipientEmail, currentUserEmail)=>{
        setModifying(true);
        setRecipientEmail(recipientEmail);
        setCurrentUserEmail(currentUserEmail);
        setMessageID(id);
        setMessage(message);
        setTimeStamp(time);
        setOldMessage(message);
      }

    useEffect(()=>{
        if(selectedProfile?.email!=null){
            const q = query(collection(db, "chats"));
            const getMessages = async () => { 
                const subColRef = collection(db, "chats", selectedProfile.email, "messages");
                const q = query(subColRef, orderBy("timestamp", "asc")); 
                onSnapshot(q, (snapshot)=>{
                    let messages = []
                    
                    snapshot.docs.forEach(doc=>{
                        if(doc.data().senderEmail != selectedProfile.email && doc.data().senderEmail != currentUser.email){

                        }else{
                            let aMessage = Object.assign(doc.data(), {id:doc.id});
                            messages.push(aMessage);
                        }          
          
                        return messages;
                    })

                    setChatMessages(messages);
                })
                // const qSnap = getDocs(q);
                // qSnap.then(q=>{
                //      setChatMessages(q.docs.map(d=>({id:d.id, ...d.data()})));
                //  })
            };
            getMessages();
        }

    }, [selectedProfile])

    useEffect(() => {
        chatBox.current.addEventListener("DOMNodeInserted", (event) => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: "smooth" });
        });

      }, [chatMessages]);

      useEffect(()=>{
        console.log(selectedProfile);
      }, [selectedProfile])

    const sendMessage = (e) =>{
        e.preventDefault();
        if(!isModifying && currentUser && message!=""){
            let payload = {
                text: message,
                senderEmail: currentUser.email,
                recipientEmail: selectedProfile.email,
                timestamp: Timestamp.now()
            }
            // sender
            const senderDocRef = doc(db, "chats", currentUser.email);
            const senderMessageRef = collection(senderDocRef, "messages");
            addDoc(senderMessageRef, payload);

            // recipient
            const recipientDocRef = doc(db, "chats", selectedProfile.email);
            const recipientMessageRef = collection(recipientDocRef, "messages");
            addDoc(recipientMessageRef, payload);

            chatMessages.push(payload);

        }
        if(isModifying){
            const senderDocRef = doc(db, "chats", recipientEmail,"messages",id);
            updateDoc(senderDocRef, {text: message});
            setModifying(false);

            // recipient
            const recipientDocRef = doc(db, "chats", currentUserEmail);
            const recipientMessageRef = collection(recipientDocRef, "messages");
            const qSnap = query(recipientMessageRef, where("text","==",oldMessage), where("timestamp","==", timestamp))
            const querySnapshot = getDocs(qSnap);
            let deletedRecipientId;
            querySnapshot.then(q=>{
                if(q.docs[0]!=undefined){
                    deletedRecipientId = q.docs[0].id;
                    const recipientDocRef = doc(db, "chats", currentUserEmail,"messages",deletedRecipientId);
                    updateDoc(recipientDocRef, {
                        text:message
                    })
                }
            })


        }
        setMessage("");

    }

    return (
        <>
            <main id="messageWrapper" className="w-full bg-whatsapp flex-col">
                <div id="messageheader" className="main-header z-40 text-gray-400">
                    <div className="flex items-center px-4 py-3 chatheader">
                        <div className="flex-1">
                            <InfoSender firstName={selectedProfile?.firstName || ''} lastName={selectedProfile?.lastName || ''} chatMessages={chatMessages} currentUser={currentUser} />
                        </div>
                    </div>
                </div>
                <div id = "messageBody"className="bg-slate-900 block px-4 py-3 chat-wrapper"  ref={chatBox}  onClick ={handleClick}>
                    {
                        chatMessages.map(({text,id, timestamp, senderEmail, recipientEmail})=>
                        (
                            <ChatMessage 
                                message = {text} 
                                id = {id} 
                                time={timestamp} 
                                senderEmail = {senderEmail} 
                                currentUserEmail = {currentUser.email} 
                                recipientEmail = {recipientEmail}
                                handleModifiedMessage = {handleModifiedMessage}
                            />
                        ))
                    }


                </div>
                <div className="main-footer text-gray-400">
                            {/* buttons */}
                    {openEmojiBox && (
                    <Picker
                    ref = {emojiPicker}
                    onEmojiClick={(event, emojiObject) =>
                        setMessage(message + emojiObject.emoji)
                    }
                />
                    )}
                    <div className="flex items-center px-4 py-1">
                        <div className="flex-none text-2xl" onClick={() => setOpenEmojiBox(!openEmojiBox)}>
                            <GrEmoji/>
                        </div>
                        <div className="flex-grow">
                            <div className="px-4 py-2 w-full">
                                <form onSubmit = {sendMessage}>
                                    <div className="relative text-gray-600 focus-within:text-gray-200">
                                        <input type="text"
                                                value = {message}
                                               className="message-input w-full py-2 text-base text-white bg-gray-700 rounded-full pl-5 focus:outline-none focus:bg-white focus:text-gray-900"
                                               placeholder="Type a message" autoComplete="off"
                                               onChange = {(e)=>{setMessage(e.target.value)}}/>
                                    </div>
                                </form>
                                
                            </div>
                        </div>
                        <div className="flex-none text-right text-2xl" onClick = {sendMessage}>
                            <FiSend/>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
