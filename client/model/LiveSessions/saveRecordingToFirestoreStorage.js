import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "@/firebase/clientApp";
import { storage } from "@/firebase/clientApp";

import { doc, getDoc, updateDoc } from "firebase/firestore";

export const saveRecordingToFirestoreStorage = async (
  url,
  liveSessionRoomID,
  createdByHcpId,
  videoRecordingStatus,
  audioRecordingStatus,
  shareScreenRecordingStatus
) => {
  if (!url) {
    console.log("Going to return nothing");
    return;
  }

  let storageRef;
  let storagePath;
  let metaData;

  console.log("url is:", url);
  var matches = url.match(/\bhttps?:\/\/\S+/gi);
  console.log("url2 is: ", matches);
  let givenBlob = await fetch(url).then((r) => r.blob());
  console.log("file_name is:", url, "b64 is: ", givenBlob);

  try {
    if (videoRecordingStatus) {
      storagePath = `recordings/${createdByHcpId}/${liveSessionRoomID}.mp4`;
      metaData = { contentType: "video/mp4" };
    } else if (audioRecordingStatus) {
      storagePath = `recordings/${createdByHcpId}/${liveSessionRoomID}.wav`;
      metaData = { contentType: "audio/wav" };
    } else if (shareScreenRecordingStatus) {
      storagePath = `recordings/${createdByHcpId}/${liveSessionRoomID}.webm`;
      metaData = { contentType: "video/webm" };
    }
    storageRef = ref(storage, storagePath);

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

            // Set the "isARecording" field of the liveSessionRef 'true' and recordingURL to the download URL
            updateDoc(liveSessionRef, {
              isARecording: true,
              recordingURL: `${givenURL}`,
              recordingStoragePath: `${storagePath}`,
            })
              .then((success) => console.log("Successfully Updated the doc"))
              .catch((e) => {
                throw Error("Unable to store document", e);
              });
          });
      }
    );
  } catch (e) {
    throw Error("Could not convert it to blob");
  }
};
