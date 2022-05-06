import React, { useState, useRef } from "react";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../../firebase/clientApp";
import styles from "../../../styles/LiveSessionChatRoom.module.scss";

export default function LiveSessionChatRoom({ room }) {
  const dummy = useRef();
  const messagesRef = collection(
    db,
    "playgroundRooms",
    `${room}`,
    "playgroudMessages"
  );

  const givenQuery = query(messagesRef, orderBy("createdAt"), limit(25));

  const [messages] = useCollectionData(givenQuery, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    // Add a new document with a generated id.
    const docRef = await addDoc(messagesRef, {
      text: formValue,
      uid,
      createdAt: serverTimestamp(),
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id={styles.mainMessagesContainer} className="">
      <h1>This is the room you reside in: {room}</h1>
      {/* Live Now */}
      {/* const docRef = doc(db, 'users', data.uid); */}
      <div id={styles.mainMessages} className="">
        {messages &&
          messages.map((msg) => <ChatMessage key={`${msg.id}`} message={msg} />)}

        <span ref={dummy}></span>
      </div>
      <form
        onSubmit={sendMessage}
        id={styles.formSendMessage}
        className="fixed bottom-0 bg-gray-900 w-full flex text-2xl"
      >
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
          className="leading-normal w-full text-2xl bg-gray-800 text-white pt-0 pb-0 pl-2 pr-2"
          id={styles.inputSendMessage}
        />

        <button
          id={styles.btnSendMessage}
          className="w-1/5 bg-indigo-800"
          type="submit"
          disabled={!formValue}
        >
          🕊️
        </button>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid } = props.message;
  return (
    <>
      <div
        className={`${styles.message} ${
          uid === auth.currentUser.uid ? styles.sent : styles.received
        }`}
      >
        <p id={styles.textContent}>{text}</p>
      </div>
    </>
  );
}
