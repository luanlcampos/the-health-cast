import { useEffect, useState } from "react";
import { storage } from "@/firebase/clientApp";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  getMetadata,
} from "firebase/storage";
import { useAuth } from "@/firebase/auth";
import SignedLayout from "@/components/Layout/SignedLayout";
import Link from "next/link";
import Loading from "@/components/Loading";
import { LinearProgress } from "@mui/material";

export default function Recordings() {
  const { user } = useAuth();

  // State to store uploaded file
  const [file, setFile] = useState("");

  // progress
  const [percent, setPercent] = useState(0);

  // recording list
  const [recordings, setRecordings] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // Handle file upload event and update state
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  useEffect(() => {
    setIsLoading(true);
    const listRecordings = async () => {
      const recordingsRef = ref(storage, `recordings/${user.uid}`);
      const { items } = await listAll(recordingsRef);

      setRecordings([]);
      items.forEach(async (item) => {
        const { name } = item;
        const { size } = await getMetadata(item);
        const url = await getDownloadURL(item);
        // convert size to MB
        const sizeMB = Math.round(size / 1024 / 1024);
        setRecordings((prev) => [...prev, { name, url, size: sizeMB }]);
      });
      setIsLoading(false);
    };

    listRecordings().catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const handleUpload = () => {
    if (!file) {
      alert("Please upload an image first!");
      return;
    }

    // file name should be the live title
    const storageRef = ref(storage, `recordings/${user.uid}/${file.name}`);

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);
    setShowProgress(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
    setShowProgress(false);
    setPercent(0);
    setFile("");
  };

  return (
    <SignedLayout>
      <div>
        <input type="file" onChange={handleChange} accept="/video/*" />
        <button
          onClick={handleUpload}
          className={"bg-my-green text-white rounded-md p-5"}
        >
          Upload to Firebase
        </button>
        <div className="flex flex-col">
          <LinearProgress variant="determinate" value={percent} />
        </div>

        <div className="recording-card">
          {recordings.map((recording) => (
            <div className="recording-item" key={recording.name}>
              <Link href={recording.url}>
                <a target="_blank">{recording.name}</a>
              </Link>
              <br />
              <span className="text-[rgba(0,0,0,0.5)]">
                Size: {recording.size} mb
              </span>
              <br />
            </div>
          ))}
        </div>
        {/* <div className="aspect-video">
          <video width="100%" height="100%" controls>
            <source
              src="https://firebasestorage.googleapis.com/v0/b/authtest-5cf01.appspot.com/o/r2VirE3RvGY0gfmNACj7OHOy2II2%2Fmap524-t1-llima-campos.mp4?alt=media&token=c361b26b-b474-4a3c-891c-0508f9c50d1e"
              type="video/mp4"
            />
          </video>
        </div> */}
      </div>
    </SignedLayout>
  );
}
