import { FC } from "react";
import Grid from "@mui/material/Grid2";
import { Card, Typography, CardContent } from "@mui/material";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""'
    }
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0
    }
  }
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`
}));

export interface ParticipantsProps {
  participants: string[];
  hasVoted: (participant: string) => boolean;
}

export const ParticipantsComponent: FC<ParticipantsProps> = ({
  participants,
  hasVoted
}) => {
  return (
    <>
      <Typography variant="h6">Participants compo</Typography>
      <Grid container spacing={2}>
        {participants.map((participant, index) => (
          <Grid size={{ xs: 12, md: 4, sm: 6 }} key={index}>
            <>
              <Card
                style={{
                  backgroundColor: hasVoted(participant) ? "#e0ffe0" : "#ffcccc"
                }}
              >
                <CardContent>
                  <Typography variant="h6">{participant}</Typography>
                  <Typography variant="body1">
                    Status: {hasVoted(participant) ? "Submitted" : "Pending"}
                  </Typography>
                </CardContent>
              </Card>
              {/* <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar alt={participant} src="/static/images/avatar/1.jpg" />
              </StyledBadge>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <SmallAvatar
                    alt={participant}
                    src="/static/images/avatar/1.jpg"
                  />
                }
              >
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              </Badge> */}
            </>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
