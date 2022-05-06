import React, { useState, useRef } from "react";
import Router from "next/router";
import { v4 as uuidv4 } from "uuid";

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
// import { auth, db } from "../firebase/clientApp";
import { auth, db } from "../../firebase/clientApp";

import page from "../404";

page.getInitialProps = async ({ res }) => {
  const uuid = uuidv4();
  if (res) {
    res.writeHead(302, {
      Location: `/playground/${uuid}`,
    });
    res.end();
    return {};
  }
  // playground collection
  const playgroundRoomsRef = collection(db, "playgroundRooms");

  // get the user ID
  const { uid } = auth.currentUser;

  // Add a new document with a generated id.
  const docRef = await addDoc(playgroundRoomsRef, {
    createdBy: uid,
    uuid,
    createdAt: serverTimestamp(),
  });
  console.log(`New Room created: ${docRef}`);
  Router.push(`/playground/${uuid}`);
  return {};
};

export default page;
