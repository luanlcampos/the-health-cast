import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/firebase/auth";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Controller, useForm } from "react-hook-form";
import { Thread } from "../../../model/Thread/thread";
import { v4 as uuidv4 } from "uuid";
import AddInterestTagsFormInput from "../HelperComponents/AddInterestTagsFormInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AiOutlineLoading } from "react-icons/ai";

const CreateThread = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [interestTags, setInterestTags] = useState([]);

  const { handleSubmit, register, control } = useForm();

  const handleInterestsChange = (givenInterests) => {
    givenInterests = simplifyArray(givenInterests);
    setInterestTags(givenInterests);
  };

  const simplifyArray = (givenArray) => {
    let tempArray = [];

    if (givenArray.length === 0 || !givenArray[0]) return [];
    else {
      givenArray.forEach((givenItem) => {
        return tempArray.push(givenItem.value);
      });
      return tempArray;
    }
  };

  const saveThreadData = async (givenData, e) => {
    setLoading(true);
    setErrorMessage("");
    try {
      // create a new instance of Live Session
      const createdThread = new Thread(
        givenData.id,
        givenData.authorId,
        givenData.title,
        givenData.description,
        givenData.content,
        givenData.replies,
        givenData.interests
      );

      await createdThread.save();

      setLoading(false);
    } catch (error) {
      setErrorMessage(<p>Something went wrong</p>);
      // catch already exists error

      console.warn(error);
      setLoading(false);
    }
  };
  // ----------------------------
  /**
 * Extract thread input and save it to the database
 * @param {*} givenData 
 * input data structure sample: 
 * {
 "title": "About Alcohol abuse",
 "description": "givenData is just a test description",
 id: uuidv4(),
      interests: interestTags,
      authorId: user.uid
      *  }
      */
  const extractThreadData = (givenData, e) => {
    e.preventDefault();
    setInterestTags(() => simplifyArray(interestTags));

    givenData = {
      ...givenData,
      id: uuidv4(),
      interests: interestTags,
      authorId: user.uid,
    };

    saveThreadData(givenData, e).then(() => {
      // redirect to live session page
      router.push(`/thread/${givenData.id}`);
    });
  };

  return (
    <div>
      <form
        className="flex flex-col gap-y-[2rem]"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit((givenData, e) =>
          extractThreadData(givenData, e)
        )}
      >
        {errorMessage !== "" && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}
        <div>
          <TextField
            className="w-full"
            name="title"
            id="title"
            label="Title"
            {...register("title", { required: true })}
          />
        </div>
        <div>
          <TextField
            className="w-full"
            name="description"
            id="description"
            label="Description"
            multiline
            rows={4}
            {...register("description", { required: true })}
          />
        </div>
        <h2>Make your thread easier to discover</h2>
        <div>
          <FormControlLabel
            className="w-full"
            control={
              <Controller
                control={control}
                name="interests"
                render={({ field: { value } }) => (
                  <AddInterestTagsFormInput
                    className="w-full"
                    {...{ handleInterestsChange, value }}
                  />
                )}
              />
            }
          ></FormControlLabel>
        </div>
        <Button
          variant="contained"
          className="bg-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {!loading ? (
            "Submit"
          ) : (
            <AiOutlineLoading className="loading-spinner" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateThread;
