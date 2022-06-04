import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/firebase/auth";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Controller, useForm } from "react-hook-form";
import { LiveSession } from "../../../model/LiveSessions/LiveSession";
import mediaIDList from "../../../data/mediaIDList";
import { v4 as uuidv4 } from "uuid";
import AddInterestTagsFormInput from "../HelperComponents/AddInterestTagsFormInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { AiOutlineLoading } from "react-icons/ai";

const CreateLiveSessionForm = () => {
  // obtain HCP data from Auth
  const { user } = useAuth();
  // Obtain the Router
  const router = useRouter();
  // loading message state
  const [loading, setLoading] = useState(false);
  // error message state
  const [errorMessage, setErrorMessage] = useState("");
  const [interestTags, setInterestTags] = useState([]);
  const { handleSubmit, register, watch, control } = useForm({
    defaultCreateLiveSessionFormValues,
  });

  //---- Helper Functions ----
  const defaultCreateLiveSessionFormValues = {
    UpcomingLiveSessionDatePicker: new Date(),
  };

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

  const saveLiveSessionData = async (givenData, e) => {
    setLoading(true);
    setErrorMessage("");
    try {
      // create a new instance of Live Session
      const createdLiveSession = new LiveSession(
        givenData.id,
        givenData.title,
        givenData.description,
        givenData.UpcomingLiveSessionDatePicker,
        givenData.createdByHcpId,
        givenData.interests,
        [] /*empty report set*/,
        givenData.mediaId
      );

      await createdLiveSession.save();

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
   * Extract HCP user live session input and save it to the database
   * @param {*} givenData 
   * input data structure sample: 
   * {
   "title": "About Alcohol abuse",
   "description": "This is just a test description",
   "isScheduled": false,
   "UpcomingLiveSessionDatePicker": "2022-06-04T02:48:35.856Z",
   id: uuidv4(),
        interests: interestTags,
        mediaId: mediaIDList.liveSession,
        createdByHcpId: user.uid
        *  }
        */
  const extractLiveSessionData = (givenData, e) => {
    e.preventDefault();
    setInterestTags(() => simplifyArray(interestTags));

    givenData = {
      ...givenData,
      id: uuidv4(),
      interests: interestTags,
      mediaId: mediaIDList.liveSession,
      createdByHcpId: user.uid,
    };
    if (givenData.isScheduled === false)
      givenData.UpcomingLiveSessionDatePicker = new Date();

    saveLiveSessionData(givenData, e);
    // redirect to live session page
    router.push(`/livesession/${givenData.id}`);
  };

  return (
    <div className="outline outline-green-500">
      <form
        className="flex flex-col gap-y-[2rem]"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit((givenData, e) =>
          extractLiveSessionData(givenData, e)
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
        <div>
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="isScheduled"
                defaultValue={false}
                render={({ field }) => (
                  <>
                    <Switch {...field} />
                  </>
                )}
              />
            }
            label="Schedule later"
          ></FormControlLabel>
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="UpcomingLiveSessionDatePicker"
                render={({ field }) => (
                  <ReactDatePicker
                    className="input"
                    placeholderText="Select date"
                    onChange={(e) => field.onChange(e)}
                    disabled={!watch("isScheduled")}
                    selected={field.value}
                  />
                )}
              />
            }
          ></FormControlLabel>
        </div>
        <h2>Make your live easier to discover</h2>
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
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

export default CreateLiveSessionForm;
