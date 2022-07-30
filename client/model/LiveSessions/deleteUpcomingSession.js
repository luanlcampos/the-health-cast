import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export const deleteUpcomingSession = async (givenLiveSessionID) => {
  console.log("The passed in ID to delete is: ", givenLiveSessionID);
  if (givenLiveSessionID == "") throw Error("No live session ID given");

  /*const docRef = doc(db, "cities", "SF");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }*/
  try {
    await deleteDoc(doc(db, "liveSessions", givenLiveSessionID));
  } catch (e) {
    throw Error("Unable to delete upcoming live session", e);
  }
};
