import React, { useState, useRef, useContext, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import {GrEmoji} from 'react-icons/gr';
import dynamic from "next/dynamic";
import { Timestamp } from "firebase/firestore";
import {db} from '../../firebase/clientApp';
import { collection, doc, setDoc, addDoc,  getDocs, query, orderBy } from "firebase/firestore";

import ChatMessage from "./ChatMessage";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ChatWrapper({currentUser, selectedProfile}){
    const [openEmojiBox, setOpenEmojiBox] = useState(false);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const chatBox = useRef(null);

    useEffect(()=>{
        if(selectedProfile.email!=null){
            const getMessages = async () => { 
                const subColRef = collection(db, "chats", selectedProfile.email, "messages");
                const q = query(subColRef, orderBy("timestamp", "asc")); 
                const qSnap = getDocs(q);
                qSnap.then(q=>{
                     setChatMessages(q.docs.map(d=>({id:d.id, ...d.data()})));
                 })
    
            };
            getMessages();
        }

    }, [selectedProfile])

    useEffect(() => {
        console.log("new messages");
        chatBox.current.addEventListener("DOMNodeInserted", (event) => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: "smooth" });
        });
      }, [chatMessages]);

    const sendMessage = (e) =>{
        e.preventDefault();
        if(currentUser){
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

            const senderFriendlistRef = doc(db, "friendlist", currentUser.email)
            const senderListRef = collection(senderFriendlistRef, "list");
            addDoc(senderListRef, payload);

            // recipient
            const recipientDocRef = doc(db, "chats", selectedProfile.email);
            const recipientMessageRef = collection(recipientDocRef, "messages");
            addDoc(recipientMessageRef, payload);

            const recipientFriendlistRef = doc(db, "friendlist", selectedProfile.email)
            const recipientListRef = collection(recipientFriendlistRef, "list");
            addDoc(recipientListRef, payload);
            chatMessages.push(payload);
            setMessage("");
        }
    }

    return (
        <>
            <main id="messageWrapper" className="w-full bg-whatsapp flex-col">
                <div id="messageheader" className="main-header z-40 text-gray-400">
                    <div className="flex items-center px-4 py-3">
                        <div className="flex-1">
                            <div className="flex">
                                <div className="mr-4">
                                    <img className="w-11 h-11 rounded-full"
                                         src="https://images.generated.photos/TF1poQJzPyLbQsqitETSQBeDzgY7vEsSLPl4UVbgZTM/rs:fit:512:512/wm:0.95:sowe:18:18:0.33/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzA3MzMwMzAuanBn.jpg"/>
                                </div>
                                <div>
                                    <p className="text-md font-bold text-white">{selectedProfile?.firstName ||''}</p>
                                    <p className="text-sm text-gray-400">last seen today at 14:46</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id = "messageBody"className="bg-slate-900 block px-4 py-3 chat-wrapper"  ref={chatBox}>
                    {
                        chatMessages.map(({text,timestamp, senderEmail})=>
                        (
                            <ChatMessage message = {text} time={timestamp} senderEmail = {senderEmail} currentUserEmail = {currentUser.email}/>
                        ))
                    }
                    {/* <div className="flex justify-end">
                        <div
                            className="single-message rounded-tl-lg rounded-bl-lg text-gray-200 rounded-br-lg user mb-4 px-4 py-2">Hey!
                            Thought I'd reach out to say how are you? 😊
                        </div>
                        <span><svg className="user-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13"
                                   width="8" height="13"><path opacity=".13"
                                                               d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path
                            fill="currentColor"
                            d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg></span>
                    </div> */}

                </div>
                <div className="main-footer text-gray-400">
                            {/* buttons */}
                    {openEmojiBox && (
                    <Picker
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