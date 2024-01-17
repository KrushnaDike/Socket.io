import React, { Fragment, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:2000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();

    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();

    socket.emit("join-room", roomName);
    console.log("You joined room ", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected", socket.id);
    });

    socket.on("recieve-message", (data) => {
      console.log(data);
      setMessages((message) => [...message, data]);
    });

    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Fragment>
      <Container maxWidth="sm">
        <Typography varient="h1" component={"div"} gutterBottom>
          Welcome to Socket.io
        </Typography>

        <Typography varient="h1" component={"div"} gutterBottom>
          {socketId}
        </Typography>

        <h5>Join Room</h5>
        <form onSubmit={joinRoomHandler}>
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            id="outlined-basic3"
            label="Room Name"
            varient="outlined"
          />

          <Button type="submit" varient="contained" color="primary">
            Join
          </Button>
        </form>

        <form onSubmit={submitHandler}>
          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            id="outlined-basic1"
            label="Room"
            varient="outlined"
          />

          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="outlined-basic2"
            label="Message"
            varient="outlined"
          />
          <Button type="submit" varient="contained" color="primary">
            Send
          </Button>
        </form>

        <Stack>
          {messages &&
            messages.map((message, index) => (
              <Typography
                key={index}
                varient="h1"
                component={"div"}
                gutterBottom
              >
                {message}
              </Typography>
            ))}
        </Stack>
      </Container>
    </Fragment>
  );
};

export default App;
