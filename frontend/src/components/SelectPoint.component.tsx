import { FC } from "react";
import { Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";

interface SelectPointsProps {
  submitVote: (point: number) => void;
}

export const SelectPointsComponent: FC<SelectPointsProps> = ({
  submitVote
}) => {
  return (
    <>
      <Typography variant="h6">Select Your Points</Typography>
      <Grid container spacing={2}>
        {[1, 2, 3, 5, 8, 13].map((point) => (
          <Grid key={point}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => submitVote(point)}
            >
              {point}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
