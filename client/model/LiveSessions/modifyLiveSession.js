import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export const modifyLiveSessionRecordingStatus = async (liveSessionRef) => {
  // Set the "capital" field of the city 'DC'
  console.log("Converting live session to a recording");
  await updateDoc(liveSessionRef, {
    isARecording: true,
  });
};
export const modifyLiveSessionLife = async (liveSessionRef) => {
  // Set the "capital" field of the city 'DC'
  console.log("Closing Live session");
  await updateDoc(liveSessionRef, {
    isOngoing: false,
    isScheduled: false,
  });
};
export const modifyLiveSessionTitleDescription = async (
  liveSessionID,
  title,
  description
) => {
  // Set the "title" and "description" field of the live session "id"
  console.log("Editing Live session title + description");
  if (liveSessionID == ""|| title == "" || description == "")  {
    throw Error("the live sesison ID is not given");
  } else {
    await updateDoc(doc(db, "liveSessions", liveSessionID), {
      title: title,
      description: description,
    });
  }
};

export const turnOffLiveSessionRecordingStatus = async (liveSessionID = "") => {
  console.log("Reseting isARecording status to false");
  if (liveSessionID == "") {
    throw Error("the live sesison ID is not given");
  } else {
    await updateDoc(doc(db, "liveSessions", liveSessionID), {
      isOngoing: false,
      isScheduled: false,
      isARecording: false,
      recordingURL: "",
    });
  }
};
