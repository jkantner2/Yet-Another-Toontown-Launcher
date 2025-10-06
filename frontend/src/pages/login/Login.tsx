import React, { useState } from "react";
import { Login } from "../../../bindings/YATL/services/loginservice";
import { Container, TextInput } from "@mantine/core";
import { Button } from "@mantine/core";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePlay = async () => {
    const result = await Login(username, password);
    setMessage(result);
  };

  return (
    <div>
      <h2>Login</h2>
      <Container
        w={300}
      >
        <TextInput
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextInput
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          onClick={handlePlay}
          variant="light"
        >
          Play
        </Button>

        <p>{message}</p>
      </Container>
    </div>
  );
};

export default LoginPage;
