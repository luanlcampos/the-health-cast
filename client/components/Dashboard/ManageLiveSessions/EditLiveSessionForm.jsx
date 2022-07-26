import { useForm, Controller } from "react-hook-form";
import { Box, Button, Grid, TextField } from "@mui/material";
import { modifyLiveSessionTitleDescription } from "@/model/LiveSessions/modifyLiveSession";

const options = ["A", "B", "C", "D"];
const objOptions = [
  { value: 65, label: "A" },
  { value: 66, label: "B" },
  { value: 67, label: "C" },
];
const myHelper = {
  email: {
    required: "Email is Required",
    pattern: "Invalid Email Address",
  },
};

const defaultValues = {
  title: "",
  description: "",
};

export default function EditLiveSessionForm({
  setAlertMessage,
  givenLiveSessionID, handleClose
}) {
  const { control, handleSubmit } = useForm({
    defaultValues,
    reValidateMode: "onBlur",
  });

  console.count("app rerender");

  const handleOnSubmit = (evt) => {
    console.log("Event object", evt);
    console.log("given Live Session ID", givenLiveSessionID);
    modifyLiveSessionTitleDescription(
      givenLiveSessionID,
      evt.title,
      evt.description
    );
    setAlertMessage(
      "Live Session/Recording successfully edited. Please refresh the page to reflect the results"
    );
    handleClose()
  };

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit(handleOnSubmit)}>
        <Grid spacing={3}>
          <Grid
            className="m-8"
            item
            xs={6}
            sx={{
              mb: 2,
            }}
          >
            <Controller
              control={control}
              name="title"
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  {...fieldState}
                  fullWidth
                  variant="filled"
                  label="Title"
                />
              )}
              rules={{ required: "Title is required" }}
            />
          </Grid>
          <Grid
            className="m-8"
            item
            xs={6}
            sx={{
              mb: 2,
            }}
          >
            <Controller
              control={control}
              name="description"
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  {...fieldState}
                  fullWidth
                  variant="filled"
                  multiline
                  rows={4}
                  label="Description"
                />
              )}
              rules={{ required: "Description is required" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit">Submit</Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
