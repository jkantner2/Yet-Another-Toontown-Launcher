import React, { useState } from "react";
import { Login } from "../../../bindings/YATL/services/loginservice";

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
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button
        type="button"
        onClick={handlePlay}>Play
      </button>
      <p>{message}</p>
    </div>
  );
};

export default LoginPage;
