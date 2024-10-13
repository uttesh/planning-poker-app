// src/App.tsx
import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import {
  Container,
  TextField,
  Button,
  Card,
  Typography,
  Grid,
  CardContent
} from "@mui/material";

interface RoomData {
  participants: string[];
}

interface Results {
  [points: string]: string[];
}

const socket: Socket = io("http://localhost:3001");

const App: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [results, setResults] = useState<Results>({});

  const joinRoom = () => {
    socket.emit("joinRoom", { roomId, username });
  };

  const submitVote = (points: number) => {
    socket.emit("vote", { roomId, username, points });
  };

  useEffect(() => {
    socket.on("participants", (roomData: RoomData) => {
      setParticipants(roomData.participants);
    });

    socket.on("results", (data: Results) => {
      setResults(data);
    });

    return () => {
      socket.off("participants");
      socket.off("results");
    };
  }, []);

  const hasVoted = (participant: string): boolean => {
    return Object.values(results).some((users) => users.includes(participant));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Story Point Planning Poker
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TextField
            label="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={joinRoom}>
            Join Room
          </Button>
        </Grid>
      </Grid>

      <div style={{ marginTop: "20px" }}>
        <Typography variant="h6">Participants</Typography>
        <Grid container spacing={2}>
          {participants.map((participant, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
            </Grid>
          ))}
        </Grid>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Typography variant="h6">Select Your Points</Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 5, 8].map((point) => (
            <Grid item key={point}>
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
      </div>

      <div style={{ marginTop: "20px" }}>
        {Object.keys(results).length > 0 && (
          <div>
            <Typography variant="h6">Results</Typography>
            {Object.entries(results).map(([points, users]) => (
              <Card key={points} style={{ marginTop: "10px" }}>
                <CardContent>
                  <Typography variant="h6">Points: {points}</Typography>
                  <Typography variant="body1">Participants:</Typography>
                  <ul>
                    {users.map((user, index) => (
                      <li key={index}>{user}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default App;
