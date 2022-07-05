import React, { useState, useRef, useContext, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import {GrEmoji} from 'react-icons/gr';
import dynamic from "next/dynamic";
import {db} from '../../firebase/clientApp';
import { collection, doc, Timestamp, setDoc,getDoc, addDoc, onSnapshot,  getDocs, query, orderBy } from "firebase/firestore";
import InfoSender from './InfoSender';
import ChatMessage from "./ChatMessage";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ChatWrapper({currentUser, selectedProfile}){
    const [openEmojiBox, setOpenEmojiBox] = useState(false);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const chatBox = useRef(null);


    let count = 0;

    const emojiPicker = useRef(handleClick);
    const handleClick = (event) =>{
        document.querySelector('.emoji-picker-react').style.display = 'none';
    }

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

    }, [selectedProfile])

    useEffect(() => {
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

            // recipient
            const recipientDocRef = doc(db, "chats", selectedProfile.email);
            const recipientMessageRef = collection(recipientDocRef, "messages");
            addDoc(recipientMessageRef, payload);

            chatMessages.push(payload);
            setMessage("");
        }
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