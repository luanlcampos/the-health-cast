import React, { useState, useRef, useContext, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import {GrEmoji} from 'react-icons/gr';
import dynamic from "next/dynamic";
import {db} from '../../firebase/clientApp';
import { collection, doc, Timestamp, setDoc,getDoc, addDoc, onSnapshot,  getDocs, query, orderBy } from "firebase/firestore";

import ChatMessage from "./ChatMessage";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ChatWrapper({currentUser, selectedProfile}){
    const [openEmojiBox, setOpenEmojiBox] = useState(false);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const chatBox = useRef(null);
    const [isPush, setIsPush] = useState(false);

    let count = 0;
    useEffect(()=>{
        if(selectedProfile.email!=null){

            const q = query(collection(db, "chats"));
            

            const getMessages = async () => { 
                const subColRef = collection(db, "chats", selectedProfile.email, "messages");
                const q = query(subColRef, orderBy("timestamp", "asc")); 
                onSnapshot(q, (snapshot)=>{
                    let messages = []
                    snapshot.docs.forEach(doc=>{
                        messages.push(doc.data());
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
        // collection(db, "chats") loading multiple times
        console.log(count++)
    }, [selectedProfile])

    useEffect(() => {
        
        console.log("new messages firebase");
        chatBox.current.addEventListener("DOMNodeInserted", (event) => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: "smooth" });
        });
        // if(selectedProfile.email!=null){
        //     const subColRef = collection(db, "chats", currentUser.email, "messages");
        //     const q = query(subColRef, orderBy("timestamp", "asc")); 
        //     onSnapshot(q, (snapshot) => {
        //         console.log("snapshot changes");
        //         snapshot.docChanges().forEach((change) => {
        //         if (change.type === "added") {
        //             console.log("New city added: ", change.doc.data());
        //             console.log(chatMessages.length + " before");
        //             chatMessages.push(change.doc.data());
        //             console.log(chatMessages.length + "after");
        //         }
        //         if (change.type === "modified") {
        //             console.log("Modified city: ", change.doc.data());
        //         }
        //         if (change.type === "removed") {
        //             console.log("Removed city: ", change.doc.data());
        //         }
        //         });
        //     });
        // }

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