import Button from "@mui/material/Button";

const HCPControls = ({ liveSessionRoomID }) => {
  return (
    <div className="outline outline-cyan-500 ">
      <h1>HCP Controls</h1>
      <Button
        variant="contained"
        sx={{
          bgcolor: "#86a819",
          "&:hover": {
            color: "white",
            backgroundColor: "#a9de09",
          },
        }}
      >
        Press Record
      </Button>
      <Button
        variant="contained"
        sx={{
          bgcolor: "#86a819",
          "&:hover": {
            color: "white",
            backgroundColor: "#a9de09",
          },
        }}
      >
        Share Screen
      </Button>
      <Button
        variant="contained"
        sx={{
          bgcolor: "#86a819",
          "&:hover": {
            color: "white",
            backgroundColor: "#a9de09",
          },
        }}
      >
        End Live Session
      </Button>
    </div>
  );
};

export default HCPControls;
