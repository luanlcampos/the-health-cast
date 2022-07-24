import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "@/firebase/clientApp";

import { doc, getDoc, updateDoc } from "firebase/firestore";

export const saveToFirestore = async (
  url,
  liveSessionRoomID,
  videoRecordingStatus,
  audioRecordingStatus,
  shareScreenRecordingStatus
) => {
  if (!url) {
    console.log("Going to return nothing");
    return;
  }

  const storage = getStorage();
  let storageRef;
  let videoFile;
  let audioFile;
  let shareScreenFile;

  let metaData;

  console.log("url is:", url);
  var matches = url.match(/\bhttps?:\/\/\S+/gi);
  console.log("url2 is: ", matches);
  let givenBlob = await fetch(url).then((r) => r.blob());
  var date = new Date();
  console.log("file_name is:", url, "b64 is: ", givenBlob);

  try {
    if (videoRecordingStatus) {
      storageRef = ref(
        storage,
        `recordings/${liveSessionRoomID}/${liveSessionRoomID}.mp4`
      );
      videoFile = new File([givenBlob], `${liveSessionRoomID}.mp4`, {
        type: "video/mp4",
      });
      metaData = { contentType: "video/mp4" };
    } else if (audioRecordingStatus) {
      storageRef = ref(
        storage,
        `recordings/${liveSessionRoomID}/${liveSessionRoomID}.wav`
      );
      audioFile = new File([givenBlob], `${liveSessionRoomID}.wav`, {
        type: "audio/wav",
      });
      metaData = { contentType: "audio/wav" };
    } else if (shareScreenRecordingStatus) {
      storageRef = ref(
        storage,
        `recordings/${liveSessionRoomID}/${liveSessionRoomID}.webm`
      );
      shareScreenFile = new File([givenBlob], `${liveSessionRoomID}.webm`, {
        type: "video/webm",
      });
      metaData = { contentType: "video/webm" };
    }

    // Upload the file and metadata
    const uploadTask = uploadBytesResumable(storageRef, givenBlob, metaData);
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);
            return downloadURL;
          })
          .then((givenURL) => {
            const liveSessionRef = doc(
              db,
              "liveSessions",
              `${liveSessionRoomID}`
            );

            // Set the "capital" field of the city 'DC'
            updateDoc(liveSessionRef, {
              isARecording: true,
              recordingURL: `${givenURL}`,
            }).then((success) => console.log("Successfully Updated the doc"));
          });
      }
    );
  } catch (e) {
    throw Error("Could not convert it to blob");
  }
};
