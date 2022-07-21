import { doc, getDoc, updateDoc } from "firebase/firestore";

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
